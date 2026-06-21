import { Router } from 'express';
import { eventController } from '../controllers/event.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createEventSchema, updateEventSchema } from '../validations/event.validation';

const router = Router();

router.get('/', eventController.findAll.bind(eventController));
router.get('/my-events', authenticate, eventController.getMyEvents.bind(eventController));
router.get('/:id', eventController.findOne.bind(eventController));
router.post('/', authenticate, validate(createEventSchema), eventController.create.bind(eventController));
router.put('/:id', authenticate, validate(updateEventSchema), eventController.update.bind(eventController));
router.delete('/:id', authenticate, eventController.delete.bind(eventController));

export default router;
