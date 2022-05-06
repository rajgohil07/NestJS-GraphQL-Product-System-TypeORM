import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType({ description: 'Product' })
@Entity({ name: 'Product' })
export class ProductEntity {
  @PrimaryGeneratedColumn({ comment: 'Primary key of product table' })
  @Field(() => Int)
  ID: number;

  @CreateDateColumn({
    comment: 'Store the date of creation operation',
    nullable: false,
  })
  @Field(() => Date)
  CreatedDate: Date;

  @UpdateDateColumn({
    comment: 'Store the date of update operation',
    nullable: false,
  })
  @Field(() => Date)
  UpdatedDate: Date;

  @Column({
    comment: 'Price of the product per unit',
    nullable: false,
    type: 'float',
  })
  @Field(() => Float)
  Price: number;

  @Column({
    comment: 'To specify weather the product is in stock or not',
    nullable: false,
    type: 'bool',
  })
  @Field()
  IN_Stock: boolean;
}
