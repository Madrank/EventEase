import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

export class PaymentController {
  async createCheckoutSession(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!stripe) {
        // Mock mode — skip Stripe, mark as completed directly
        const { contributionId, eventId, amount } = req.body;
        if (contributionId) {
          await prisma.contribution.update({
            where: { id: contributionId },
            data: { status: 'COMPLETED' },
          });
        }
        return res.json({ url: `${baseUrl}/payment/success?mock=true` });
      }

      const { contributionId, eventId, amount, metadata } = req.body;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: metadata?.name || 'Contribution EventEase',
              description: metadata?.description || undefined,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&contributionId=${contributionId || ''}&eventId=${eventId || ''}`,
        cancel_url: `${baseUrl}/payment/cancel`,
        metadata: {
          contributionId: contributionId || '',
          eventId: eventId || '',
          userId: req.userId || '',
        },
      });

      res.json({ url: session.url });
    } catch (error) {
      next(error);
    }
  }

  async webhook(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!stripe) return res.status(200).json({ received: true });

      const sig = req.headers['stripe-signature'] as string;
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event: Stripe.Event;
      if (endpointSecret) {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } else {
        event = JSON.parse(req.body);
      }

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const contributionId = session.metadata?.contributionId;

        if (contributionId) {
          await prisma.contribution.update({
            where: { id: contributionId },
            data: { status: 'COMPLETED' },
          });
        }
      }

      res.json({ received: true });
    } catch (error) {
      next(error);
    }
  }

  async getPublishableKey(_req: AuthRequest, res: Response) {
    res.json({ key: process.env.STRIPE_PUBLISHABLE_KEY || '' });
  }
}

export const paymentController = new PaymentController();
