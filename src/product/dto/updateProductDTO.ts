import { CreateProductDTO } from './createProductDTO';
import { Field, InputType, Int, IntersectionType } from '@nestjs/graphql';
import { IsPositive, IsInt } from 'class-validator';

@InputType()
export class GetProductIDDTO {
  @Field(() => Int)
  @IsPositive()
  @IsInt()
  ProductID: number;
}

@InputType()
export class EditProductDTO extends IntersectionType(
  CreateProductDTO,
  GetProductIDDTO,
) {}
