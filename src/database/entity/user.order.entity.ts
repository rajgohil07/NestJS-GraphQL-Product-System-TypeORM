import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ProductEntity } from './product.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'UserOrder' })
@ObjectType({ implements: () => [CommonEntity] })
export class UserOrderEntity extends CommonEntity {
  @Column({ nullable: false })
  @Field(() => Int)
  UserID: number;

  @Column({ nullable: false })
  @Field(() => Int)
  ProductID: number;

  @JoinColumn({ name: 'UserID' })
  @ManyToOne(() => UserEntity, (OrderData) => OrderData.UserOrderData, {
    onDelete: 'SET NULL',
  })
  @Field(() => UserEntity)
  BuyerData: UserEntity;

  @JoinColumn({ name: 'ProductID' })
  @ManyToOne(() => ProductEntity, (ProductData) => ProductData.UserOrderData, {
    onDelete: 'CASCADE',
  })
  @Field(() => ProductEntity)
  ProductData: ProductEntity;
}
