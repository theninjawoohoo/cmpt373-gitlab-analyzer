import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { MergeRequestNoteService } from './merge-request-note.service';
import { IdParam } from '../../../../common/id-param';
import { RepositoryService } from '../../repository.service';
import { MergeRequestService } from '../../../merge-request/merge-request.service';

@Controller('notes')
export class MergeRequestNoteController {
  constructor(
    private readonly noteService: MergeRequestNoteService,
    private readonly repositoryService: RepositoryService,
    private readonly mergeRequestService: MergeRequestService,
  ) {}

  @Get('/merge_request/:id')
  async findAllForMergeRequest(@Param() { id }: IdParam) {
    const mergeRequest = await this.mergeRequestService.findOne(id);
    if (mergeRequest) {
      return this.noteService.findAllForMergeRequest(mergeRequest);
    }
    throw new NotFoundException(
      `Could not find any notes for merge request with id: ${id}`,
    );
  }

  @Get(':id')
  async findOne(@Param() { id }: IdParam) {
    const note = await this.noteService.findOne(id);
    if (note) {
      return note;
    }
    throw new NotFoundException(`Could not find a note with id: ${id}`);
  }
}
