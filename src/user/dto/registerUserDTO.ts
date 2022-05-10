import { Field, InputType } from '@nestjs/graphql';
import { constant } from 'src/common/constant';
import { IsAlpha, IsEmail, IsString, Length, Matches } from 'class-validator';

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
  @Matches(
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,16}$/,
    {
      message: constant.WEAK_PASSWORD_MESSAGE,
    },
  )
  Password: string;
}
