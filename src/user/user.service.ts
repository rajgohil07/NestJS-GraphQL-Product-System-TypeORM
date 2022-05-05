import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { constant } from 'src/common/constant';
import { hashPassword } from 'src/common/helper';
import { UserEntity } from 'src/database/entity/user.entity';
import { RegisterUserDTO } from 'src/dto/registerUserDTO';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
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
}
