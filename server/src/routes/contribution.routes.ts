import { Router } from 'express';
import { contributionController } from '../controllers/contribution.controller';
import { authenticate } from '../middlewares/auth';

const router = Router({ mergeParams: true });

router.get('/', contributionController.findAll.bind(contributionController));
router.post('/', authenticate, contributionController.create.bind(contributionController));

export default router;
