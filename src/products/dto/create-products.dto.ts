import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  price: number;

  @IsNotEmpty()
  @ApiProperty()
  detail: string;

  @IsNotEmpty()
  @ApiProperty()
  categoryId: string; 

  @ApiProperty({format:'binary'})
  image: string[]

}

export class filterProductDto {
  @IsOptional()
  @ApiProperty()
  search: string
}
