import { Module } from '@nestjs/common';
import { TokenController } from './token/token.controller';

@Module({
  controllers: [TokenController],
})
export class GitlabModule {}
