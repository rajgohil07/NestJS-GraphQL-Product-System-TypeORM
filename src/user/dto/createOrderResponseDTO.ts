import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateOrderResponseDTO {
  @Field()
  Message: string;

  @Field()
  TransactionID: string;

  @Field()
  ProductName: string;
}
