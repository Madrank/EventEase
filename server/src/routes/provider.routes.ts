import { Router } from 'express';
import { providerController } from '../controllers/provider.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', providerController.findAll.bind(providerController));
router.get('/availability/:id', providerController.getAvailability.bind(providerController));
router.post('/:id/contact', authenticate, providerController.contact.bind(providerController));
router.get('/:id', providerController.findOne.bind(providerController));
router.post('/register', providerController.create.bind(providerController));
router.post('/', authenticate, providerController.create.bind(providerController));
router.get('/:eventId/bookings', authenticate, providerController.getBookings.bind(providerController));
router.post('/:eventId/:providerId/book', authenticate, providerController.book.bind(providerController));
router.put('/bookings/:id', authenticate, providerController.updateBooking.bind(providerController));

export default router;
