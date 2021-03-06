import { IsUUID } from 'class-validator';
import { QueryDto } from '../../common/query-dto';

export class MergeRequestQueryDto extends QueryDto {
  @IsUUID()
  repository: string;
}
