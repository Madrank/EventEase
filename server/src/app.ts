import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { config } from './config';
import { logger } from './config/logger';
import { connectDatabase } from './config/database';
import { errorHandler } from './middlewares/errorHandler';
import { paymentController } from './controllers/payment.controller';
import routes from './routes';

const app = express();

connectDatabase();

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
const allowedOrigins = config.cors.origin.split(',').map(o => o.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origine non autorisée par CORS'));
    }
  },
  credentials: true,
}));
app.use(compression());

// Stripe webhook needs raw body — must be before JSON parser
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), paymentController.webhook.bind(paymentController));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
const uploadDir = process.env.UPLOAD_DIR || './uploads';
app.use('/uploads', express.static(path.resolve(uploadDir)));

app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Trop de requêtes, veuillez réessayer plus tard' },
});
app.use('/api', limiter);

app.use('/api', routes);

app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`🚀 Serveur EventEase démarré sur le port ${PORT}`);
  logger.info(`📚 API: http://localhost:${PORT}/api`);
  logger.info(`❤️  Health: http://localhost:${PORT}/api/health`);
});

export default app;
