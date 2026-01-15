import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

// Validate JWT_SECRET in all environments
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be set in production environment');
  }
  if (JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long for production');
  }
} else {
  // Also warn in development if using a weak secret
  if (JWT_SECRET.length < 32) {
    console.warn('⚠️  Warning: JWT_SECRET is shorter than 32 characters. Use a stronger secret in production.');
  }
}

const JWT_EXPIRES_IN = '7d';

export interface JwtPayload {
  userId: string;
  role: Role;
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
