import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from '../products/products.controller';
import { ProductService } from '../products/products.service';
import { ProductSchema } from '../schema/product.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
    controllers: [ProductsController],
    providers: [ProductService],
    imports: [
        MongooseModule.forFeature([{ name: 'product', schema: ProductSchema }]),
        JwtModule.register({
            secret: 'logindata',
            signOptions: { expiresIn: '1h' },
        })
    ]
})
 
export class ProductsModule { }