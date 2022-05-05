import { InputType, OmitType } from '@nestjs/graphql';
import { RegisterUserDTO } from './registerUserDTO';

@InputType()
export class LoginUserDTO extends OmitType(RegisterUserDTO, [
  'Name',
] as const) {}
