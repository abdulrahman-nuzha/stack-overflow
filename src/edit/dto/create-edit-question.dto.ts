import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'titleOrBody', async: false })
class TitleOrBodyValidator implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    return !!(obj.newTitle || obj.newBody);
  }

  defaultMessage() {
    return 'Either newTitle or newBody must be provided.';
  }
}

export class CreateEditQuestionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly newBody: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly newTitle: string;

  @Validate(TitleOrBodyValidator)
  private validateTitleOrBody: boolean;
}
