import { IsNotEmpty} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCartProductDto {
  @IsNotEmpty()
  @ApiProperty()
  productId: string;
}
