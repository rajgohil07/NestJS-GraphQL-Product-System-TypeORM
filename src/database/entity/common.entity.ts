import { Field, Int, InterfaceType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@InterfaceType()
export abstract class CommonEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  ID?: number;

  @CreateDateColumn()
  @Field(() => Date)
  CreatedDate?: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  UpdatedDate?: Date;
}
