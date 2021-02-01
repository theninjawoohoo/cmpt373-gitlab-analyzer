import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './service/project.service';
import { Module, HttpModule } from '@nestjs/common';
import { Repo } from './entities/project.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Repo]), HttpModule],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
