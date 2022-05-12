import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document, SchemaTypes, Types } from 'mongoose';
import {generateHash} from '../../common/utils';
import {  IsInt,IsString, MinLength, MaxLength, IsEmail, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { User } from '../user/user.schema';
export type CategoryDocument = Category & Document;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Category {
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
  parentId: Types.ObjectId;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  @Prop({ type: "number", default:null })
  discount: number;


  @IsOptional()
  @IsString()
  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  userId: string;
}

 const CategorySchema = SchemaFactory.createForClass(Category);
 CategorySchema.virtual('id').get(function (this: CategoryDocument) {
  return this._id.toString()
});
export {CategorySchema}
