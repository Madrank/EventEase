import { Router } from 'express';
import { guestController } from '../controllers/guest.controller';
import { authenticate } from '../middlewares/auth';

const router = Router({ mergeParams: true });

router.get('/', authenticate, guestController.findAll.bind(guestController));
router.post('/', authenticate, guestController.add.bind(guestController));
router.post('/bulk', authenticate, guestController.bulkAdd.bind(guestController));
router.put('/:id/status', guestController.updateStatus.bind(guestController));
router.delete('/:id', authenticate, guestController.remove.bind(guestController));

export default router;
