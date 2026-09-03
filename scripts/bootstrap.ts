import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { LoadDataService } from '../src/load-data/load-data.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loadService = app.get(LoadDataService);

  // Load data from CSV
  const result = await loadService.loadFromCsv();
  console.log(`Data load result: ${result.loaded} users loaded, ${result.errors} errors`);

  // Now start the NestJS app
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend is running on http://localhost:${port}`);
}
bootstrap();
