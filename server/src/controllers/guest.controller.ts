import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { emailService } from '../services/email.service';

export class GuestController {
  async add(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) throw new AppError('Événement non trouvé', 404);
      if (event.organizerId !== req.userId && req.userRole !== 'ADMIN') {
        throw new AppError('Non autorisé', 403);
      }

      const existing = await prisma.guest.findUnique({
        where: { eventId_email: { eventId, email: req.body.email } },
      });
      if (existing) throw new AppError('Cet invité existe déjà', 400);

      const guest = await prisma.guest.create({
        data: { ...req.body, eventId },
      });

      try {
        const rsvpLink = `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/events/${eventId}?guest=${guest.id}`;
        await emailService.sendInvitation(guest.email, event.title, rsvpLink);
      } catch (emailError) {
        console.error('Erreur envoi email:', emailError);
      }

      res.status(201).json(guest);
    } catch (error) {
      next(error);
    }
  }

  async bulkAdd(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const { guests } = req.body;

      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) throw new AppError('Événement non trouvé', 404);

      const created = await prisma.guest.createMany({
        data: guests.map((g: any) => ({ ...g, eventId })),
      });

      res.status(201).json({ created: created.count });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const { status } = req.query;

      const where: any = { eventId };
      if (status) where.status = status;

      const guests = await prisma.guest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      res.json(guests);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const guest = await prisma.guest.update({
        where: { id },
        data: { status, respondedAt: new Date() },
      });

      res.json(guest);
    } catch (error) {
      next(error);
    }
  }

  async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await prisma.guest.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const guestController = new GuestController();
