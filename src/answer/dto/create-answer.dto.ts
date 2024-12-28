import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly body: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  readonly questionId: number;
}
