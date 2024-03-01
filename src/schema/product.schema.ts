import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
@Schema()
export class Product {
   @Prop() // property
   name: string;
   @Prop()
   price: number;
   @Prop()
   detail: string;
   @Prop()
   image:string;

}
export const ProductSchema = SchemaFactory.createForClass(Product);