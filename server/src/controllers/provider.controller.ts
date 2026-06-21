import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';

export class ProviderController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const provider = await prisma.provider.create({ data: req.body });
      res.status(201).json(provider);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { category, city, search, page = '1', limit = '20' } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};
      if (category) where.category = category;
      if (city) where.city = { contains: city as string };
      if (search) {
        where.OR = [
          { name: { contains: search as string } },
          { description: { contains: search as string } },
        ];
      }

      const [providers, total] = await Promise.all([
        prisma.provider.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { rating: 'desc' },
        }),
        prisma.provider.count({ where }),
      ]);

      res.json({
        data: providers,
        pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
      });
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const provider = await prisma.provider.findUnique({
        where: { id: req.params.id },
        include: { bookings: true },
      });
      if (!provider) throw new AppError('Prestataire non trouvé', 404);
      res.json(provider);
    } catch (error) {
      next(error);
    }
  }

  async book(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { eventId, providerId } = req.params;

      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) throw new AppError('Événement non trouvé', 404);
      if (event.organizerId !== req.userId) throw new AppError('Non autorisé', 403);

      const provider = await prisma.provider.findUnique({ where: { id: providerId } });
      if (!provider) throw new AppError('Prestataire non trouvé', 404);

      const booking = await prisma.booking.create({
        data: {
          eventId,
          providerId,
          ...req.body,
        },
        include: { provider: true },
      });

      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  }

  async updateBooking(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const booking = await prisma.booking.update({
        where: { id },
        data: req.body,
        include: { provider: true },
      });
      res.json(booking);
    } catch (error) {
      next(error);
    }
  }

  async getBookings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const bookings = await prisma.booking.findMany({
        where: { eventId },
        include: { provider: true },
      });
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  }

  async getAvailability(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const bookings = await prisma.booking.findMany({
        where: { providerId: req.params.id },
        select: { date: true },
      });
      const bookedDates = bookings.filter(b => b.date).map(b => b.date!.toISOString().split('T')[0]);
      res.json(bookedDates);
    } catch (error) {
      next(error);
    }
  }

  async contact(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { dates, message } = req.body;
      const provider = await prisma.provider.findUnique({ where: { id } });
      if (!provider) throw new AppError('Prestataire non trouvé', 404);

      const booking = await prisma.booking.create({
        data: {
          providerId: id,
          userId: req.userId!,
          status: 'PENDING',
          notes: `Dates: ${(dates as string[]).join(', ')}${message ? ` - Message: ${message}` : ''}`,
          date: dates?.length ? new Date(dates[0]) : null,
        },
        include: { provider: true },
      });
      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  }
}

export const providerController = new ProviderController();
