import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './service/project.service';
import { Module, HttpModule } from '@nestjs/common';
import { Repository_Entity } from './entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Repository_Entity]), HttpModule],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
