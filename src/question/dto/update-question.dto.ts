import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateQuestionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly body: string;
}
