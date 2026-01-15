import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { requireRole } from '../middleware/validateRole.js';
import { AppError } from '../middleware/error.js';

const router = Router();
const prisma = new PrismaClient();

const updateProfileSchema = z.object({
  shopName: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  whatsappNumber: z.string().optional(),
  phoneNumber: z.string().min(10).optional(),
});

router.get('/:supplierId', async (req, res, next) => {
  try {
    const { supplierId } = req.params;

    const supplier = await prisma.supplierProfile.findUnique({
      where: { id: supplierId },
      include: {
        city: true,
        marketArea: true,
        subscription: true,
        user: {
          select: {
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!supplier) {
      throw new AppError(404, 'Supplier not found');
    }

    res.json(supplier);
  } catch (error) {
    next(error);
  }
});

router.put('/profile', authenticate, requireRole('SUPPLIER'), async (req: AuthRequest, res: Response, next) => {
  try {
    const data = updateProfileSchema.parse(req.body);
    const userId = req.user!.userId;

    const profile = await prisma.supplierProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new AppError(404, 'Supplier profile not found');
    }

    const updated = await prisma.supplierProfile.update({
      where: { userId },
      data,
      include: {
        city: true,
        marketArea: true,
        subscription: true,
      },
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    next(error);
  }
});

router.get('/:supplierId/inventory', async (req, res, next) => {
  try {
    const { supplierId } = req.params;

    const items = await prisma.inventoryItem.findMany({
      where: { supplierId },
      include: {
        product: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json(items);
  } catch (error) {
    next(error);
  }
});

export default router;
