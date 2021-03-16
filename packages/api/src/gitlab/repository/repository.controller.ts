import { RepositoryMember } from '@ceres/types';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IdParam } from '../../common/id-param';
import { paginatedToResponse } from '../../common/pagination';
import { UserService } from '../../user/services/user.service';
import { CommitAuthorService } from './commit/author/commit-author.service';
import { RepositoryMemberService } from './repository-member/repository-member.service';
import { AddCollaboratorPayload } from './repository.payloads';
import { RepositoryService } from './repository.service';
import { GitlabToken } from '../../auth/decorators/gitlab-token.decorator';
import { Auth } from '../../auth/decorators/auth.decorator';
import { VerifiedUser } from '../../auth/types/VerifiedUser';
import { MergeRequestService } from '../merge-request/merge-request.service';
import { RepositoryQueryDto } from './repository-query.dto';

@Controller('repository')
export class RepositoryController {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly repositoryMemberService: RepositoryMemberService,
    private readonly mergeRequestService: MergeRequestService,
    private readonly commitAuthorService: CommitAuthorService,
    private readonly userService: UserService,
  ) {}

  @Get(':id/participants')
  async findMergeRequestParticipants(@Param('id') id: string) {
    const repository = await this.repositoryService.findOne(id);
    return await this.mergeRequestService.findAllParticipantsForRepository(
      repository,
    );
  }

  @Post(':id/participants/sync')
  @HttpCode(204)
  async syncMergeRequestParticipants(
    @Param('id') id: string,
    @GitlabToken() token: string,
  ) {
    const repository = await this.repositoryService.findOne(id);
    if (repository) {
      return await this.mergeRequestService.fetchAllParticipantsForRepository(
        repository,
        token,
      );
    }
    throw new NotFoundException(`Could not find a repository with id: ${id}`);
  }

  @Post(':id/members/sync')
  @HttpCode(204)
  async syncProjectMembers(
    @Param('id') id: string,
    @GitlabToken() token: string,
  ) {
    const repository = await this.repositoryService.findOne(id);
    await this.repositoryMemberService.syncForRepository(repository, token);
  }

  @Get('/:id/authors')
  async findProjectAuthors(@Param() { id }: IdParam) {
    const repository = await this.repositoryService.findOne(id);
    return this.commitAuthorService.findAllForRepository(repository);
  }

  @Put('/author/:id/member')
  async updateProjectAuthor(
    @Param() { id }: IdParam,
    @Body() member?: RepositoryMember,
  ) {
    let memberEntity;
    if (member) {
      memberEntity = await this.repositoryMemberService.findOne(
        (member as any).meta.id,
      );
    }
    const author = await this.commitAuthorService.findOne(id);
    return this.commitAuthorService.updateRepositoryMember(
      author,
      memberEntity,
    );
  }

  @Get('/:id/members')
  async findProjectMembers(@Param() { id }: IdParam) {
    const repository = await this.repositoryService.findOne(id);
    return this.repositoryMemberService.findAllForRepository(repository);
  }

  @Get()
  search(@Auth() { user }: VerifiedUser, @Query() query: RepositoryQueryDto) {
    return paginatedToResponse(
      this.repositoryService.search({ ...query, user }),
    );
  }

  @Get(':id')
  async findOne(@Param() { id }: IdParam) {
    const repo = await this.repositoryService.findOne(id);
    if (repo) {
      return repo;
    }
    throw new NotFoundException(`Could not find a repository with id: ${id}`);
  }

  @Post(':id/collaborator')
  async addCollaborator(
    @Param() { id }: IdParam,
    @Body() { sfuId, accessLevel }: AddCollaboratorPayload,
    @Auth() { user }: VerifiedUser,
  ) {
    const collaborator = await this.userService.findBySfuId(sfuId);
    if (!collaborator) {
      throw new NotFoundException(`User with SFU id: ${sfuId} does not exist`);
    }
    const repository = await this.repositoryService.findOne(id);
    if (user.id !== repository?.resource?.extensions?.owner?.id) {
      throw new ForbiddenException(
        'Only repository owners can add collaborators',
      );
    }
    if (user.auth.userId === sfuId) {
      throw new BadRequestException(
        'You cannot be a collaborator on a project you own.',
      );
    }
    return this.repositoryService.addCollaborator(
      repository,
      collaborator,
      accessLevel,
    );
  }
}
