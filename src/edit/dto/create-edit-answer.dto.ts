import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEditAnswerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly newBody: string;
}
