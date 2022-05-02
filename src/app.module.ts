import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresDataSource } from './config/database.config';
@Module({
  imports: [TypeOrmModule.forRoot(PostgresDataSource)],
  controllers: [],
  providers: [],
})
export class AppModule {}
