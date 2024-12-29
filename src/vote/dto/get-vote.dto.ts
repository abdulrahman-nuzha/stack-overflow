import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class GetVoteDto {
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

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  readonly questionId?: number;
  
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  readonly answerId?: number;
}