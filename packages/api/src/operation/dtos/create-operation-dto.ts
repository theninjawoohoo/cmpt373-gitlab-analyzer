import { Operation } from '@ceres/types';
import { IsEnum, IsObject, IsOptional } from 'class-validator';

export class CreateOperationDto {
  @IsEnum(Operation.Type)
  type: Operation.Type;

  @IsOptional()
  @IsObject()
  input: any;
}
