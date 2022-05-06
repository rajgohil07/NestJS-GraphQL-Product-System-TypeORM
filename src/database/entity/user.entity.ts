import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';

@ObjectType({ description: 'user entity' })
@Entity({ name: 'User' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  ID: number;

  @CreateDateColumn()
  @Field(() => Date)
  CreatedDate: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  UpdatedDate: Date;

  @Column({ name: 'Name', nullable: false, comment: 'Name of the user' })
  @Field()
  Name: string;

  @Column({
    name: 'Email',
    nullable: false,
    comment: 'Provided email of the user',
  })
  @Field()
  Email: string;

  @Column({
    name: 'Password',
    type: 'text',
    comment: 'hashed password of the user',
    nullable: false,
  })
  @Field()
  Password: string;

  @OneToMany(() => ProductEntity, (user) => user.ProductOwner, {
    cascade: true,
  })
  ListOfProduct: ProductEntity;
}
