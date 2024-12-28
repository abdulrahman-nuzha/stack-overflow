import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAnswerDto } from './create-answer.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAnswerDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly body: string;
}
