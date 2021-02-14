import { Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { RepositoryMemberService } from './repository-member/repository-member.service';
import { RepositoryService } from './repository.service';
import { GitlabToken } from '../../auth/decorators/gitlab-token.decorator';
import { Auth } from '../../auth/decorators/auth.decorator';
import { VerifiedUser } from '../../auth/types/VerifiedUser';

@Controller('repository')
export class RepositoryController {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly repositoryMemberService: RepositoryMemberService,
  ) {}

  @Post(':id/members/sync')
  @HttpCode(204)
  async syncProjectMembers(
    @Param('id') id: string,
    @GitlabToken() token: string,
  ) {
    const repository = await this.repositoryService.findOne(id);
    await this.repositoryMemberService.syncForRepository(repository, token);
  }

  @Get()
  getAllRepositories(@Auth() user: VerifiedUser) {
    return this.repositoryService.findAll(user.user);
  }

  @Get(':id')
  getRepositoryById(@Param('id') repoId: string) {
    return this.repositoryService.findOne(repoId);
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
