import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/database/entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './dto/createProductDTO';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  // create Product and store user creator id with it
  async createProduct(
    UserID: number,
    CreateProductData: CreateProductDTO,
  ): Promise<ProductEntity> {
    const { Name, IN_Stock, Price } = CreateProductData;
    const CreateProductObject: object = {
      Product_Name: Name,
      Price,
      IN_Stock,
      UserID,
    };
    const createProductQuery =
      this.productRepository.create(CreateProductObject);
    return this.productRepository.save(createProductQuery);
  }
}
