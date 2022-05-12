import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document, SchemaTypes, Types } from 'mongoose';
import {  IsInt,IsString, MinLength, MaxLength, IsEmail, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { User } from '../user/user.schema';
import { Category } from './category.schema';
export type ProductDocument = Product & Document;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Product {
  id:string

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty()
  @Prop({ type: "string", required: true, trim: true })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: Category.name })
  category: Types.ObjectId;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  @Prop({ type: "number", required: true,default:0 })
  code: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  @Prop({ type: "number", required: true,default:0 })
  amountInvoice: number;


  @IsOptional()
  @IsString()
  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  userId: Types.ObjectId;
}

 const ProductSchema = SchemaFactory.createForClass(Product);
 ProductSchema.virtual('id').get(function (this: ProductDocument) {
  return this._id.toString()
});
export {ProductSchema}
