import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverless from 'serverless-http';
import { AppModule } from './app.module';
import { LoadDataService } from './load-data/load-data.service';

const logger = new Logger('Bootstrap');

async function createApp() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  const loadService = app.get(LoadDataService);

  // Load CSV data if the database is empty (skips quickly when rows exist).
  // On Vercel this only runs on cold starts and no-ops once data is present.
  try {
    const result = await loadService.loadFromCsv();
    if (result.loaded > 0) {
      logger.log(`Loaded ${result.loaded} users into database (${result.errors} errors)`);
    }
  } catch (e) {
    logger.warn(`Data load skipped/failed: ${(e as Error).message}`);
  }

  app.enableCors({ origin: true, methods: 'GET,POST,PUT,DELETE,OPTIONS' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.init();
  return app;
}

// ---------------------------------------------------------------------------
// Serverless mode (Vercel): export a request handler instead of listening.
// ---------------------------------------------------------------------------
let cachedHandler: ((req: any, res: any) => Promise<void>) | undefined;

async function getServerlessHandler() {
  if (!cachedHandler) {
    const app = await createApp();
    cachedHandler = serverless(app.getHttpAdapter().getInstance());
  }
  return cachedHandler;
}

export default async function handler(req: any, res: any) {
  const fn = await getServerlessHandler();
  return fn(req, res);
}

// ---------------------------------------------------------------------------
// Local/classic mode: keep the process listening on a port.
// ---------------------------------------------------------------------------
if (!process.env.VERCEL) {
  createApp()
    .then((app) => {
      const port = process.env.PORT || 3000;
      app.listen(port);
      logger.log(`Backend running on http://localhost:${port}`);
    })
    .catch((e) => {
      logger.error('Failed to start backend', e.stack);
      process.exit(1);
    });
}
