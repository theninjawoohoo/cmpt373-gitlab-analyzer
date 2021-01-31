import { ProjectController } from './project.controller';
import { Module, HttpModule } from '@nestjs/common';

@Module({
  imports: [HttpModule],
  controllers: [ProjectController],
})
export class ProjectModule {}
