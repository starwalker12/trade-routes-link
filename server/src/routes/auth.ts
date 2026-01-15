import { Router, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { generateToken } from '../utils/jwt.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/error.js';

const router = Router();
const prisma = new PrismaClient();

const registerRetailerSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  password: z.string().min(6),
  shopName: z.string().min(1).optional(),
  cityId: z.string().uuid(),
  areaText: z.string().optional(),
  phoneNumber: z.string().optional(),
}).refine((data) => data.email || data.phone, {
  message: 'Either email or phone must be provided',
});

const registerSupplierSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  password: z.string().min(6),
  shopName: z.string().min(1),
  cityId: z.string().uuid(),
  marketAreaId: z.string().uuid(),
  address: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  whatsappNumber: z.string().optional(),
  phoneNumber: z.string().min(10),
}).refine((data) => data.email || data.phone, {
  message: 'Either email or phone must be provided',
});

const loginSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  password: z.string(),
}).refine((data) => data.email || data.phone, {
  message: 'Either email or phone must be provided',
});

router.post('/register/retailer', async (req, res, next) => {
  try {
    const data = registerRetailerSchema.parse(req.body);

    if (data.email) {
      const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
      if (existingUser) {
        throw new AppError(400, 'Email already registered');
      }
    }

    if (data.phone) {
      const existingUser = await prisma.user.findUnique({ where: { phone: data.phone } });
      if (existingUser) {
        throw new AppError(400, 'Phone already registered');
      }
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone,
        passwordHash,
        role: Role.RETAILER,
        retailerProfile: {
          create: {
            shopName: data.shopName,
            cityId: data.cityId,
            areaText: data.areaText,
            phoneNumber: data.phoneNumber,
          },
        },
      },
      include: {
        retailerProfile: {
          include: {
            city: true,
          },
        },
      },
    });

    const token = generateToken({ userId: user.id, role: user.role });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
        phone: user.phone,
        profile: user.retailerProfile,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    next(error);
  }
});

router.post('/register/supplier', async (req, res, next) => {
  try {
    const data = registerSupplierSchema.parse(req.body);

    if (data.email) {
      const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
      if (existingUser) {
        throw new AppError(400, 'Email already registered');
      }
    }

    if (data.phone) {
      const existingUser = await prisma.user.findUnique({ where: { phone: data.phone } });
      if (existingUser) {
        throw new AppError(400, 'Phone already registered');
      }
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone,
        passwordHash,
        role: Role.SUPPLIER,
        supplierProfile: {
          create: {
            shopName: data.shopName,
            cityId: data.cityId,
            marketAreaId: data.marketAreaId,
            address: data.address,
            lat: data.lat,
            lng: data.lng,
            whatsappNumber: data.whatsappNumber,
            phoneNumber: data.phoneNumber,
            subscription: {
              create: {
                plan: 'FREE',
                status: 'ACTIVE',
              },
            },
          },
        },
      },
      include: {
        supplierProfile: {
          include: {
            city: true,
            marketArea: true,
            subscription: true,
          },
        },
      },
    });

    const token = generateToken({ userId: user.id, role: user.role });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
        phone: user.phone,
        profile: user.supplierProfile,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findFirst({
      where: data.email ? { email: data.email } : { phone: data.phone },
      include: {
        retailerProfile: {
          include: { city: true },
        },
        supplierProfile: {
          include: {
            city: true,
            marketArea: true,
            subscription: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    const token = generateToken({ userId: user.id, role: user.role });

    res.json({
      token,
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
        phone: user.phone,
        profile: user.role === Role.RETAILER ? user.retailerProfile : user.supplierProfile,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    next(error);
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: {
        retailerProfile: {
          include: { city: true },
        },
        supplierProfile: {
          include: {
            city: true,
            marketArea: true,
            subscription: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json({
      id: user.id,
      role: user.role,
      email: user.email,
      phone: user.phone,
      profile: user.role === Role.RETAILER ? user.retailerProfile : user.supplierProfile,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
