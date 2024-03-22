import { Document } from 'mongoose';
export interface cart extends Document {
    userId: string;
    productId: string;
}