import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { category } from './interfaces/category.interface';
import * as cloudinary from 'cloudinary';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';


@Injectable()
export class CategoryService {

    constructor(@InjectModel('category') private CategoryModel: Model<category>) {
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


    async getAll(res, filterCategoryDto) {
        let data: any;

        if (filterCategoryDto.search) {
            const searchRegex = await new RegExp(filterCategoryDto.search, 'i'); // 'i' for case-insensitive search

            data = await this.CategoryModel.find({ $or: [{ name: { $regex: searchRegex } }, { detail: { $regex: searchRegex } }] })
            // }
            // else if (!data || data.length == 0) {
            // throw new NotFoundException('Category data not found!');
            if (data != "") {
                return res.status(HttpStatus.OK).json({
                    status: HttpStatus.OK,
                    message: 'All Category data found successfully',
                    data: data
                });
            } else {
                return res.status(HttpStatus.OK).json({
                    status: HttpStatus.OK,
                    message: 'Searched Category data not found',
                });
            }
        } else {
            data = await this.CategoryModel.find({});
            return res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'All Category data found successfully',
                data: data
            });
        }
    }

    async getCategory(Id: string, res) {
        const data = await this.CategoryModel.findById(Id).exec();
        if (!data) {
            throw new NotFoundException(`Product #${Id} not found`);
        }
        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'Category data found successfully',
            data: data,
        });
    }

    async create(createCategoryDto: CreateCategoryDto, imageData: Buffer, res) {
        const result = await this.uploadImageToCloudinary(imageData);
        const imageUrl = result.url;
        const publicId = result.public_id;

        const data = new this.CategoryModel({
            ...createCategoryDto,
            image: imageUrl,
            publicId: publicId
        });

        return res.status(HttpStatus.CREATED).json({
            status: HttpStatus.CREATED,
            message: 'Category Added',
            data: data.save(),
        });
    }

    async updateCategoryImage(Id: string, imageData: Buffer, updateCategoryDto: UpdateCategoryDto, res) {
        const deletedCategory = await this.CategoryModel.findById(Id);

        if (!deletedCategory) {
            throw new NotFoundException(`Category with ID ${Id} not found`);
        }

        await cloudinary.v2.uploader.destroy(deletedCategory.publicId);

        const result = await this.uploadImageToCloudinary(imageData);

        const image = result.url;
        const publicId = result.public_id;

        const data = await this.CategoryModel.findByIdAndUpdate(
            Id,
            { ...updateCategoryDto, image: image, publicId: publicId },
            { new: true }
        );

        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'Product has been updated successfully',
            data: data,
        });
    }

    async updateCategory(Id: string, updateCategoryDto: UpdateCategoryDto, res) {
        const data = await this.CategoryModel.findByIdAndUpdate(Id, updateCategoryDto, { new: true });

        if (!data) {
            throw new NotFoundException(`Category #${Id} not found`);
        }
        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'Product has been updated successfully',
            data: data,
        });
    }

    async deleteCategory(Id: string, res) {

        const data = await this.CategoryModel.findByIdAndDelete(Id);

        let image = data.publicId

        cloudinary.v2.uploader.destroy(image);

        if (!data) {
            throw new NotFoundException(`Category #${Id} not found`);
        }
        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'Category deleted successfully',
            data: data,
        });
    }
}
