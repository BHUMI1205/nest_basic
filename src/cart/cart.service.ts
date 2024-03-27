import { Injectable, HttpStatus } from '@nestjs/common';
import mongoose, { Model } from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { cart } from './interface/cart.interface';
import { product } from '../products/interfaces/products.interface'

@Injectable()
export class CartService {
    constructor(
        @InjectModel('cart') private CartModel: Model<cart>,
        @InjectModel('product') private ProductModel: Model<product>,
    ) { }

    async add(productId: string, id: string, res) {
        const product = await this.ProductModel.findOne({
            _id: productId,
        });

        if (product) {
            const data = await this.CartModel.create({
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

    async showCartProduct(id: string, res) {
        const data = await this.CartModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "products"
                }
            },
            {
                $unwind: "$products"
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "products.categoryId",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $project: {
                    _id: '$products._id',
                    category_name: '$category.name',
                    name: '$products.name',
                    detail: '$products.detail',
                    price: '$products.price',
                    image: '$products.image',
                    publicId: '$products.publicId'
                }
            }
        ])

        if (data != null) {
            return res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'Cart Item Collected successfully',
                data: data
            })
        } else {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: 'There is nothing in Cart',
            })
        }
    }

    async checkout(res, id: string) {
        const data = await this.CartModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "products"
                }
            },
            {
                $unwind: "$products"
            },
            {
                $group: {
                    _id: id,
                    totalProduct: { $sum: 1 },
                    totalAmount: { $sum: '$products.price' }
                }
            }
        ])
        if (data != null) {
            return res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'checkout',
                data: data
            })
        } else {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: 'There is nothing in Cart',
            })
        }

    }
}