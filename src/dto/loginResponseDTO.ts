import { Field, ObjectType, PickType } from '@nestjs/graphql';
import { UserEntity } from 'src/database/entity/user.entity';

@ObjectType()
class loginUserData extends PickType(UserEntity, [
  'ID',
  'Name',
  'Email',
] as const) {}

@ObjectType()
export class loginResponseDTO {
  @Field()
  loginMessage: string;

  @Field(() => loginUserData)
  userData: loginUserData;
}
