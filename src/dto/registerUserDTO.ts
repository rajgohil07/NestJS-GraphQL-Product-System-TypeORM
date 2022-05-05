import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterUserDTO {
  @Field({ nullable: false, description: 'user input value for Name' })
  Name: string;

  @Field({ nullable: false, description: 'user input value for Email' })
  Email: string;

  @Field({ nullable: false, description: 'user input value for Password' })
  Password: string;
}
