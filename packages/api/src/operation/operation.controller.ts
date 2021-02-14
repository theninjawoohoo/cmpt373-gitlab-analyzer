import { Body, Controller, Post } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Auth } from '../auth/decorators/auth.decorator';
import { VerifiedUser } from '../auth/types/VerifiedUser';
import { CreateOperationDto } from './dtos/create-operation-dto';
import { OperationExecutorService } from './operation-executor.service';
import { OperationService } from './operation.service';

@Controller('operation')
export class OperationController {
  constructor(
    private readonly operationService: OperationService,
    private readonly operationExecutorService: OperationExecutorService,
  ) {}

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
