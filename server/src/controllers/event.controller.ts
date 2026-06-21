import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { Prisma } from '@prisma/client';

export class EventController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const event = await prisma.event.create({
        data: {
          ...req.body,
          organizerId: req.userId!,
        },
        include: {
          organizer: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      });
      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = '1', limit = '10', search, category, city, status } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;

      const where: Prisma.EventWhereInput = {};

      if (search) {
        where.OR = [
          { title: { contains: search as string } },
          { description: { contains: search as string } },
          { city: { contains: search as string } },
        ];
      }
      if (category) where.category = category as string;
      if (city) where.city = { contains: city as string };
      if (status) where.status = status as any;

      const [events, total] = await Promise.all([
        prisma.event.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { date: 'asc' },
          include: {
            organizer: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
            _count: {
              select: { guests: true, contributions: true },
            },
          },
        }),
        prisma.event.count({ where }),
      ]);

      res.json({
        data: events,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const event = await prisma.event.findUnique({
        where: { id: req.params.id },
        include: {
          organizer: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          guests: {
            select: { id: true, email: true, firstName: true, lastName: true, status: true },
          },
          providers: {
            include: {
              provider: true,
            },
          },
          contributions: {
            include: {
              user: {
                select: { id: true, firstName: true, lastName: true, avatar: true },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: { guests: true, contributions: true, providers: true },
          },
        },
      });

      if (!event) {
        throw new AppError('Événement non trouvé', 404);
      }

      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const existing = await prisma.event.findUnique({ where: { id: req.params.id } });
      if (!existing) throw new AppError('Événement non trouvé', 404);
      if (existing.organizerId !== req.userId && req.userRole !== 'ADMIN') {
        throw new AppError('Non autorisé à modifier cet événement', 403);
      }

      const event = await prisma.event.update({
        where: { id: req.params.id },
        data: req.body,
      });

      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const existing = await prisma.event.findUnique({ where: { id: req.params.id } });
      if (!existing) throw new AppError('Événement non trouvé', 404);
      if (existing.organizerId !== req.userId && req.userRole !== 'ADMIN') {
        throw new AppError('Non autorisé à supprimer cet événement', 403);
      }

      await prisma.event.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getMyEvents(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const events = await prisma.event.findMany({
        where: { organizerId: req.userId! },
        orderBy: { date: 'asc' },
        include: {
          _count: {
            select: { guests: true, contributions: true },
          },
        },
      });

      res.json(events);
    } catch (error) {
      next(error);
    }
  }
}

export const eventController = new EventController();
