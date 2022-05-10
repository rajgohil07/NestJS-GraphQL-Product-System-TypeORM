import { Field, Float, InputType } from '@nestjs/graphql';
import { constant } from 'src/common/constant';
import {
  IsBoolean,
  IsNotEmpty,
  IsPositive,
  Length,
  Min,
} from 'class-validator';

@InputType()
export class CreateProductDTO {
  @Field({ nullable: false })
  @IsNotEmpty({ message: constant.PLEASE_ENTER_THE_PRODUCT_NAME })
  @Length(3, 51, { message: constant.INVALID_PRODUCT_NAME })
  Name: string;

  @Field(() => Float)
  @IsPositive({ message: constant.PRICE_POSITIVE })
  @Min(0.1, { message: constant.PRICE_POSITIVE })
  Price: number;

  @Field()
  @IsBoolean({ message: constant.IN_STOCK_BOOLEAN })
  IN_Stock: boolean;
}
