import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppResolver } from './app.resolver';
import { PostgresDataSource } from './config/database.config';
import { GraphQLConfig } from './config/graphql.config';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(PostgresDataSource),
    GraphQLModule.forRoot(GraphQLConfig),
    UserModule,
    ProductModule,
  ],
  controllers: [],
  providers: [AppResolver],
})
export class AppModule {}
