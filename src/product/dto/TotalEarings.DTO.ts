import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TotalEaringsDTO {
  @Field(() => Float)
  TotalEarings: number;
}
