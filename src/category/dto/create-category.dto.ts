import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  detail: string;

 
}

export class filterCategoryDto {
  @IsOptional()
  @ApiProperty({ required: false })
  search: string
}