import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'pretty',
});

// Handle connection issues gracefully
prisma.$on('error', (e) => {
  console.error('Prisma error:', e);
});

export default prisma;


