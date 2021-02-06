import { Controller, Get, Param, Module } from '@nestjs/common';
import { RepositoryService } from './service/repository.service';
import { GitlabToken } from '../auth/decorators/gitlab-token.decorator';
import { Auth } from '../auth/decorators/auth.decorator';

// const token = GitlabToken(); ?? how to pass in?? 
// const username = @Auth;

// const token='2P52x1JLbMvoSHSpr5gE';
// const username='wens';

// https://wanago.io/2020/05/11/nestjs-api-controllers-routing-module/
@Controller(`users/${username}/projects?private_token=${token}`)
// @Controller(`projects?private_token=${token}`)
export class RepositoryController {
  constructor(private readonly projectService: RepositoryService) {}

  @Get()
  getAllProjects(@Param('token') token: string) {
    return this.projectService.getAllProjects(String(token));
  }

  @Get(':id')
  getProjectById(@Param('id') id: string) {
    return this.projectService.getProjectById(Number(id));
  }
}
