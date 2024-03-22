import { Document } from 'mongoose';
export interface user extends Document {
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly cpassword: string;
    readonly role: string;
}