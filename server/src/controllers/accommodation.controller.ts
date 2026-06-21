import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';

export class AccommodationController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const accommodation = await prisma.accommodation.create({ data: req.body });
      res.status(201).json(accommodation);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { city, capacity, minPrice, maxPrice, type, page = '1', limit = '20' } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;

      const where: any = { available: true };
      if (city) where.city = { contains: city as string };
      if (capacity) where.capacity = { gte: parseInt(capacity as string, 10) };
      if (type) where.type = type;
      if (minPrice) where.pricePerNight = { ...where.pricePerNight, gte: parseFloat(minPrice as string) };
      if (maxPrice) where.pricePerNight = { ...where.pricePerNight, lte: parseFloat(maxPrice as string) };

      const [accommodations, total] = await Promise.all([
        prisma.accommodation.findMany({ where, skip, take: limitNum, orderBy: { pricePerNight: 'asc' } }),
        prisma.accommodation.count({ where }),
      ]);

      res.json({
        data: accommodations,
        pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
      });
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const accommodation = await prisma.accommodation.findUnique({
        where: { id: req.params.id },
        include: { bookings: { orderBy: { createdAt: 'desc' }, take: 10 } },
      });
      if (!accommodation) throw new AppError('Hébergement non trouvé', 404);
      res.json(accommodation);
    } catch (error) {
      next(error);
    }
  }

  async book(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const accommodation = await prisma.accommodation.findUnique({ where: { id } });
      if (!accommodation) throw new AppError('Hébergement non trouvé', 404);
      if (!accommodation.available) throw new AppError('Cet hébergement n\'est pas disponible', 400);

      const booking = await prisma.accommodationBooking.create({
        data: {
          accommodationId: id,
          userId: req.userId!,
          eventId: req.body.eventId || null,
          checkIn: req.body.checkIn ? new Date(req.body.checkIn) : null,
          checkOut: req.body.checkOut ? new Date(req.body.checkOut) : null,
          guests: req.body.guests || 1,
          notes: req.body.notes || null,
          status: 'CONFIRMED',
        },
        include: { accommodation: true },
      });

      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  }

  async getBookings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const bookings = await prisma.accommodationBooking.findMany({
        where: { accommodationId: id },
        orderBy: { createdAt: 'desc' },
        include: { accommodation: true },
      });
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  }

  async getAvailability(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const bookings = await prisma.accommodationBooking.findMany({
        where: { accommodationId: req.params.id, status: 'CONFIRMED' },
        select: { checkIn: true, checkOut: true },
      });
      const ranges = bookings
        .filter(b => b.checkIn && b.checkOut)
        .map(b => ({ checkIn: b.checkIn!.toISOString().split('T')[0], checkOut: b.checkOut!.toISOString().split('T')[0] }));
      res.json(ranges);
    } catch (error) {
      next(error);
    }
  }
}

export const accommodationController = new AccommodationController();
