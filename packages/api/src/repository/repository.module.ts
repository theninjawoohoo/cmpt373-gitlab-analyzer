import { RepositoryController } from './repository.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryService } from './service/repository.service';
import { Module, HttpModule } from '@nestjs/common';
import { Repository_Entity } from './entities/repository.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Repository_Entity]), HttpModule],
  providers: [RepositoryService],
  controllers: [RepositoryController],
  exports: [RepositoryService],
})
export class RepositoryModule {}
