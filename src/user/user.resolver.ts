import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GQLAuthGuard } from 'src/auth/guard/gql_auth.guard';
import { constant } from 'src/common/constant';
import { User } from 'src/custom_decoder/user.decoder';
import { UserEntity } from 'src/database/entity/user.entity';
import { LoginUserDTO } from 'src/user/dto/LoginUserDTO';
import { RegisterUserDTO } from 'src/user/dto/registerUserDTO';
import { UserService } from './user.service';
import { ActivateSession } from 'src/auth/guard/activate.session.guard';
import { IsAuthenticated } from 'src/auth/guard/isAuthenticated.guard';
import { LogOutUserDTO } from './dto/logoutUserDTO';
import { Logout } from 'src/auth/guard/logout.guard';
import { ProductEntity } from 'src/database/entity/product.entity';
import {
  loginResponseDTO,
  UserDecoderData,
} from 'src/user/dto/loginResponseDTO';
import { CreateOrderResponseDTO } from './dto/createOrderResponseDTO';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // to register the user into the system
  @Mutation(() => UserEntity, {
    description: 'to register the user into the system',
  })
  registerUser(
    @Args('registerUser') registerUser: RegisterUserDTO,
  ): Promise<UserEntity> {
    return this.userService.registerUser(registerUser);
  }

  // login into the system
  @UseGuards(GQLAuthGuard, ActivateSession, IsAuthenticated)
  @Query(() => loginResponseDTO, { description: 'login into the system' })
  async userLogin(
    @Args('UserLoginData') userLoginData: LoginUserDTO,
    @User() user: UserDecoderData,
  ): Promise<loginResponseDTO> {
    return { loginMessage: constant.LOGIN_SUCCESSFUL, userData: user };
  }

  // logout to the system
  @UseGuards(Logout)
  @Query(() => LogOutUserDTO, { description: 'logout to the system' })
  logoutUser(): LogOutUserDTO {
    return { Message: constant.LOGOUT_SUCCESSFUL };
  }

  // get listing of the product (created user listing only)
  @UseGuards(IsAuthenticated)
  @Query(() => [ProductEntity], {
    description: 'Get all the product by the User.ID',
  })
  getAllProductByUser(@User('ID') userID: number): Promise<ProductEntity[]> {
    return this.userService.getAllProductByUser(userID);
  }

  // get listing of products with active user details (after login only)
  @UseGuards(IsAuthenticated)
  @Query(() => UserEntity, {
    description:
      'get listing of products with active user details (after login only)',
  })
  getAllProductListingWithUserDetails(
    @User('ID') userID: number,
  ): Promise<UserEntity> {
    return this.userService.getAllProductListingWithUserDetails(userID);
  }

  // buy a product (Note:A user can not buy same product again)
  @UseGuards(IsAuthenticated)
  @Mutation(() => CreateOrderResponseDTO, {
    description: 'buy a product (Note:A user can not buy same product again)',
  })
  buyProduct(
    @Args('ProductID', { type: () => Int }) productID: number,
    @User('ID') userID: number,
  ): Promise<CreateOrderResponseDTO> {
    return this.userService.buyProduct(productID, userID);
  }
}
