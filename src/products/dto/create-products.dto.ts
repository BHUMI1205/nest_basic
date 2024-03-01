import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { Multer } from 'multer';

export class CreateProductDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  // @IsNumber()
  // @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  detail: string;

  // @IsNotEmpty()
  image: string; 
}
