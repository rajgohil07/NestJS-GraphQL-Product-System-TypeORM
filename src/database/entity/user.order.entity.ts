import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity({ name: 'UserOrder' })
@ObjectType({ implements: () => [CommonEntity] })
export class UserOrderEntity extends CommonEntity {
  @Column({ nullable: false })
  @Field(() => Int)
  UserID: number;

  @Column({ nullable: false })
  @Field(() => Int)
  ProductID: number;
}
