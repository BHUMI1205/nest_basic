import { Document } from 'mongoose';
export interface product extends Document {
  name: string;
  price: number;
  detail: string;
  image: string;
}