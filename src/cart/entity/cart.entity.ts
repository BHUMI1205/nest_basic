import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now } from 'mongoose';

@Schema()
export class Cart extends Document {
    @Prop({ required: true })
    productId: string;

    @Prop()
    userId: string;

    @Prop({ default: now() })
    createdAt: Date;

    @Prop({ default: now() })
    updatedAt: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
