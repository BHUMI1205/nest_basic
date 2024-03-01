import { Model } from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { product } from './interfaces/products.interface';
import { CreateProductDto } from './dto/create-products.dto'
import { UpdateProductDto } from './dto/update-products.dto'
import { ProductSchema } from '../schema/product.schema'

@Injectable()
export class ProductService {
    constructor(@InjectModel('product') private ProductSchema: Model<product>) { }
    private readonly products: product[] = [];

    async create(createProductDto: CreateProductDto): Promise<product> {
        const newProduct = await new this.ProductSchema(createProductDto);
        return newProduct;
    }

    async getAll(): Promise<product[]> {
        const productData = await this.ProductSchema.find();
        if (!productData || productData.length == 0) {
            throw new NotFoundException('Product data not found!');
        }
        return productData;
    }

    async getProduct(Id: string): Promise<product> {
        const existingProduct = await this.ProductSchema.findById(Id).exec();
        if (!existingProduct) {
            throw new NotFoundException(`Product #${Id} not found`);
        }
        return existingProduct;
    }

    async updateProduct(Id: string, updateProductDto: UpdateProductDto): Promise<product> {
        const existingProduct = await this.ProductSchema.findByIdAndUpdate(Id, updateProductDto, { new: true });
        if (!existingProduct) {
            throw new NotFoundException(`Product #${Id} not found`);
        }
        return existingProduct;
    }

    async deleteProduct(Id: string): Promise<product> {
        const deletedProduct = await this.ProductSchema.findByIdAndDelete(Id);
        if (!deletedProduct) {
            throw new NotFoundException(`Product #${Id} not found`);
        }
        return deletedProduct;
    }
}