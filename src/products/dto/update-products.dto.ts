import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateProductDto {
  @IsString()
  @MaxLength(30)
  @IsOptional()
  @ApiProperty({ required: false })
  name: string;

  @IsOptional()
  @ApiProperty({ required: false })
  price: number;

  @IsOptional()
  @ApiProperty({ required: false })
  detail: string;

  @IsOptional()
  @ApiProperty({ required: false })
  categoryId: string;

  @IsOptional()
  @ApiProperty({ format: 'binary', required: false })
  image: string[]

}

export class filterProductDto {
  @IsOptional()
  @ApiProperty()
  search: string
}
