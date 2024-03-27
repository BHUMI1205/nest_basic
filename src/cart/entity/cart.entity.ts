import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { now, Document } from "mongoose";

@Schema()
export class Cart extends Document {

    @Prop({ ref: 'Product' })
    productId: mongoose.Schema.Types.ObjectId

    @Prop({ ref: 'User', index: true })
    userId: mongoose.Schema.Types.ObjectId

    @Prop({ default: now() })
    createdAt: Date;

    @Prop({ default: now() })
    updatedAt: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
