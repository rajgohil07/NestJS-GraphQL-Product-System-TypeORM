import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from 'src/user/user.service';
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class PassportLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      usernameField: 'Email',
      passwordField: 'Password',
    });
  }

  validate(Email: string, Password: string) {
    try {
      return this.userService.userLogin({ Email, Password });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
