# Description

A modest project based on products, where users may create products and only the creators of those products can modify and eliminate them, as well as passport-local-strategy to store data into sessions using express-session.

## Installation

```bash
npm install
```

## keywords

- NestJS
- GraphQL
- Express-Session
- Passport
- Passport local strategy
- TypeORM
- One-to-many and Many-to-one relation
- Many-to-many relation
- Backend validation

## Installed modules for local passport strategy

- passport
- passport-local
- express-session
- @nestjs/passport
- @types/passport-local
- @types/express-session

## Steps to implement passport local strategy along with graphql

1. Create AuthGuard which take context from GraphQL and assign our Email and Password to req.body, because passport automatically gets your credentials from req.body but incase of graphql execution context is different so you have to manually set your args in req.body and for that getRequest method is used.

```bash
# example
@Injectable()
export class GQLAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const {
      UserLoginData: { Email, Password },
    } = ctx.getArgs();
    const req = ctx.getContext().req;
    req.body.Email = Email;
    req.body.Password = Password;
    return req;
  }
}
```

2. Export the class which extends the `PassportStrategy` with Strategy argument(inherited from passport-local module) and call super() method.you can even specify the usernameField and passwordField inside the super method.

```bash
#example
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
```

3. After that call the validate method inside the class.

4. After that we need to call serializeUser and deserializeUser method to store the user data into the session.

```bash
#example
@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: Function) {
    return done(null, user);
  }
  deserializeUser(payload: any, done: Function) {
    return done(null, payload);
  }
}

```

5. To call serializeUser method we need to create new AuthGuard which will take request and pass it to the passport logIn method.

```bash
#example
@Injectable()
export class SessionLocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctxRequest = GqlExecutionContext.create(context).getContext().req;
    await super.logIn(ctxRequest);
    return ctxRequest ? true : false;
  }
}

```

6. After that we need to call both guards in the login query/mutation by adding @UseGuards() decorator.

```bash
# example
  @Query(() => LoginResponse)
  @UseGuards(GQLAuthGuard, SessionLocalAuthGuard)
  login(
    @Args('LoginInput') loginInput: LoginInput,
    @User() user: UserEntity,
  ): LoginResponse {
    return {
      LoginSuccessMessage: constant.LOGIN_SUCCESSFUL,
      CurrentUser: user,
    };
  }
```

