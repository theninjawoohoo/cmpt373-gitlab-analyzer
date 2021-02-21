import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { paginatedToResponse } from '../../../common/pagination';
import { DiffQueryDto } from './diff-query.dto';
import { DiffService } from './diff.service';

@Controller('diff')
export class CommitController {
  constructor(private readonly diffService: DiffService) {}

  @Get()
  search(@Query() query: DiffQueryDto) {
    const { merge_request, commit } = query;
    if (!merge_request && !commit) {
      throw new BadRequestException('repository or commit must be provided');
    }
    return paginatedToResponse(this.diffService.search(query));
  }
}
