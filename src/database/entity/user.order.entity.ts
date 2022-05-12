import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity({ name: 'UserOrder' })
@ObjectType({ implements: () => [CommonEntity] })
export class UserOrderEntity implements CommonEntity {
  ID: number;
  CreatedDate: Date;
  UpdatedDate: Date;

  @Column({ nullable: false })
  @Field(() => Int)
  UserID: number;

  @Column({ nullable: false })
  @Field(() => Int)
  ProductID: number;
}
