import { Model } from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { product } from './interfaces/products.interface';
import { CreateProductDto } from './dto/create-products.dto'
import { UpdateProductDto } from './dto/update-products.dto'
import * as cloudinary from 'cloudinary';
import * as mongoose from 'mongoose';

@Injectable()
export class ProductService {
    constructor(@InjectModel('product') private ProductModel: Model<product>) {
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

    async create(createProductDto: CreateProductDto, fileBuffers: Buffer[], id, res) {
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
        const data = new this.ProductModel({
            ...createProductDto,
            image: imageUrl,
            publicId: publicId,
            userId: id
        })
        data.save()

        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'Product has been added successfully',
            data: data
        });
    }

    async getAll(res) {
        const data = await this.ProductModel.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'categoryData'
                }
            },
            {
                $unwind: "$categoryData",
            },
        ]).exec();

        if (!data || data.length === 0) {
            throw new NotFoundException('No products found!');
        }

        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'All Products data found successfully',
            data: data
        });
    }

    async getProduct(Id: string, res) {
        const data = await this.ProductModel.aggregate([
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

        if (!data || data.length === 0) {
            throw new NotFoundException(`Product #${Id} not found`);
        }
        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'Product found successfully',
            data: data[0],
        });
    }

    async updateProductImage(Id: string, imageData: Buffer[], updateProductDto: UpdateProductDto, res) {
        const deletedProduct = await this.ProductModel.findById(Id);

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

        const data = await this.ProductModel.findByIdAndUpdate(
            Id,
            { ...updateProductDto, image: imageUrl, publicId: publicId },
            { new: true }
        );

        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'Product has been updated successfully',
            data: data.save(),
        });
    }

    async updateProduct(Id: string, updateProductDto: UpdateProductDto, res) {
        const data = await this.ProductModel.findByIdAndUpdate(Id, updateProductDto, { new: true });

        if (!data) {
            throw new NotFoundException(`Product #${Id} not found`);
        }
        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'Product has been updated successfully',
            data: data,
        });
    }

    async deleteProduct(Id: string, res) {
        const data = await this.ProductModel.findByIdAndDelete(Id);

        let image = data.publicId

        for (let i = 0; i < image.length; i++) {
            cloudinary.v2.uploader.destroy(image[i]);
        }

        if (!data) {
            throw new NotFoundException(`Product #${Id} not found`);
        }
        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'Product deleted successfully',
            data: data,
        });
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
