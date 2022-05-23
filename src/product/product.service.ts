import { InjectRepository } from '@nestjs/typeorm';
import { constant } from 'src/common/constant';
import { ProductEntity } from 'src/database/entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './dto/createProductDTO';
import { EditProductDTO } from './dto/updateProductDTO';
import { DeleteProductDTO } from './dto/deleteProductDTO';
import { UserService } from 'src/user/user.service';
import { TotalEaringsDTO } from './dto/TotalEarings.DTO';
import { formatter } from 'src/common/helper';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(
    // to solve circular dependency issue reference https://docs.nestjs.com/fundamentals/circular-dependency
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  // create Product and store user creator id with it
  async createProduct(
    userID: number,
    CreateProductData: CreateProductDTO,
  ): Promise<ProductEntity> {
    const { Name, IN_Stock, Price } = CreateProductData;
    const CreateProductObject: object = {
      Product_Name: Name,
      Price,
      IN_Stock,
      UserID: userID,
    };
    const createProductQuery =
      this.productRepository.create(CreateProductObject);
    return this.productRepository.save(createProductQuery);
  }

  // get Product details by id with creator user name (only created user can edit this product)
  async findProductByID(
    productID: number,
    userID: number,
  ): Promise<ProductEntity> {
    const findProduct = await this.productRepository.findOne({
      where: { ID: productID },
      relations: {
        ProductOwner: true,
      },
    });
    if (!findProduct) {
      throw new NotFoundException(constant.PRODUCT_NOT_FOUND);
    }
    if (findProduct.UserID !== userID) {
      throw new BadRequestException(
        constant.ONLY_OWNER_OF_THE_PRODUCT_CAN_PERFORM_THIS_ACTION,
      );
    }
    return findProduct;
  }

  // edit the product (only created user can edit this product)
  async updateProduct(
    productData: EditProductDTO,
    userID: number,
  ): Promise<ProductEntity> {
    const { ProductID, Name, IN_Stock, Price } = productData;
    // validate user and product
    await this.findProductByID(ProductID, userID);
    const updateProductDataObject: object = {
      ID: ProductID,
      Product_Name: Name,
      Price,
      IN_Stock,
      UserID: userID,
    };
    const updateProductDataQuery = await this.productRepository.preload(
      updateProductDataObject,
    );
    return this.productRepository.save(updateProductDataQuery);
  }

  // Delete product by ID (only created user can edit this product)
  async deleteProductByID(
    projectID: number,
    userID: number,
  ): Promise<DeleteProductDTO> {
    // validate user and product
    await this.findProductByID(projectID, userID);
    const deleteProductCount = await this.productRepository.delete(projectID);
    return { DeletedProductCount: deleteProductCount.affected };
  }

  // Get all product listing along with owner info
  async findAllProductAlongWithOwnerInfo(): Promise<ProductEntity[]> {
    const data = await this.productRepository
      .createQueryBuilder('projectData')
      .innerJoin('projectData.ProductOwner', 'OwnerInfo')
      .select([
        'projectData.ID',
        'projectData.Product_Name',
        'projectData.Price',
        'projectData.IN_Stock',
        'OwnerInfo.ID',
        'OwnerInfo.Email',
        'OwnerInfo.Name',
      ])
      .getMany();
    return data;

    // we can also achieve the same result by using find method
    // const data = await this.productRepository.find({
    //   relations: {
    //     ProductOwner: true,
    //   },
    // });
    // return data;
  }

  // get Product details by id
  async validateProductByID(productID: number): Promise<ProductEntity> {
    const findProduct = await this.productRepository.findOne({
      where: { ID: productID },
      select: ['Product_Name'],
    });
    if (!findProduct) {
      throw new NotFoundException(constant.PRODUCT_NOT_FOUND);
    }
    return findProduct;
  }

  // get buyers listing of particular product
  async getProductBuyerList(productID: number, userID: number) {
    // validate product and the user
    await this.findProductByID(productID, userID);
    const productAndBuyerListQuery =
      this.productRepository.createQueryBuilder('productListing');
    const productAndBuyerListData = await productAndBuyerListQuery
      .select(['productListing.Product_Name'])
      .leftJoin('productListing.UserOrderData', 'userOrder')
      .leftJoin('userOrder.BuyerData', 'userOrderData')
      .where('productListing.ID=:ProductID', { ProductID: productID })
      .addSelect(['userOrder', 'userOrderData.Name'])
      .getOne();
    return productAndBuyerListData;
  }

  // Get total earning of the seller
  async getSellerTotalEarnings(userID: number): Promise<TotalEaringsDTO> {
    await this.userService.findByUserID(userID);
    const { totalEarings } = await this.productRepository
      .createQueryBuilder('product')
      .where('product.UserID=:userID', { userID })
      .innerJoin('product.UserOrderData', 'UserOrderData')
      .select('SUM(product.Price)', 'totalEarings')
      .getRawOne();
    return { TotalEarings: formatter(totalEarings) };
  }
}
