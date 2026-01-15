import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_req, res, next) => {
  try {
    const cities = await prisma.city.findMany({
      orderBy: { name: 'asc' },
    });

    res.json(cities);
  } catch (error) {
    next(error);
  }
});

router.get('/:cityId/markets', async (req, res, next) => {
  try {
    const { cityId } = req.params;

    const markets = await prisma.marketArea.findMany({
      where: { cityId },
      orderBy: { name: 'asc' },
    });

    res.json(markets);
  } catch (error) {
    next(error);
  }
});

export default router;
