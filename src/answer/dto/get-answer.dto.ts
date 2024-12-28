import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class GetAnswerDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  readonly question_id?: number;

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
