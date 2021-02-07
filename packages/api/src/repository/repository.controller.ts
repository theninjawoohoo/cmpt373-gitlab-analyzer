import { Controller, Get, Param, Req } from '@nestjs/common';

@Controller('repository')
export class RepositoryController {
  @Get('repository')
  getAllRepositories() {
    return 'All Repositories';
  }

  @Get('repository/:repoID')
  getRepositoryByID(@Param('repoID') repoID) {
    return `Repo ID is ${repoID}`;
  }
}
