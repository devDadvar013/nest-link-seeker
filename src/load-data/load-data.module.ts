import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { LoadDataService } from './load-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [LoadDataService],
  exports: [LoadDataService],
})
export class LoadDataModule {}
