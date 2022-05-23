import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Int, Float } from '@nestjs/graphql';
import { IsAuthenticated } from 'src/auth/guard/isAuthenticated.guard';
import { User } from 'src/custom_decoder/user.decoder';
import { ProductEntity } from 'src/database/entity/product.entity';
import { CreateProductDTO } from './dto/createProductDTO';
import { DeleteProductDTO } from './dto/deleteProductDTO';
import { TotalEaringsDTO } from './dto/TotalEarings.DTO';
import { EditProductDTO } from './dto/updateProductDTO';
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

  // get Product details by id with creator user name (only created user can edit this product)
  @UseGuards(IsAuthenticated)
  @Query(() => ProductEntity, {
    description:
      'get Product details by id with creator user name (only created user can edit this product)',
  })
  findProductByID(
    @Args('ProductID', { type: () => Int }) productID: number,
    @User('ID') userID: number,
  ): Promise<ProductEntity> {
    return this.productService.findProductByID(productID, userID);
  }

  // edit the product (only created user can edit this product)
  @UseGuards(IsAuthenticated)
  @Mutation(() => ProductEntity, {
    description: 'edit the product (only created user can edit this product)',
  })
  updateProduct(
    @Args('UpdateProductData') productData: EditProductDTO,
    @User('ID') UserID: number,
  ): Promise<ProductEntity> {
    return this.productService.updateProduct(productData, UserID);
  }

  // Delete product by ID (only created user can edit this product)
  @UseGuards(IsAuthenticated)
  @Mutation(() => DeleteProductDTO, {
    description:
      'Delete product by ID (only created user can edit this product)',
  })
  deleteProductByID(
    @Args('ProductID') ProductID: number,
    @User('ID') userID: number,
  ): Promise<DeleteProductDTO> {
    return this.productService.deleteProductByID(ProductID, userID);
  }

  // Get all product listing along with owner info
  @UseGuards(IsAuthenticated)
  @Query(() => [ProductEntity], {
    description: 'Get all product listing along with owner info',
  })
  findAllProductAlongWithOwnerInfo(): Promise<ProductEntity[]> {
    return this.productService.findAllProductAlongWithOwnerInfo();
  }

  // get buyers listing of particular product
  @UseGuards(IsAuthenticated)
  @Query(() => ProductEntity, {
    description: 'get buyers listing of particular product',
  })
  getProductBuyerList(
    @Args('ProductID', { type: () => Int }) productID: number,
    @User('ID') userID: number,
  ) {
    return this.productService.getProductBuyerList(productID, userID);
  }

  // Get total earning of the seller
  @UseGuards(IsAuthenticated)
  @Query(() => TotalEaringsDTO, {
    description: 'Get total earning of the seller',
  })
  getSellerTotalEarnings(@User('ID') userID: number): Promise<TotalEaringsDTO> {
    return this.productService.getSellerTotalEarnings(userID);
  }
}
