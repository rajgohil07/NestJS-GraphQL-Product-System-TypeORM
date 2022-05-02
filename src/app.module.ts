import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppResolver } from './app.resolver';
import { PostgresDataSource } from './config/database.config';
import { GraphQLConfig } from './config/graphql.config';
@Module({
  imports: [
    TypeOrmModule.forRoot(PostgresDataSource),
    GraphQLModule.forRoot(GraphQLConfig),
  ],
  controllers: [],
  providers: [AppResolver],
})
export class AppModule {}
