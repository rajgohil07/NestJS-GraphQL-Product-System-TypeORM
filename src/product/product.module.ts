import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/database/entity/product.entity';
import { UserModule } from 'src/user/user.module';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

@Module({
  exports: [ProductService],
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([ProductEntity]),
  ],
  providers: [ProductResolver, ProductService],
})
export class ProductModule {}
