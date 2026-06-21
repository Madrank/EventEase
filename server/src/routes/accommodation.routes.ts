import { Router } from 'express';
import { accommodationController } from '../controllers/accommodation.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/register', accommodationController.create.bind(accommodationController));
router.get('/', accommodationController.findAll.bind(accommodationController));
router.get('/availability/:id', accommodationController.getAvailability.bind(accommodationController));
router.get('/:id', accommodationController.findOne.bind(accommodationController));
router.post('/:id/book', authenticate, accommodationController.book.bind(accommodationController));
router.get('/:id/bookings', accommodationController.getBookings.bind(accommodationController));

export default router;
