import { Field, InputType } from '@nestjs/graphql';
import { constant } from 'src/common/constant';
import {
  IsAlpha,
  IsEmail,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

@InputType()
export class RegisterUserDTO {
  @Field({ nullable: false, description: 'user input value for Name' })
  @IsAlpha()
  @Length(3, 45, { message: constant.INVALID_NAME_RANGE_MESSAGE })
  Name: string;

  @Field({ nullable: false, description: 'user input value for Email' })
  @IsEmail({ message: constant.INVALID_EMAIL_FORMAT })
  Email: string;

  @Field({ nullable: false, description: 'user input value for Password' })
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: constant.WEAK_PASSWORD_MESSAGE,
  })
  Password: string;
}
