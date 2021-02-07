import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from '../api/api.module';
import { Repository } from './repository.entity';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Repository]), ApiModule],
  providers: [RepositoryService],
  controllers: [RepositoryController],
})
export class RepositoryModule {}
