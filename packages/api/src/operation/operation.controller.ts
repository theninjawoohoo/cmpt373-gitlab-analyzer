import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Auth } from '../auth/decorators/auth.decorator';
import { VerifiedUser } from '../auth/types/VerifiedUser';
import { paginatedToResponse } from '../common/pagination';
import { CreateOperationDto } from './dtos/create-operation-dto';
import { OperationQueryDto } from './dtos/operation-query.dto';
import { OperationExecutorService } from './operation-executor.service';
import { OperationService } from './operation.service';

@Controller('operation')
export class OperationController {
  constructor(
    private readonly operationService: OperationService,
    private readonly operationExecutorService: OperationExecutorService,
  ) {}

  @Get()
  search(@Query() query: OperationQueryDto, @Auth() auth: VerifiedUser) {
    const filters = { ...query, user: auth.user };
    return paginatedToResponse(this.operationService.search(filters));
  }

  @Post()
  create(
    @Auth() auth: VerifiedUser,
    @Body() createOperationDto: CreateOperationDto,
  ) {
    const { type, input } = createOperationDto;
    return this.operationService.create(auth.user, type, input);
  }

  @Cron('* * * * * *')
  async executeLatestOperation() {
    const operation = await this.operationService.getOldestPending();
    if (operation) {
      return this.operationExecutorService.execute(operation);
    }
  }
}
