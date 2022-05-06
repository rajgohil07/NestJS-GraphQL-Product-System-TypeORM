import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteProductDTO {
  @Field(() => Int)
  DeletedProductCount: number;
}
