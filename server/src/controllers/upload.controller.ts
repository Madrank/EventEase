import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { AppError } from '../middlewares/errorHandler';
import path from 'path';
import fs from 'fs';

const uploadDir = process.env.UPLOAD_DIR || './uploads';

export class UploadController {
  async upload(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new AppError('Aucun fichier fourni', 400);

      const url = `/uploads/${req.file.filename}`;
      res.json({ url, filename: req.file.filename });
    } catch (error) {
      next(error);
    }
  }

  async uploadMultiple(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.files || !(req.files as Express.Multer.File[]).length) {
        throw new AppError('Aucun fichier fourni', 400);
      }
      const files = (req.files as Express.Multer.File[]).map(f => ({
        url: `/uploads/${f.filename}`,
        filename: f.filename,
      }));
      res.json({ files });
    } catch (error) {
      next(error);
    }
  }
}

export const uploadController = new UploadController();
