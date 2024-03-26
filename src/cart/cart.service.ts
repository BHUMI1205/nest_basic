import { Injectable, HttpStatus } from '@nestjs/common';
import { Model } from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { cart } from './interface/cart.interface';
import { product } from '../products/interfaces/products.interface'

@Injectable()
export class CartService {
    constructor(
        @InjectModel('cart') private CartModel: Model<cart>,
        @InjectModel('product') private ProductModel: Model<product>,
    ) { }

    async add(productId: string, id, res) {
        const product = await this.ProductModel.findOne({
            _id: productId,
        });

        if (product) {
            const data = this.CartModel.create({
                productId: product._id,
                userId: id
            });

            return res.status(HttpStatus.CREATED).json({
                status: HttpStatus.CREATED,
                message: 'Product has been added to cart successfully',
                data: data
            });
        } else {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: 'Product is not available!',
            });
        }
    }

    async deleteProduct(Id: string, res) {
        const data = await this.CartModel.findByIdAndDelete(Id);

        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'Cart item deleted successfully',
            data: data
        });
    }

    async showCartProduct(res) {
        const data = await this.CartModel.find({})

        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'Cart Item Collected uccessfully',
            data: data
        })
    }
}