import { Resolver } from '@nestjs/graphql';
import { ProductEntity } from 'src/database/entity/product.entity';

@Resolver(() => ProductEntity)
export class ProductResolver {}
