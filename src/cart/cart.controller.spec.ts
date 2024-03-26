import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { CartService } from './cart.service';
import { CartSchema } from './entity/cart.entity';
import { JwtService } from '@nestjs/jwt';
import { ProductsModule } from '../products/products.module';
import { ProductSchema } from '../products/entity/product.entity';
describe('CartController', () => {
  let controller: CartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartService, JwtService],
      controllers: [CartController],
      imports: [ProductsModule,
        MongooseModule.forRoot('mongodb://localhost:27017/nest_basic'),
        MongooseModule.forFeature([
          { name: 'cart', schema: CartSchema },
          { name: 'product', schema: ProductSchema },
        ]),
      ]
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(controller.add).toBeDefined();
    expect(controller.deleteProduct).toBeDefined();
  });
});
