import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { category } from './interfaces/category.interface';
import * as cloudinary from 'cloudinary';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategorySchema } from './schema/category.schema';



@Injectable()
export class CategoryService {

    constructor(@InjectModel('category') private CategorySchema: Model<category>) {
        cloudinary.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    async getAll(): Promise<category[]> {
        const CtegoryData = await this.CategorySchema.find();
        if (!CtegoryData || CtegoryData.length == 0) {
            throw new NotFoundException('Category data not found!');
        }
        return CtegoryData;
    }

    async getCategory(Id: string): Promise<category> {
        const existingProduct = await this.CategorySchema.findById(Id).exec();
        if (!existingProduct) {
            throw new NotFoundException(`Product #${Id} not found`);
        }
        return existingProduct;
    }

    async create(createCategoryDto: CreateCategoryDto, imageData: Buffer): Promise<category> {
        try {

            const result = await this.uploadImageToCloudinary(imageData);
            const imageUrl = result.url;
            const publicId = result.public_id;

            const newCategory = new this.CategorySchema({
                ...createCategoryDto,
                image: imageUrl,
                publicId: publicId
            });

            return newCategory.save();
        } catch (error) {

            throw new Error("Error creating Ctegory");
        }
    }

    private uploadImageToCloudinary(fileBuffer: Buffer): Promise<cloudinary.UploadApiResponse> {
        try {
            return new Promise((resolve, reject) => {
                const publicId = Date.now() + Math.floor(Math.random() * 1000000).toString();
                cloudinary.v2.uploader.upload_stream(
                    { public_id: publicId, resource_type: 'auto', folder: 'nest_basic/categoryImages', },
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

    
    async updateCategoryImage(Id: string, imageData: Buffer, updateCategoryDto: UpdateCategoryDto): Promise<category> {
        try {
            const deletedCategory = await this.CategorySchema.findById(Id);

            if (!deletedCategory) {
                throw new NotFoundException(`Category with ID ${Id} not found`);
            }

            await cloudinary.v2.uploader.destroy(deletedCategory.publicId);

            const result = await this.uploadImageToCloudinary(imageData);

            const image = result.url;
            const publicId = result.public_id;

            const updatedCategory = await this.CategorySchema.findByIdAndUpdate(
                Id,
                { ...updateCategoryDto, image: image, publicId: publicId },
                { new: true }
            );

            return updatedCategory;
        } catch (error) {
            console.error("Error updating category image:", error);
            throw error;
        }
    }

    async updateCategory(Id: string, updateCategoryDto: UpdateCategoryDto): Promise<category> {
        try {
            const existingCategory = await this.CategorySchema.findByIdAndUpdate(Id, updateCategoryDto, { new: true });

            if (!existingCategory) {
                throw new NotFoundException(`Category #${Id} not found`);
            }
            return existingCategory;
        }

        catch (err) {
            console.log(err);
            throw err;
        }
    }


    async deleteCategory(Id: string): Promise<category> {

        const deletedCategory = await this.CategorySchema.findByIdAndDelete(Id);

        let image = deletedCategory.publicId

        cloudinary.v2.uploader.destroy(image);

        if (!deletedCategory) {
            throw new NotFoundException(`Category #${Id} not found`);
        }
        return deletedCategory;
    }
}
