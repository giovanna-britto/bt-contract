import  {PrismaClient}  from '@prisma/client';

// PrismaClient é anexado ao objeto global para evitar conexões desnecessárias em desenvolvimento
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;