import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {now, Document} from "mongoose";
import { Category } from 'src/category/schema/category.schema';

@Schema()
export class Product extends Document {
   @Prop({ required: true })
   name: string;

   @Prop({ required: true })
   detail: string;

   @Prop({ required: true })
   price: number;

   @Prop({ref:'Category'})
   categoryId : mongoose.Schema.Types.ObjectId

   @Prop()
   image: string[]

   @Prop()
   publicId: string[]

   @Prop({default: now()})
   createdAt: Date;

   @Prop({default: now()})
   updatedAt: Date;
}


export const ProductSchema = SchemaFactory.createForClass(Product);
