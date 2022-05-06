import { InjectRepository } from '@nestjs/typeorm';
import { constant } from 'src/common/constant';
import { comparePassword, hashPassword } from 'src/common/helper';
import { UserEntity } from 'src/database/entity/user.entity';
import { LoginUserDTO } from 'src/user/dto/LoginUserDTO';
import { RegisterUserDTO } from 'src/user/dto/registerUserDTO';
import { Repository } from 'typeorm';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductEntity } from 'src/database/entity/product.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  // to register the user into the system
  async registerUser(registerUserData: RegisterUserDTO): Promise<UserEntity> {
    const { Name, Email, Password } = registerUserData;
    const lowerEmail = Email.toLowerCase();
    const findOneData = await this.userRepository.findOne({
      where: { Email: lowerEmail },
      select: ['Email'],
    });
    if (findOneData && findOneData.Email) {
      throw new BadRequestException(constant.USER_ALREADY_EXIST);
    }
    const hashPasswordValue = await hashPassword(Password);
    const dataObject: RegisterUserDTO = {
      Name,
      Email: lowerEmail,
      Password: hashPasswordValue,
    };
    const createUserQuery = this.userRepository.create(dataObject);
    const saveUserData: UserEntity = await this.userRepository.save(
      createUserQuery,
    );
    return saveUserData;
  }

  // login into the system
  async userLogin(userLoginData: LoginUserDTO): Promise<UserEntity> {
    const { Email, Password } = userLoginData;
    const lowerEmail = Email.toLowerCase();
    const findUserData = await this.userRepository.findOne({
      where: {
        Email: lowerEmail,
      },
      select: ['ID', 'Email', 'Name', 'Password'],
    });
    if (!findUserData) {
      throw new NotFoundException(constant.EMAIL_NOT_FOUND);
    }
    const IsValidPassword = await comparePassword(
      Password,
      findUserData.Password,
    );
    if (!IsValidPassword) {
      throw new BadGatewayException(constant.PROVIDED_WRONG_PASSWORD);
    }
    delete findUserData.Password;
    return findUserData;
  }

  // get listing of the product (created user listing only)
  getAllProductByUser(UserID: number): Promise<ProductEntity[]> {
    return this.productRepository.find({ where: { UserID } });
  }
}
