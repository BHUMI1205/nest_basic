import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from "@nestjs/mongoose";
import { CartService } from './cart.service';
import { CartSchema } from './entity/cart.entity';
import { JwtService } from '@nestjs/jwt';
import { CartController } from './cart.controller';
import { ProductsModule } from '../products/products.module';
import { ProductSchema } from '../products/entity/product.entity';


describe('CartService', () => {
  let service: CartService;

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

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service.add).toBeDefined();
    expect(service.deleteProduct).toBeDefined();
  });
});
