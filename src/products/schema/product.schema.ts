import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
   @Prop({ required: true })
   name: string;

   @Prop()
   detail: string;

   @Prop({ required: true })
   price: number;

   @Prop()
   image: string[]

   @Prop()
   publicId: string[]

}

export const ProductSchema = SchemaFactory.createForClass(Product);