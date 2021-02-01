import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectService } from './service/project.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Repo } from './entities/project.entity';

// var username='wens';
var token='2P52x1JLbMvoSHSpr5gE';

// https://wanago.io/2020/05/11/nestjs-api-controllers-routing-module/
@Controller(`projects?private_token=${token}`)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  getAllProjects(@Param('token') token: string){
    return this.projectService.getAllProjects(String(token));
  }

  @Get(':id')
  getProjectById(@Param('id') id: string){
    return this.projectService.getProjectById(Number(id));
  }
}

