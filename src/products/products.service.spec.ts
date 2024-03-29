import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './products.service';
import { ProductsController } from '../products/products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './entity/product.entity';
import { JwtService } from '@nestjs/jwt'

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductService, JwtService],
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/nest_basic'),
        MongooseModule.forFeature([{ name: 'product', schema: ProductSchema }])
      ]
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service.create).toBeDefined();
    expect(service.getAll).toBeDefined();
    expect(service.getProduct).toBeDefined();
    expect(service.updateProduct).toBeDefined();
    expect(service.updateProductImage).toBeDefined();
    expect(service.deleteProduct).toBeDefined();
  });
});
