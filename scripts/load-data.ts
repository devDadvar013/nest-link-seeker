import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { LoadDataService } from '../src/load-data/load-data.service';

async function loadData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const loadService = app.get(LoadDataService);

  console.log('Starting data load...');
  const result = await loadService.loadFromCsv();
  console.log(`Loaded ${result.loaded} users (${result.errors} errors)`);

  await app.close();
  process.exit(0);
}

loadData().catch((err) => {
  console.error('Failed to load data:', err);
  process.exit(1);
});
