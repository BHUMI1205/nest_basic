import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
@Schema()
export class User {
   
   @Prop() // property
   name: string;

   @Prop()
   email: string;

   @Prop()
   password: string;

   @Prop({ default: "user" })
   role: string
}
export const UserSchema = SchemaFactory.createForClass(User);