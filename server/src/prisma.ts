import { PrismaClient } from '@prisma/client';

// Singleton prisma client shared between services
export const prisma = new PrismaClient();
