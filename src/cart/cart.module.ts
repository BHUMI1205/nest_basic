import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartSchema } from './entity/cart.entity';
import { MongooseModule } from "@nestjs/mongoose";
import { JwtService } from '@nestjs/jwt'
import { CartService } from './cart.service';
import { ProductsModule } from 'src/products/products.module';
import { ProductSchema } from 'src/products/entity/product.entity';

@Module({
  providers: [CartService, JwtService],
  controllers: [CartController],
  imports: [
    ProductsModule,
    MongooseModule.forRoot('mongodb://localhost:27017/nest_basic'),
    MongooseModule.forFeature([
      { name: 'cart', schema: CartSchema }, 
      { name: 'product', schema: ProductSchema }, 
    ]),
  ]
})
export class CartModule {

}