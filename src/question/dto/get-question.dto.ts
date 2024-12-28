import { ApiProperty } from '@nestjs/swagger';
import {IsOptional, IsString } from 'class-validator';

export class GetQuestionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly sortBy?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly page?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly rowsPerPage?: string;
}
