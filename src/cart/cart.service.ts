import { Injectable, Req } from '@nestjs/common';
import { Model } from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { cart } from './interface/cart.interface';
import { CreateCartProductDto } from './dto/add-cartProduct.dto';
import { Cart } from './entity/cart.entity';
import { Product } from 'src/products/entity/product.entity';
import { product } from '../products/interfaces/products.interface'

@Injectable()
export class CartService {
    constructor(
        @InjectModel('cart') private CartSchema: Model<cart>,
        @InjectModel('product') private ProductSchema: Model<product>,
    ) { }

    async add(
        createCartProductDto: CreateCartProductDto,
        @Req() req,
    ): Promise<cart> {

        const product = await this.ProductSchema.findOne({
            _id: createCartProductDto.productId,
        });

        if (product) {
            console.log(product._id);

            const cartData = new this.CartSchema({
                productId: product._id,
                userId: req.user.id,
            });
            console.log(cartData);

            return cartData.save();
        }
    }
}