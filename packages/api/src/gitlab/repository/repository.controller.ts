import { Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { RepositoryMemberService } from './repository-member/repository-member.service';
import { RepositoryService } from './repository.service';
import { GitlabToken } from '../../auth/decorators/gitlab-token.decorator';
import { Auth } from '../../auth/decorators/auth.decorator';
import { VerifiedUser } from '../../auth/types/VerifiedUser';
import { CommitService } from './commit/commit.service';

@Controller('repository')
export class RepositoryController {
  constructor(
    private readonly commitService: CommitService,
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

  @Get('/:id/members')
  async findProjectMembers(@Param('id') id: string) {
    const repository = await this.repositoryService.findOne(id);
    return this.repositoryMemberService.findAllForRepository(repository);
  }

  @Post(':id/commits/sync')
  @HttpCode(204)
  async syncProjectCommits(
    @Param('id') id: string,
    @GitlabToken() token: string,
  ) {
    const repository = await this.repositoryService.findOne(id);
    await this.commitService.syncForRepository(repository, token);
  }

  @Get('/:id/commits')
  async getProjectCommits(@Param('id') id: string) {
    const repository = await this.repositoryService.findOne(id);
    return this.commitService.findAllForRepository(repository);
  }

  @Get()
  findAllForUser(@Auth() user: VerifiedUser) {
    return this.repositoryService.findAllForUser(user.user);
  }

  @Get(':id')
  findOne(@Param('id') repoId: string) {
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
