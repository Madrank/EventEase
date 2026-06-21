import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/config', paymentController.getPublishableKey.bind(paymentController));
router.post('/create-checkout-session', authenticate, paymentController.createCheckoutSession.bind(paymentController));
router.post('/webhook', paymentController.webhook.bind(paymentController));

export default router;
