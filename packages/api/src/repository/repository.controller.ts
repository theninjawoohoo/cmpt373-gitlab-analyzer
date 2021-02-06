import { Controller, Get, Param, Module, Post } from '@nestjs/common';
import { RepositoryService } from './service/repository.service';
import { GitlabToken } from '../auth/decorators/gitlab-token.decorator';
import { Auth } from '../auth/decorators/auth.decorator';;
import { VerifiedUser } from '../auth/types/VerifiedUser';

// const token='2P52x1JLbMvoSHSpr5gE';
// const username='wens';

// https://wanago.io/2020/05/11/nestjs-api-controllers-routing-module/
@Controller('repositories')
// @Controller(`projects?private_token=${token}`)
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Post()
  createRepositories(@Auth() user: VerifiedUser, @GitlabToken() token: string) {
    const userId: string = user.sub;
    return this.repositoryService.createRepository(userId, token);
  }
  
  @Get()
  getAllRepositories(@Auth() user: VerifiedUser, @GitlabToken() token: string) {
    return this.repositoryService.getAllRepositories(String(token));
  }

  @Get(':id')
  getRepositoryById(@Param('id') id: string) {
    return this.repositoryService.getRepositoryById(Number(id));
  }
}
