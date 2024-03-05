import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';
import { ProductSchema } from './schema/product.schema';
import { JwtService } from '@nestjs/jwt'

@Module({
    controllers: [ProductsController],
    providers: [ProductService, JwtService],
    imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/nest_basic'),
        MongooseModule.forFeature([{ name: 'product', schema: ProductSchema }]),
    ]
})
export class ProductsModule { }
