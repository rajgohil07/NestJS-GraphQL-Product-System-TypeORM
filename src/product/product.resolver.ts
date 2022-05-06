import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { IsAuthenticated } from 'src/auth/guard/isAuthenticated.guard';
import { User } from 'src/custom_decoder/user.decoder';
import { ProductEntity } from 'src/database/entity/product.entity';
import { CreateProductDTO } from './dto/createProductDTO';
import { ProductService } from './product.service';

@Resolver(() => ProductEntity)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  // create Product and store user creator id with it
  @UseGuards(IsAuthenticated)
  @Mutation(() => ProductEntity, {
    description: 'create Product and store user creator id with it',
  })
  createProduct(
    @Args('CreateProductData') productData: CreateProductDTO,
    @User('ID') UserID: number,
  ): Promise<ProductEntity> {
    return this.productService.createProduct(UserID, productData);
  }
}
