import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';

export class ContributionController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;

      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) throw new AppError('Événement non trouvé', 404);

      const contribution = await prisma.contribution.create({
        data: {
          eventId,
          userId: req.userId!,
          amount: req.body.amount,
          message: req.body.message,
          anonymous: req.body.anonymous || false,
          status: req.body.status || 'COMPLETED',
        },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, avatar: true },
          },
        },
      });

      res.status(201).json(contribution);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;

      const contributions = await prisma.contribution.findMany({
        where: { eventId },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, avatar: true },
          },
        },
      });

      const total = contributions.reduce((sum, c) => sum + c.amount, 0);

      res.json({ data: contributions, total });
    } catch (error) {
      next(error);
    }
  }
}

export const contributionController = new ContributionController();
