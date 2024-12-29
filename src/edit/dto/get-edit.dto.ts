import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class GetEditDto {
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
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  readonly approved: boolean;
}
