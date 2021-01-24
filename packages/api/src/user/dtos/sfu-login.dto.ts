import { IsString } from 'class-validator';

export class SfuLoginDto {
  @IsString()
  readonly ticket: string;
}
