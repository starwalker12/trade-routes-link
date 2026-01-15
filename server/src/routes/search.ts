import { Router, Response } from 'express';
import { PrismaClient, Role, VerifiedStatus } from '@prisma/client';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { expandSearchWithSynonyms } from '../utils/synonyms.js';
import { normalizeText, calculateRelevanceScore } from '../utils/search.js';

const router = Router();
const prisma = new PrismaClient();

const searchSchema = z.object({
  query: z.string().min(1),
  cityId: z.string().uuid().optional(),
  limit: z.number().int().positive().max(100).optional().default(50),
});

interface SearchResult {
  id: string;
  title: string;
  category: string;
  brand: string | null;
  phoneModel: string | null;
  variant: string | null;
  suppliers: Array<{
    supplierId: string;
    shopName: string;
    cityName: string;
    marketName: string;
    verifiedStatus: VerifiedStatus;
    hasStock: boolean;
    quantity?: number;
    visibilityMode?: string;
    updatedAt: Date;
  }>;
}

router.get('/', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const { query, cityId, limit } = searchSchema.parse({
      query: req.query.query,
      cityId: req.query.cityId,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
    });

    const userRole = req.user!.role;
    const normalizedQuery = normalizeText(query);
    const expandedTerms = expandSearchWithSynonyms(normalizedQuery);

    const products = await prisma.product.findMany({
      where: {
        OR: expandedTerms.map(term => ({
          searchText: { contains: term },
        })),
      },
      include: {
        inventoryItems: {
          where: {
            quantity: { gt: 0 },
            ...(cityId && {
              supplier: {
                cityId,
              },
            }),
          },
          include: {
            supplier: {
              include: {
                city: true,
                marketArea: true,
              },
            },
          },
        },
      },
    });

    const results: SearchResult[] = products
      .filter(product => product.inventoryItems.length > 0)
      .map(product => {
        const relevanceScore = calculateRelevanceScore(product.searchText, expandedTerms);
        
        const suppliers = product.inventoryItems.map(item => ({
          supplierId: item.supplierId,
          shopName: item.supplier.shopName,
          cityName: item.supplier.city.name,
          marketName: item.supplier.marketArea.name,
          verifiedStatus: item.supplier.verifiedStatus,
          hasStock: item.quantity > 0,
          quantity: userRole === Role.SUPPLIER ? item.quantity : undefined,
          visibilityMode: userRole === Role.SUPPLIER ? item.visibilityMode : undefined,
          updatedAt: item.updatedAt,
        }));

        suppliers.sort((a, b) => {
          if (a.verifiedStatus === VerifiedStatus.VERIFIED && b.verifiedStatus !== VerifiedStatus.VERIFIED) return -1;
          if (a.verifiedStatus !== VerifiedStatus.VERIFIED && b.verifiedStatus === VerifiedStatus.VERIFIED) return 1;
          
          if (a.hasStock && !b.hasStock) return -1;
          if (!a.hasStock && b.hasStock) return 1;
          
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        });

        return {
          id: product.id,
          title: product.title,
          category: product.category,
          brand: product.brand,
          phoneModel: product.phoneModel,
          variant: product.variant,
          suppliers,
          _relevanceScore: relevanceScore,
        };
      })
      .sort((a, b) => (b._relevanceScore || 0) - (a._relevanceScore || 0))
      .slice(0, limit)
      .map(({ _relevanceScore, ...result }) => result);

    res.json(results);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    next(error);
  }
});

export default router;
