import { Router, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { requireRole } from '../middleware/validateRole.js';
import { AppError } from '../middleware/error.js';

const router = Router();
const prisma = new PrismaClient();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'logos');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const authReq = req as AuthRequest;
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    const filename = `${authReq.user!.userId}-${timestamp}${ext}`;
    cb(null, filename);
  },
});

// File filter for image validation
const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = ['image/png', 'image/jpeg', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PNG, JPEG, and WebP are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

// POST /api/supplier/logo - Upload supplier logo
router.post(
  '/',
  authenticate,
  requireRole(Role.SUPPLIER),
  (req, res, next) => {
    upload.single('logo')(req, res, (err: unknown) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          res.status(413).json({
            error: 'File too large',
            message: 'Maximum file size is 2MB',
          });
          return;
        }
        res.status(400).json({
          error: 'Upload error',
          message: err.message,
        });
        return;
      } else if (err) {
        res.status(400).json({
          error: 'Invalid file',
          message: err instanceof Error ? err.message : 'Unknown error',
        });
        return;
      }
      next();
    });
  },
  async (req: AuthRequest, res: Response, next) => {
    try {
      if (!req.file) {
        throw new AppError(400, 'No file uploaded');
      }

      // Get supplier profile
      const supplier = await prisma.supplierProfile.findUnique({
        where: { userId: req.user!.userId },
      });

      if (!supplier) {
        throw new AppError(404, 'Supplier profile not found');
      }

      // Delete old logo file if exists
      if (supplier.logoUrl) {
        const oldLogoPath = path.join(process.cwd(), supplier.logoUrl);
        if (fs.existsSync(oldLogoPath)) {
          try {
            fs.unlinkSync(oldLogoPath);
          } catch (error) {
            console.warn('Failed to delete old logo file:', error);
          }
        }
      }

      // Update supplier profile with new logo URL
      const logoUrl = `/uploads/logos/${req.file.filename}`;
      
      await prisma.supplierProfile.update({
        where: { userId: req.user!.userId },
        data: { logoUrl },
      });

      res.json({
        success: true,
        logoUrl,
      });
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.warn('Failed to delete uploaded file:', unlinkError);
        }
      }
      next(error);
    }
  }
);

export default router;
