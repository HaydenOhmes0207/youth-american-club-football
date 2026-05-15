import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const createPrismaClient = () => {
  return new PrismaClient({
    // Configure connection pool for serverless/edge environments
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Log slow queries in development
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
};

// Use singleton pattern for both development AND production
// This prevents connection pool exhaustion in serverless environments
export const db = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
} else {
  // Also cache in production for serverless environments
  globalThis.prisma = db;
}

export default db;
