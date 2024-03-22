import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now } from 'mongoose';

@Schema()
export class Category extends Document {
   @Prop({ required: true })
   name: string;

   @Prop()
   detail: string;

   @Prop()
   image: string

   @Prop()
   publicId: string

   @Prop({ default: now() })
   createdAt: Date;

   @Prop({ default: now() })
   updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
