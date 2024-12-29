import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateVoteDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  vote: boolean;
}
