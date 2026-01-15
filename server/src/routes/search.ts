import { Router, Response } from 'express';
import { PrismaClient, VerifiedStatus } from '@prisma/client';
import { z } from 'zod';
import { expandSearchWithSynonyms } from '../utils/synonyms.js';
import { normalizeText } from '../utils/search.js';

const router = Router();
const prisma = new PrismaClient();

const searchSchema = z.object({
  query: z.string().min(1),
  cityId: z.string().uuid().optional(),
  categoryFilter: z.string().optional(),
  brandFilter: z.string().optional(),
  verifiedOnly: z.boolean().optional(),
  limit: z.number().int().positive().max(100).optional().default(50),
});

interface SupplierSearchResult {
  supplier: {
    id: string;
    shopName: string;
    cityId: string;
    marketAreaId: string;
    address: string;
    lat: number;
    lng: number;
    whatsappNumber: string | null;
    phoneNumber: string;
    verifiedStatus: VerifiedStatus;
    city: {
      id: string;
      name: string;
    };
    marketArea: {
      id: string;
      name: string;
    };
  };
  products: Array<{
    product: {
      id: string;
      title: string;
      category: string;
      brand: string | null;
      phoneModel: string | null;
      variant: string | null;
    };
    visibilityMode: string;
    inStock: boolean;
    lastUpdated: string;
  }>;
  matchCount: number;
}

// Make search endpoint public (no authentication required for search)
router.post('/', async (req, res: Response, next) => {
  try {
    const { query, cityId, categoryFilter, brandFilter, verifiedOnly, limit } = searchSchema.parse(req.body);

    const normalizedQuery = normalizeText(query);
    const expandedTerms = expandSearchWithSynonyms(normalizedQuery);

    // Find products that match the search
    const products = await prisma.product.findMany({
      where: {
        AND: [
          {
            OR: expandedTerms.map(term => ({
              searchText: { contains: term },
            })),
          },
          ...(categoryFilter ? [{ category: categoryFilter }] : []),
          ...(brandFilter ? [{ brand: brandFilter }] : []),
        ],
      },
      include: {
        inventoryItems: {
          where: {
            quantity: { gt: 0 },
            ...(cityId && {
              supplier: {
                cityId,
                ...(verifiedOnly && { verifiedStatus: VerifiedStatus.VERIFIED }),
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

    // Group by supplier
    const supplierMap = new Map<string, SupplierSearchResult>();

    products.forEach(product => {
      product.inventoryItems.forEach(item => {
        const supplierId = item.supplierId;
        
        if (!supplierMap.has(supplierId)) {
          supplierMap.set(supplierId, {
            supplier: {
              id: item.supplier.id,
              shopName: item.supplier.shopName,
              cityId: item.supplier.cityId,
              marketAreaId: item.supplier.marketAreaId,
              address: item.supplier.address,
              lat: item.supplier.lat,
              lng: item.supplier.lng,
              whatsappNumber: item.supplier.whatsappNumber,
              phoneNumber: item.supplier.phoneNumber,
              verifiedStatus: item.supplier.verifiedStatus,
              city: {
                id: item.supplier.city.id,
                name: item.supplier.city.name,
              },
              marketArea: {
                id: item.supplier.marketArea.id,
                name: item.supplier.marketArea.name,
              },
            },
            products: [],
            matchCount: 0,
          });
        }

        const supplierResult = supplierMap.get(supplierId)!;
        supplierResult.products.push({
          product: {
            id: product.id,
            title: product.title,
            category: product.category,
            brand: product.brand,
            phoneModel: product.phoneModel,
            variant: product.variant,
          },
          visibilityMode: item.visibilityMode,
          inStock: item.quantity > 0,
          lastUpdated: item.updatedAt.toISOString(),
        });
        supplierResult.matchCount++;
      });
    });

    // Convert to array and sort by ranking algorithm
    const results = Array.from(supplierMap.values()).sort((a, b) => {
      // 1. Verified suppliers first
      if (a.supplier.verifiedStatus === VerifiedStatus.VERIFIED && b.supplier.verifiedStatus !== VerifiedStatus.VERIFIED) {
        return -1;
      }
      if (a.supplier.verifiedStatus !== VerifiedStatus.VERIFIED && b.supplier.verifiedStatus === VerifiedStatus.VERIFIED) {
        return 1;
      }
      
      // 2. Higher match count next
      if (a.matchCount !== b.matchCount) {
        return b.matchCount - a.matchCount;
      }
      
      // 3. Recently updated next (use most recent product update)
      const aLastUpdate = Math.max(...a.products.map(p => new Date(p.lastUpdated).getTime()));
      const bLastUpdate = Math.max(...b.products.map(p => new Date(p.lastUpdated).getTime()));
      return bLastUpdate - aLastUpdate;
    });

    res.json(results.slice(0, limit));
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    next(error);
  }
});

export default router;
