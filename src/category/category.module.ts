import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategorySchema } from './schema/category.schema';
import { MongooseModule } from "@nestjs/mongoose";
import { JwtService } from '@nestjs/jwt'

@Module({
  controllers: [CategoryController],
  providers: [CategoryService,JwtService],
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest_basic'),
    MongooseModule.forFeature([{ name: 'category', schema: CategorySchema }]),
  ]
})
export class CategoryModule { }