import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { ApiPageOkResponse, Auth, AuthUser } from '../../decorators';
import { User } from '../user/user.schema';
import { Product } from './product.schema';
import {ProductService} from './product.service'
import { LoggerService } from '../../logger/logger.service';
import {LoggerMessages} from '../../exceptions/index';
import { Category } from './category.schema';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { Action } from '../../casl/userRoles';
import { Types } from 'mongoose';
@Controller('product')
export class ProductController {
    constructor(
        private productService: ProductService,
        private readonly loggerService: LoggerService
      ) {this.loggerService.setContext('Product controller');}

      @Get()
      @Auth(Action.Read,'Admin')
      @HttpCode(HttpStatus.OK)
      @ApiPageOkResponse({
        description: 'Get Product discount',
        type: Product,
      })
      discount(
        @Query() data: Product,
        @AuthUser() user:User,
      ):Promise<Category> {
        data.userId=new Types.ObjectId(user.id)
        this.loggerService.log(`Post Category/ ${LoggerMessages.API_CALLED}`);
        return this.productService.getDiscount(data);
      }

    @Post()
    @Auth(Action.Create,'Admin')
    @HttpCode(HttpStatus.OK)
    @ApiPageOkResponse({
      description: 'Get users list',
      type: Product,
    })
    addProduct(
      @Body()
      data: Product,
      @AuthUser() user:User,
    ):Promise<Product> {
      this.loggerService.log(`Post Product/ ${LoggerMessages.API_CALLED}`);
      data.userId=new Types.ObjectId(user.id)
      return this.productService.createProduct(data);
    }

    
    @Post("/category")
    @Auth(Action.Create,'Admin')
    @HttpCode(HttpStatus.OK)
    @ApiPageOkResponse({
      description: 'Get users list',
      type: Product,
    })
    addCategory(
      @Body()
      data: Category,
      @AuthUser() user:User,
    ):Promise<Category> {
      data.userId=user.id
      this.loggerService.log(`Post Category/ ${LoggerMessages.API_CALLED}`);
      return this.productService.createCategory(data);
    }

}
