import { Router } from 'express';
import authRoutes from './auth.routes';
import eventRoutes from './event.routes';
import guestRoutes from './guest.routes';
import providerRoutes from './provider.routes';
import accommodationRoutes from './accommodation.routes';
import contributionRoutes from './contribution.routes';
import notificationRoutes from './notification.routes';
import paymentRoutes from './payment.routes';
import uploadRoutes from './upload.routes';
import { authenticate } from '../middlewares/auth';
import { prisma } from '../config/database';

const router = Router();

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/events/:eventId/guests', guestRoutes);
router.use('/events/:eventId/contributions', contributionRoutes);
router.use('/providers', providerRoutes);
router.use('/accommodations', accommodationRoutes);
router.use('/notifications', notificationRoutes);
router.use('/payments', paymentRoutes);
router.use('/upload', uploadRoutes);

router.get('/my-bookings', authenticate, async (req: any, res, next) => {
  try {
    const [accommodationBookings, providerBookings] = await Promise.all([
      prisma.accommodationBooking.findMany({
        where: { userId: req.userId },
        include: { accommodation: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.booking.findMany({
        where: { userId: req.userId },
        include: { provider: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    res.json({ accommodationBookings, providerBookings });
  } catch (error) {
    next(error);
  }
});

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
