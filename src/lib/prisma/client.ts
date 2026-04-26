import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient | null = null;

export async function getPrisma(): Promise<PrismaClient> {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }
  
  if (!prismaInstance) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    const adapter = new PrismaPg(pool);
    prismaInstance = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }
  
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
  }
  
  return prismaInstance;
}

export const prisma = {
  then<TResult1>(
    onfulfilled?: ((value: PrismaClient) => TResult1 | PromiseLike<TResult1>) | undefined,
    onrejected?: ((reason: unknown) => TResult1 | PromiseLike<TResult1>) | undefined
  ): Promise<TResult1> {
    return getPrisma().then(onfulfilled, onrejected);
  },
  catch<TResult2>(
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined
  ): Promise<PrismaClient> {
    return getPrisma().catch(onrejected);
  },
  finally(onfinally?: (() => void) | undefined): Promise<PrismaClient> {
    return getPrisma().finally(onfinally);
  },
} as Promise<PrismaClient> & PrismaClient;