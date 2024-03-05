import { Document } from 'mongoose';
export interface category extends Document {
  name: string;
  detail: string;
  image: string;
  publicId: string;
}