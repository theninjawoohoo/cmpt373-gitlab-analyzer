import { Controller, Get, Param } from '@nestjs/common';
import { ProjectService } from './service/project.service';

// var username='wens';
const token = '2P52x1JLbMvoSHSpr5gE';

// https://wanago.io/2020/05/11/nestjs-api-controllers-routing-module/
@Controller(`projects?private_token=${token}`)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  getAllProjects(@Param('token') token: string) {
    return this.projectService.getAllProjects(String(token));
  }

  @Get(':id')
  getProjectById(@Param('id') id: string) {
    return this.projectService.getProjectById(Number(id));
  }
}
