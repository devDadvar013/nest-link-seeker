import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { LoadDataModule } from './load-data/load-data.module';

const logger = new Logger('Database');

function databaseConfig(): TypeOrmModuleOptions {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    logger.error('DATABASE_URL is required.');
    throw new Error('DATABASE_URL is required');
  }

  logger.log(`Using PostgreSQL: ${dbUrl.split('@')[1] ?? 'configured URL'}`);

  // Strip query params (sslmode/channel_binding) — pg v9 treats sslmode=require
  // as verify-full, which can hang TLS negotiation with Neon. We control SSL
  // explicitly via the `ssl` option instead.
  const cleanUrl = dbUrl.split('?')[0];

  return {
    type: 'postgres',
    url: cleanUrl,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
    ssl: {
      rejectUnauthorized: false,
    },
    extra: {
      // Fail the connection fast instead of hanging the function for 30s+
      connectionTimeoutMillis: 8000,
    },
    retryAttempts: 1,
  };
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => databaseConfig(),
    }),
    LoadDataModule,
    UsersModule,
  ],
})
export class AppModule {}
