import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {Product,ProductDocument} from './product.schema'
import {Category,CategoryDocument} from './category.schema'
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
const ObjectId = Types.ObjectId;
@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>
      ) {}

       /**
         * create single Product
         * 
         * 
         */
        async createProduct(
            body: Product,
          ): Promise<ProductDocument> {
            const create: ProductDocument = new this.productModel(body);
             return await create.save().catch((err)=>{
              throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
             })
          }

            /**
         * create single Category and sub category
         * 
         * 
         */
        async createCategory(
            body: Category,
          ): Promise<CategoryDocument> {
            const create: CategoryDocument = new this.categoryModel(body);
             return await create.save().catch((err)=>{
              throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
             })
          }

           /**
         * get discount
         * 
         * 
         */
        async getDiscount(
          body: Product,
        ): Promise<any> {
          //get product category for returning discount
          const discount = await this.productModel.aggregate([
            {
              $match: body 
            },
            { $lookup: {
              from: 'categories',
              localField: 'category',
              foreignField: '_id',
              as: 'cat'
          }},
          { $unwind : { path: "$cat", preserveNullAndEmptyArrays: true } },
            
          ]).catch((err)=>{
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
          });
          //if product has no discount then we need to find it from its parent category
          if(discount[0].cat.discount!=null){
            return discount[0].cat.discount
          }else {
            //get discount which has higher priority
            const parentGroup = await this.categoryModel.aggregate([
              {
                $match: {_id:discount[0].category._id}
              },
             
            {
              $graphLookup: {
                  from: "categories",
                  startWith: "$parentId",
                  connectFromField: "parentId",
                  connectToField: "_id",
                  maxDepth: 3,
                  as: "subcategories",
              }
          },
            ]).catch((err)=>{
              throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
            });
            for(let i=parentGroup[0].subcategories.length-1;i>=0;i--){
              let bb=parentGroup[0].subcategories[i];
                if(parentGroup[0].subcategories[i].discount!=null){
                  return parentGroup[0].subcategories[i].discount
                }
            }
          }
          return -1
        }
}
