import { IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCategoryDto {
  @IsString()
  @MaxLength(30)
  @IsOptional()
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  detail: string;

  @IsOptional()
  @ApiProperty({ format: 'binary', required: false })
  image: string

}

export class filterCategoryDto {
  @IsOptional()
  @ApiProperty({ required: false })
  search: string
}