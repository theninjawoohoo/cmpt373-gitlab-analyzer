import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { IdParam } from '../../common/id-param';
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
  async findProjectMembers(@Param() { id }: IdParam) {
    const repository = await this.repositoryService.findOne(id);
    return this.repositoryMemberService.findAllForRepository(repository);
  }

  @Post(':id/commits/sync')
  @HttpCode(204)
  async syncProjectCommits(
    @Param() { id }: IdParam,
    @GitlabToken() token: string,
  ) {
    const repository = await this.repositoryService.findOne(id);
    await this.commitService.fetchForRepository(repository, token);
  }

  @Get('/:id/commits')
  async fetchCommits(@Param() { id }: IdParam) {
    const repository = await this.repositoryService.findOne(id);
    return this.commitService.findAllForRepository(repository);
  }

  @Get()
  findAllForUser(@Auth() user: VerifiedUser) {
    return this.repositoryService.findAllForUser(user.user);
  }

  @Get(':id')
  async findOne(@Param() { id }: IdParam) {
    const repo = await this.repositoryService.findOne(id);
    if (repo) {
      return repo;
    }
    throw new NotFoundException(`Could not find a repository with id: ${id}`);
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
