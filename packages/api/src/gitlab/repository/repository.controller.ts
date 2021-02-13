import { Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { GitlabToken } from '../../auth/decorators/gitlab-token.decorator';
import { Auth } from '../../auth/decorators/auth.decorator';
import { VerifiedUser } from '../../auth/types/VerifiedUser';

@Controller('repository')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Get()
  getAllRepositories(@Auth() user: VerifiedUser) {
    return this.repositoryService.findAll(user.user);
  }

  @Get(':id')
  getRepositoryById(@Auth() user: VerifiedUser, @Param('id') repoId: string) {
    return this.repositoryService.findOne(user.user, repoId);
  }

  @Post()
  @HttpCode(204)
  async fetchRepositories(
    @Auth() user: VerifiedUser,
    @GitlabToken() token: string,
  ) {
    await this.repositoryService.fetchForUser(user.user, token);
  }
}
