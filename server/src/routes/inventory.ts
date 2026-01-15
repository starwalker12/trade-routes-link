import { Router, Response } from 'express';
import { PrismaClient, Plan, VisibilityMode } from '@prisma/client';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { requireRole } from '../middleware/validateRole.js';
import { AppError } from '../middleware/error.js';
import { normalizeText } from '../utils/search.js';

const router = Router();
const prisma = new PrismaClient();

const INVENTORY_LIMITS: Record<Plan, number | null> = {
  STARTER: 50,
  GROWTH: 500,
  PRO: null,
};

const createInventorySchema = z.object({
  productTitle: z.string().min(1),
  category: z.string().min(1),
  brand: z.string().optional(),
  phoneModel: z.string().optional(),
  variant: z.string().optional(),
  quantity: z.number().int().nonnegative(),
  visibilityMode: z.enum(['EXACT_QUANTITY', 'IN_STOCK_ONLY']).optional().default('EXACT_QUANTITY'),
});

const updateInventorySchema = z.object({
  quantity: z.number().int().nonnegative().optional(),
  visibilityMode: z.enum(['EXACT_QUANTITY', 'IN_STOCK_ONLY']).optional(),
});

async function checkInventoryLimit(supplierId: string): Promise<void> {
  const supplier = await prisma.supplierProfile.findUnique({
    where: { id: supplierId },
    include: {
      subscription: true,
      inventoryItems: true,
    },
  });

  if (!supplier || !supplier.subscription) {
    throw new AppError(403, 'No active subscription found');
  }

  const limit = INVENTORY_LIMITS[supplier.subscription.plan];
  if (limit !== null && supplier.inventoryItems.length >= limit) {
    throw new AppError(403, `Inventory limit reached for ${supplier.subscription.plan} plan (${limit} items)`);
  }
}

router.get('/', authenticate, requireRole('SUPPLIER'), async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.userId;

    const profile = await prisma.supplierProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new AppError(404, 'Supplier profile not found');
    }

    const items = await prisma.inventoryItem.findMany({
      where: { supplierId: profile.id },
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

router.post('/', authenticate, requireRole('SUPPLIER'), async (req: AuthRequest, res: Response, next) => {
  try {
    const data = createInventorySchema.parse(req.body);
    const userId = req.user!.userId;

    const profile = await prisma.supplierProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new AppError(404, 'Supplier profile not found');
    }

    await checkInventoryLimit(profile.id);

    const searchText = normalizeText(
      `${data.productTitle} ${data.category} ${data.brand || ''} ${data.phoneModel || ''} ${data.variant || ''}`
    );

    let product = await prisma.product.findFirst({
      where: {
        title: data.productTitle,
        category: data.category,
        brand: data.brand || null,
        phoneModel: data.phoneModel || null,
        variant: data.variant || null,
      },
    });

    if (!product) {
      product = await prisma.product.create({
        data: {
          title: data.productTitle,
          category: data.category,
          brand: data.brand,
          phoneModel: data.phoneModel,
          variant: data.variant,
          searchText,
        },
      });
    }

    const existingItem = await prisma.inventoryItem.findUnique({
      where: {
        supplierId_productId: {
          supplierId: profile.id,
          productId: product.id,
        },
      },
    });

    if (existingItem) {
      throw new AppError(400, 'Product already exists in inventory');
    }

    const item = await prisma.inventoryItem.create({
      data: {
        supplierId: profile.id,
        productId: product.id,
        quantity: data.quantity,
        visibilityMode: data.visibilityMode as VisibilityMode,
      },
      include: {
        product: true,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    next(error);
  }
});

router.put('/:itemId', authenticate, requireRole('SUPPLIER'), async (req: AuthRequest, res: Response, next) => {
  try {
    const itemId = req.params.itemId as string;
    const data = updateInventorySchema.parse(req.body);
    const userId = req.user!.userId;

    const profile = await prisma.supplierProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new AppError(404, 'Supplier profile not found');
    }

    const item = await prisma.inventoryItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.supplierId !== profile.id) {
      throw new AppError(404, 'Inventory item not found');
    }

    const updated = await prisma.inventoryItem.update({
      where: { id: itemId },
      data,
      include: {
        product: true,
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

router.delete('/:itemId', authenticate, requireRole('SUPPLIER'), async (req: AuthRequest, res: Response, next) => {
  try {
    const itemId = req.params.itemId as string;
    const userId = req.user!.userId;

    const profile = await prisma.supplierProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new AppError(404, 'Supplier profile not found');
    }

    const item = await prisma.inventoryItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.supplierId !== profile.id) {
      throw new AppError(404, 'Inventory item not found');
    }

    await prisma.inventoryItem.delete({
      where: { id: itemId },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
