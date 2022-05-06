import { CreateProductDTO } from './createProductDTO';
import { Field, InputType, Int, IntersectionType } from '@nestjs/graphql';

@InputType()
export class GetProductIDDTO {
  @Field(() => Int)
  ProductID: number;
}

@InputType()
export class EditProductDTO extends IntersectionType(
  CreateProductDTO,
  GetProductIDDTO,
) {}
