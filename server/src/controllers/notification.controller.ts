import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { prisma } from '../config/database';

export class NotificationController {
  async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId: req.userId! },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });

      const unreadCount = await prisma.notification.count({
        where: { userId: req.userId!, read: false },
      });

      res.json({ data: notifications, unreadCount });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await prisma.notification.update({
        where: { id },
        data: { read: true },
      });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await prisma.notification.updateMany({
        where: { userId: req.userId!, read: false },
        data: { read: true },
      });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const notificationController = new NotificationController();
