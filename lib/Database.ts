import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

export class Database {
  private static instance: PrismaClient;

  // Private constructor prevents direct instantiation for the Singleton pattern
  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!Database.instance) {
      // 1. Initialize the standard pg connection pool
      const connectionString = process.env.DATABASE_URL;
      const pool = new Pool({ connectionString });
      
      // 2. Wrap it in the Prisma pg adapter
      const adapter = new PrismaPg(pool);
      
      // 3. Inject the adapter into the Prisma Client instance
      Database.instance = new PrismaClient({ adapter });
    }
    return Database.instance;
  }
}