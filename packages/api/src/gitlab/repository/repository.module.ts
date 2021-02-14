import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from '../api/api.module';
import { RepositoryMember } from './repository-member/repository-member.entity';
import { Repository } from './repository.entity';
import { RepositoryService } from './repository.service';
import { RepositoryController } from './repository.controller';
import { RepositoryMemberService } from './repository-member/repository-member.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Repository, RepositoryMember]),
    ApiModule,
  ],
  providers: [RepositoryService, RepositoryMemberService],
  controllers: [RepositoryController],
})
export class RepositoryModule {}
