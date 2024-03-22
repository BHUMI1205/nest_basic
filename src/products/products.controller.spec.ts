import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './entity/product.entity';
import { JwtService } from '@nestjs/jwt'

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductService, JwtService],
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/nest_basic'),
        MongooseModule.forFeature([{ name: 'product', schema: ProductSchema }]),
      ]
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller.create).toBeDefined();
    expect(controller.getproduct).toBeDefined();
    expect(controller.getproducts).toBeDefined();
    expect(controller.deleteProduct).toBeDefined();
    expect(controller.updateProduct).toBeDefined();
  });
});


