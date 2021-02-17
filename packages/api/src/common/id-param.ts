import { IsUUID } from 'class-validator';

export class IdParam {
  @IsUUID()
  id: string;
}
