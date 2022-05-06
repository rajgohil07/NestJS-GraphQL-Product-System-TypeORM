import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LogOutUserDTO {
  @Field()
  Message: string;
}
