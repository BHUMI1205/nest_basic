import { Model } from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { product } from './interfaces/products.interface';
import { CreateProductDto } from './dto/create-products.dto'
import { UpdateProductDto } from './dto/update-products.dto'
import { ProductSchema } from './schema/product.schema';
import toStream = require('buffer-to-stream');
import * as cloudinary from 'cloudinary';   
import { Readable } from 'stream';
import * as mongoose from 'mongoose';

@Injectable()
export class ProductService {
    constructor(@InjectModel('product') private ProductSchema: Model<product>) {
        cloudinary.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    private uploadImageToCloudinary(fileBuffer: Buffer): Promise<cloudinary.UploadApiResponse> {
        try {
            return new Promise((resolve, reject) => {
                const publicId = Date.now() + Math.floor(Math.random() * 1000000).toString();

                cloudinary.v2.uploader.upload_stream(
                    { public_id: publicId, resource_type: 'auto', folder: 'nest_basic/productImages', },
                    (error: cloudinary.UploadApiErrorResponse, result: cloudinary.UploadApiResponse) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                ).end(fileBuffer);
            });
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }

    async create(createProductDto: CreateProductDto, fileBuffers: Buffer[]): Promise<product> {
        try {
            const uploadPromises = fileBuffers.map(fileBuffer => this.uploadImageToCloudinary(fileBuffer));

            const uploadResults = await Promise.all(uploadPromises);

            const imageUrl = [];
            const publicId = [];

            uploadResults.forEach(result => {
                if (result.url && result.public_id) {
                    imageUrl.push(result.url);
                    publicId.push(result.public_id);
                }
            });
            const newProduct = new this.ProductSchema({
                ...createProductDto,
                image: imageUrl,
                publicId: publicId
            });

            return newProduct.save();
        } catch (error) {

            throw new Error("Error creating product");
        }
    }

    async getAll(): Promise<{ products: product[] }[]> {
        const aggregatedProducts = await this.ProductSchema.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'categoryData'
                }
            },
            {
                $group: {
                    _id: "$category",
                    categoryData: { $first: "$categoryData" },
                    products: { $push: "$$ROOT" }
                }
            }
        ]).exec();

        if (!aggregatedProducts || aggregatedProducts.length === 0) {
            throw new NotFoundException('No products found!');
        }

        return aggregatedProducts.map(({ products }) => ({
            products: products
        }));
    }
    async getProduct(Id: string): Promise<{ product: product; }> {
        const aggregatedProduct = await this.ProductSchema.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(Id) }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'categoryData'
                }
            }
        ]).exec();

        if (!aggregatedProduct || aggregatedProduct.length === 0) {
            throw new NotFoundException(`Product #${Id} not found`);
        }

        return { product: aggregatedProduct[0] };
    }


    async updateProductImage(Id: string, imageData: Buffer[], updateProductDto: UpdateProductDto): Promise<product> {
        try {
            const deletedProduct = await this.ProductSchema.findById(Id);

            if (!deletedProduct) {
                throw new NotFoundException(`Product with ID ${Id} not found`);
            }

            let publicIds = deletedProduct.publicId

            for (let i = 0; i < publicIds.length; i++) {
                cloudinary.v2.uploader.destroy(publicIds[i]);
            }

            const uploadPromises = imageData.map(fileBuffer => this.uploadImageToCloudinary(fileBuffer));

            const uploadResults = await Promise.all(uploadPromises);

            const imageUrl = [];
            const publicId = [];

            uploadResults.forEach(result => {
                if (result.url && result.public_id) {
                    imageUrl.push(result.url);
                    publicId.push(result.public_id);
                }
            });


            const updatedProduct = await this.ProductSchema.findByIdAndUpdate(
                Id,
                { ...updateProductDto, image: imageUrl, publicId: publicId },
                { new: true }
            );


            return updatedProduct.save();

        } catch (error) {
            console.error("Error updating product image:", error);
            throw error;
        }
    }

    async updateProduct(Id: string, updateProductDto: UpdateProductDto): Promise<product> {
        try {
            const existingProduct = await this.ProductSchema.findByIdAndUpdate(Id, updateProductDto, { new: true });

            if (!existingProduct) {
                throw new NotFoundException(`Product #${Id} not found`);
            }
            return existingProduct;
        }

        catch (err) {
            console.log(err);
            throw err;
        }
    }

    async deleteProduct(Id: string): Promise<product> {
        const deletedProduct = await this.ProductSchema.findByIdAndDelete(Id);

        let image = deletedProduct.publicId

        for (let i = 0; i < image.length; i++) {
            cloudinary.v2.uploader.destroy(image[i]);
        }

        if (!deletedProduct) {
            throw new NotFoundException(`Product #${Id} not found`);
        }
        return deletedProduct;
    }
}


// async getAll(): Promise<product[]> {
//     const productData = await this.ProductSchema.find();
//     if (!productData || productData.length == 0) {
//         throw new NotFoundException('Product data not found!');
//     }
//     return productData;
// }

// async getProduct(Id: string): Promise<product> {
//     const existingProduct = await this.ProductSchema.findById(Id).exec();
//     if (!existingProduct) {
//         throw new NotFoundException(`Product #${Id} not found`);
//     }
//     return existingProduct;
// }

// async updateProductImage(Id: string, imageData: Buffer, updateProductDto: UpdateProductDto): Promise<product> {
//     try {
//         const deletedProduct = await this.ProductSchema.findById(Id);

//         if (!deletedProduct) {
//             throw new NotFoundException(`Product with ID ${Id} not found`);
//         }

//         await cloudinary.v2.uploader.destroy(deletedProduct.publicId);

//         const result = await this.uploadImageToCloudinary(imageData);

//         const image = result.url;
//         const publicId = result.public_id;

//         const updatedProduct = await this.ProductSchema.findByIdAndUpdate(
//             Id,
//             { ...updateProductDto, image: image, publicId: publicId },
//             { new: true }
//         );

//         return updatedProduct;
//     } catch (error) {
//         console.error("Error updating product image:", error);
//         throw error;
//     }
// }
