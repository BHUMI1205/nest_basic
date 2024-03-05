import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { Multer } from 'multer';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  detail: string;

}
