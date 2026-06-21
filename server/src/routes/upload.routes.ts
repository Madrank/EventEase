import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';
import { authenticate } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.post('/', authenticate, upload.single('file'), uploadController.upload.bind(uploadController));
router.post('/multiple', authenticate, upload.array('files', 10), uploadController.uploadMultiple.bind(uploadController));

export default router;
