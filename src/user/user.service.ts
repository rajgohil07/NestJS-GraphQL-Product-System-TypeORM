import { InjectRepository } from '@nestjs/typeorm';
import { constant } from 'src/common/constant';
import { UserOrderEntity } from 'src/database/entity/user.order.entity';
import { CreateOrderResponseDTO } from './dto/createOrderResponseDTO';
import { UserEntity } from 'src/database/entity/user.entity';
import { LoginUserDTO } from 'src/user/dto/loginUserDTO';
import { RegisterUserDTO } from 'src/user/dto/registerUserDTO';
import { Repository } from 'typeorm';
import { ProductEntity } from 'src/database/entity/product.entity';
import { ProductService } from 'src/product/product.service';
import {
  comparePassword,
  GenerateTransactionID,
  hashPassword,
} from 'src/common/helper';
import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly productService: ProductService,
    @InjectRepository(UserOrderEntity)
    private readonly userOrderRepository: Repository<UserOrderEntity>,
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

  // get listing of products with active user details (after login only)
  getAllProductListingWithUserDetails(UserID: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        ID: UserID,
      },
      relations: {
        ListOfProduct: true,
      },
    });
  }

  // find by UserID whether user exist or not
  async findByUserID(userID: number) {
    const findUser = await this.userRepository.findOne({
      where: { ID: userID },
      select: ['ID'],
    });
    if (!findUser) {
      throw new NotFoundException(constant.USER_DOES_NOT_EXIST);
    }
    return findUser;
  }

  // validation to check wether the user has already purchased the product or not
  async validateUserHasPurchasedTheProduct(
    productID: number,
    userID: number,
  ): Promise<boolean> {
    const find = await this.userOrderRepository.findOne({
      where: {
        UserID: userID,
        ProductID: productID,
      },
      select: ['ID'],
    });
    if (find) {
      throw new ForbiddenException(constant.YOU_ALREADY_BUY_THIS_ORDER);
    }
    return true;
  }

  // get unique transactionID for order
  async getTransactionID(): Promise<string> {
    const getUniqueTransactionID: string = GenerateTransactionID();
    const findTransactionID = await this.userOrderRepository.findOne({
      where: { TransactionID: getUniqueTransactionID },
      select: ['TransactionID'],
    });
    if (findTransactionID && findTransactionID.TransactionID) {
      this.getTransactionID();
    }
    return getUniqueTransactionID;
  }

  // buy a product (Note:A user can not buy same product again)
  async buyProduct(
    productID: number,
    userID: number,
  ): Promise<CreateOrderResponseDTO> {
    // validate both product and user using promise.all
    const [productData] = await Promise.all([
      this.productService.validateProductByID(productID),
      this.findByUserID(userID),
      this.validateUserHasPurchasedTheProduct(productID, userID),
    ]);
    const transactionID: string = `#TXN${await this.getTransactionID()}`;
    const createOrderObject: UserOrderEntity = {
      UserID: userID,
      ProductID: productID,
      TransactionID: transactionID,
    };
    const createOrder: UserOrderEntity =
      this.userOrderRepository.create(createOrderObject);
    await this.userOrderRepository.save(createOrder);
    return {
      ProductName: productData.Product_Name,
      TransactionID: transactionID,
      Message: constant.PURCHASED_ORDER_SUCCESS_MESSAGE,
    };
  }
}
