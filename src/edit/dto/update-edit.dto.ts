import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateEditDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  readonly approve: boolean;
}
