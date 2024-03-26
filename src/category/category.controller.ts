import { Controller, HttpStatus, Query, Body, Res, Param, Get, Post, Put, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';;
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AuthMiddleware } from '../auth/auth.middleware';
import { RoleAuthMiddleware } from '../auth/role.auth';
import { FileInterceptor } from '@nestjs/platform-express';
import { filterCategoryDto } from './dto/create-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiBearerAuth()
@ApiTags('category')
@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) { }

    @UseGuards(AuthMiddleware, RoleAuthMiddleware)
    @Get()
    async getproducts(@Res() response, @Query() filterCategoryDto: filterCategoryDto) {
        return await this.categoryService.getAll(response, filterCategoryDto);
    }


    @UseGuards(AuthMiddleware, RoleAuthMiddleware)
    @Get('/:id')
    async getCategory(@Res() response, @Param('id') Id: string) {
        return await this.categoryService.getCategory(Id, response);
    }


    @UseGuards(AuthMiddleware, RoleAuthMiddleware)
    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                detail: { type: 'string' },
                image: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('image'))
    async create(@Res() response, @Body() createProductDto: CreateCategoryDto, @UploadedFile() imageData: Express.Multer.File) {
        return await this.categoryService.create(createProductDto, imageData.buffer, response);
    }


    @UseGuards(AuthMiddleware, RoleAuthMiddleware)
    @Put('/:id')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                detail: { type: 'string' },
                image: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('image'))
    async updateProduct(@Res() response, @Param('id') Id: string,
        @Body() updateCategoryDto: UpdateCategoryDto, @UploadedFile() image: Express.Multer.File) {
        if (image) {
            return await this.categoryService.updateCategoryImage(Id, image.buffer, updateCategoryDto, response);
        } else {
            return await this.categoryService.updateCategory(Id, updateCategoryDto, response);

        }
    }


    @UseGuards(AuthMiddleware, RoleAuthMiddleware)
    @Delete('/:id')
    async deleteCategory(@Res() response, @Param('id') Id: string) {
        return await this.categoryService.deleteCategory(Id, response);
    }

}