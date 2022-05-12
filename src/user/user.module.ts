import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entity/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ProductEntity } from 'src/database/entity/product.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProductEntity]),
    forwardRef(() => AuthModule),
    ProductModule,
  ],
  exports: [UserService],
  providers: [UserResolver, UserService],
})
export class UserModule {}
