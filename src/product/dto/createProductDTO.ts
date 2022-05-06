import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProductDTO {
  @Field({ nullable: false })
  Name: string;

  @Field(() => Float)
  Price: number;

  @Field()
  IN_Stock: boolean;
}
