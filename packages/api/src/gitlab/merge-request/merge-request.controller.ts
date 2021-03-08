import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { paginatedToResponse } from '../../common/pagination';
import { MergeRequestQueryDto } from './merge-request-query.dto';
import { MergeRequestService } from './merge-request.service';
import { GitlabToken } from '../../auth/decorators/gitlab-token.decorator';
import { RepositoryService } from '../repository/repository.service';
import { IdParam } from 'src/common/id-param';
import { MergeRequestParticipantService } from './merge-request-participant/merge-request-participant.service';
import { MergeRequestNoteService } from '../repository/note/merge-request-note/merge-request-note.service';

@Controller('merge_request')
export class MergeRequestController {
  constructor(
    private readonly mergeRequestService: MergeRequestService,
    private readonly repositoryService: RepositoryService,
    private readonly mergeRequestParticipantService: MergeRequestParticipantService,
    private readonly noteService: MergeRequestNoteService,
  ) {}

  @Get(':id/participants')
  async getMergeRequestParticipants(@Param() { id }: IdParam) {
    const mergeRequest = await this.mergeRequestService.findOne(id);
    if (mergeRequest) {
      return await this.mergeRequestParticipantService.findAllForMergeRequest(
        mergeRequest,
      );
    }
    throw new NotFoundException(`no merge request with this id exists: ${id}`);
  }

  @Post(':id/participants')
  @HttpCode(204)
  async fetchMergeRequestParticipants(
    @Param() { id }: IdParam,
    @GitlabToken() token: string,
  ) {
    const mergeRequest = await this.mergeRequestService.findOne(id);
    return await this.mergeRequestParticipantService.syncForMergeRequest(
      mergeRequest,
      token,
    );
  }

  @Get(':id/note')
  async getAllMergeRequestNotes(@Param() { id }: IdParam) {
    const mergeRequest = await this.mergeRequestService.findOne(id);
    if (mergeRequest) {
      return await this.noteService.findAllForMergeRequest(mergeRequest);
    }
    throw new NotFoundException(`no notes found for merge request id: ${id}`);
  }

  @Get()
  search(@Query() query: MergeRequestQueryDto) {
    return paginatedToResponse(this.mergeRequestService.search(query));
  }

  @Get('/repository/:id')
  async findAllForRepository(@Param() { id }: IdParam) {
    const repository = await this.repositoryService.findOne(id);
    if (repository) {
      return this.mergeRequestService.findAllForRepository(repository);
    }
    throw new NotFoundException(
      `Could not find merge request for repository with id: ${id}`,
    );
  }

  @Get(':id')
  async findOne(@Param() { id }: IdParam) {
    const mergeRequest = await this.mergeRequestService.findOne(id);
    if (mergeRequest) {
      return mergeRequest;
    }
    throw new NotFoundException(
      `Could not find a merge request with id: ${id}`,
    );
  }

  @Post('/repository/:id')
  @HttpCode(204)
  async fetchMergeRequests(
    @Param() { id }: IdParam,
    @GitlabToken() token: string,
  ) {
    const repository = await this.repositoryService.findOne(id);
    if (repository) {
      await this.mergeRequestService.fetchForRepository(repository, token);
    } else {
      throw new NotFoundException(
        `Could not fetch merge request for repository with id: ${id}`,
      );
    }
  }
}
