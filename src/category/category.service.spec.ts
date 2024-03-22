import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategorySchema } from './entity/category.entity';
import { MongooseModule } from "@nestjs/mongoose";
import { JwtService } from '@nestjs/jwt'

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [CategoryService, JwtService],
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/nest_basic'),
        MongooseModule.forFeature([{ name: 'category', schema: CategorySchema }]),
      ]
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