7. On successful login we can retrieve the current user by req.user we can even create custom decorator for that too, for that [please visit here](https://docs.nestjs.com/security/authentication#graphql 'please visit here title').

```bash
# example
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const user = GqlExecutionContext.create(ctx).getContext().req.user;
    return data ? user[data] : user;
  },
);

```

8. We can even implement new Guard to authenticate the user, for that we can do something like this.

```bash
@Injectable()
export class IsAuthenticated implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<any> {
    const ctxReq = GqlExecutionContext.create(context).getContext().req;
    const AuthenticationStatus = ctxReq.isAuthenticated();
    if (!AuthenticationStatus) {
      throw new UnauthorizedException(constant.UNAUTHORIZED_ACCESS_MESSAGE);
    }
    return AuthenticationStatus;
  }
}
```

9. And then we can call that guard on every query/mutation something like this

```bash
@UseGuards(IsAuthenticated)
  @Query(() => AllUserResponseDTO)
  async getAllUserData(@User() user: UserEntity): Promise<AllUserResponseDTO> {
    const userData: UserEntity[] | [] = await this.userService.getAllUserData(
      user.ID,
    );
    return { AllUserData: userData, CurrentUser: user };
  }
```

10. We can also create logout guard when user logout in the system (user login first to use this functionality)

```bash
export class Logout implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    if (!req.user) {
      throw new UnauthorizedException(constant.UNAUTHORIZED_ACCESS_MESSAGE);
    }
    await req.logout();
    return true;
  }
}
```

And then we can add that guard to our logout graphql query

```bash
@UseGuards(Logout)
  @Query(() => LogOutUserDTO, { description: 'logout to the system' })
  logoutUser(): LogOutUserDTO {
    return { Message: constant.LOGOUT_SUCCESSFUL };
  }
```

11. Then we can use class-validator & class-transformer as a backend validation

```bash
#example (where all the decorator are imported from class-validator)
@InputType()
export class RegisterUserDTO {
  @Field({ nullable: false, description: 'user input value for Name' })
  @IsAlpha()
  @Length(3, 45, { message: constant.INVALID_NAME_RANGE_MESSAGE })
  Name: string;

  @Field({ nullable: false, description: 'user input value for Email' })
  @IsEmail({ message: constant.INVALID_EMAIL_FORMAT })
  Email: string;

  @Field({ nullable: false, description: 'user input value for Password' })
  @IsString()
  @Matches(
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,16}$/,
    {
      message: constant.WEAK_PASSWORD_MESSAGE,
    },
  )
  Password: string;
}


```

## Query

```bash
# to check connection
query {
  checkServer {
    connectionStatus
  }
}

# to login the user
query {
  userLogin(
    UserLoginData: { Email: "raj.famous009@gmail.com", Password: "123123Raj!" }
  ) {
    loginMessage
    userData {
      ID
      Name
      Email
    }
  }
}

# to logout the user
query {
  logoutUser {
    Message
  }
}

# Get Product details by id with creator user name (only created user + login can edit this product)
query {
  findProductByID(ProductID: 1) {
    ID,
    CreatedDate
    Product_Name
    Price
    IN_Stock
    ProductOwner {
      Name
      Email
    }
  }
}

# Get all the product by the UserID
query {
  getAllProductByUser {
    ID
    CreatedDate
    Product_Name
    Price
    IN_Stock
  }
}

# get listing of products with active user details (after login only)
query {
  getAllProductListingWithUserDetails {
    Name
    Email
    ListOfProduct {
      Product_Name
      Price
      IN_Stock
    }
  }
}

# Get all product listing along with owner info
query {
  findAllProductAlongWithOwnerInfo {
    ID
    Product_Name
    Price
    IN_Stock
    ProductOwner {
      ID
      Name
      Email
    }
  }
}

# Get buyers listing of particular product
query {
  getProductBuyerList(ProductID: 1) {
    Product_Name
    UserOrderData {
      BuyerData {
        Name
      }
    }
  }
}

```

## Mutation

```bash
# user register functionality
mutation {
  registerUser(
    registerUser: {
      Name: "Raj Gohil"
      Email: "raj.famous009@gmail.com"
      Password: "123123Raj!"
    }
  ) {
    Name
    Email
    CreatedDate
  }
}

# create the product (after login into the system only)
mutation {
  createProduct(
    CreateProductData: {
      Name: "Mobile Phone"
      Price: 38999.99
      IN_Stock: true
    }
  ) {
    Product_Name
    Price
    IN_Stock
    UserID
  }
}

# to update the product (only created user + login can edit this product)
mutation {
  updateProduct(
    UpdateProductData: {
      Name: "Poco X3 Pro"
      ProductID: 1
      Price: 18000
      IN_Stock: false
    }
  ) {
    Product_Name
    Price
    IN_Stock
  }
}

# Delete product by ID (only created user + login can edit this product)
mutation {
  deleteProductByID(ProductID: 3) {
    DeletedProductCount
  }
}

# Buy a product (Note:A user can not buy same product again)
mutation {
  buyProduct(ProductID: 1) {
    Message
    ProductName
    TransactionID
  }
}

```

## Useful links

```bash

# passport along with GraphQl
https://docs.nestjs.com/security/authentication#graphql

#create custom decorator using GraphQL
https://docs.nestjs.com/security/authentication#graphql

# session with local strategy
https://dev.to/nestjs/authentication-and-sessions-for-mvc-apps-with-nestjs-55a4

# stack overflow link if you got 401 unauthorize every single time
https://stackoverflow.com/questions/68390441/nestjs-graphql-passport-getting-unauthorised-error-from-guard

# join column reference options
https://typeorm.io/relations#joincolumn-options

# enum column types
https://typeorm.io/entities#enum-column-type

# log on database connection
https://typeorm.io/data-source#creating-a-new-datasource

# custom decoder with GraphQL
https://docs.nestjs.com/graphql/other-features#custom-decorators

# NestJS Built-in HTTP exceptions
https://docs.nestjs.com/exception-filters#built-in-http-exceptions

# class-validator and class-transformer git repo link
https://github.com/typestack/class-validator

# manual validation due to below issue
https://github.com/nestjs/passport/issues/129

```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod

# generate migration
npm run migration:generate --name=name_of_the_migration

# run the migration
npm run migration:run
```
