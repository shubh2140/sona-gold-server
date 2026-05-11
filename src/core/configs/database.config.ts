import { MikroOrmModule } from '@mikro-orm/nestjs';
import { config } from 'dotenv';
import ExportedFeedbacks from '../entities/exported.feedbacks';
import Feedback from '../entities/feedback';
import User from '../entities/user';
import { MsSqlDriver } from '@mikro-orm/mssql';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

config({ path: '.env' });

const dbDriver = process.env.DB_DRIVER?.toLowerCase();
const isPostgres = ['postgres', 'postgresql', 'supabase'].includes(
  dbDriver ?? '',
);
const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;

const databaseModule = MikroOrmModule.forRoot({
  allowGlobalContext: true,
  entities: [User, Feedback, ExportedFeedbacks],
  driver: (isPostgres ? PostgreSqlDriver : MsSqlDriver) as any,
  ...(databaseUrl
    ? { clientUrl: databaseUrl }
    : {
        host: process.env.DB_HOST ?? '127.0.0.1',
        port: parseInt(process.env.DB_PORT ?? (isPostgres ? '5432' : '1433'), 10),
        user: process.env.DB_USERNAME ?? process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        dbName: process.env.DB_NAME,
      }),
  ...(isPostgres && process.env.DB_SSL !== 'false'
    ? { driverOptions: { connection: { ssl: { rejectUnauthorized: false } } } }
    : {}),
});

export default databaseModule;
