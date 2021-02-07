import { Module } from '@nestjs/common';
import { RepositoryController } from './repository.controller';

@Module({
  controllers: [RepositoryController],
})
export class RepositoryModule {}
