import { defineConfig } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { config } from 'dotenv';
import ExportedFeedbacks from './src/core/entities/exported.feedbacks';
import Feedback from './src/core/entities/feedback';
import User from './src/core/entities/user';
import { MsSqlDriver } from '@mikro-orm/mssql';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

config({ path: '.env' });

const dbDriver = process.env.DB_DRIVER?.toLowerCase();
const databaseUrl =
  process.env.DATABASE_URL ??
  process.env.SUPABASE_DB_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_PRISMA_URL;
const isPostgres =
  ['postgres', 'postgresql', 'supabase'].includes(dbDriver ?? '') ||
  databaseUrl?.startsWith('postgres://') ||
  Boolean(process.env.POSTGRES_URL) ||
  Boolean(process.env.POSTGRES_PRISMA_URL) ||
  databaseUrl?.startsWith('postgresql://');

export default defineConfig({
  entities: [User, Feedback, ExportedFeedbacks],
  driver: (isPostgres ? PostgreSqlDriver : MsSqlDriver) as any,
  ...(databaseUrl
    ? { clientUrl: databaseUrl }
    : {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT ?? (isPostgres ? '5432' : '1433'), 10),
        user: process.env.DB_USERNAME ?? process.env.DB_USER ?? process.env.POSTGRES_USER,
        password: process.env.DB_PASSWORD ?? process.env.POSTGRES_PASSWORD,
        dbName: process.env.DB_NAME ?? process.env.POSTGRES_DATABASE,
      }),
  ...(isPostgres && process.env.DB_SSL !== 'false'
    ? { driverOptions: { connection: { ssl: { rejectUnauthorized: false } } } }
    : {}),
  extensions: [Migrator],
  migrations: {
    path: './dist/migrations', // Migration folder path
    pathTs: './migrations-ts', // Path for TypeScript migrations
  },
  schemaGenerator: {
    disableForeignKeys: false, // default
    createForeignKeyConstraints: true,
  },
});
