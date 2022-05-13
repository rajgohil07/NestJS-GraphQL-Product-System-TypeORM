import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entity/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ProductEntity } from 'src/database/entity/product.entity';
import { ProductModule } from 'src/product/product.module';
import { UserOrderEntity } from 'src/database/entity/user.order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProductEntity, UserOrderEntity]),
    forwardRef(() => AuthModule),
    ProductModule,
  ],
  exports: [UserService],
  providers: [UserResolver, UserService],
})
export class UserModule {}
