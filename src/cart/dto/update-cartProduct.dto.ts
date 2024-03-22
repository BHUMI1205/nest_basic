import { PartialType } from '@nestjs/mapped-types';
import { CreateCartProductDto } from './add-cartProduct.dto';
export class UpdateProductDto extends PartialType(CreateCartProductDto) { }