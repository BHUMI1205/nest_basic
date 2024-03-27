import { Controller, HttpStatus, Query, Body, Res, Param, Get, Post, Put, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';;
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
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
    @ApiOperation({ summary: 'Show All Category Details' })
    @Get()
    async getproducts(@Res() response, @Query() filterCategoryDto: filterCategoryDto) {
        return await this.categoryService.getAll(response, filterCategoryDto);
    }


    @UseGuards(AuthMiddleware, RoleAuthMiddleware)
    @ApiOperation({ summary: 'Show Category Details By Id' })
    @Get('/:id')
    async getCategory(@Res() response, @Param('id') Id: string) {
        return await this.categoryService.getCategory(Id, response);
    }


    @UseGuards(AuthMiddleware, RoleAuthMiddleware)
    @Post()
    @ApiOperation({ summary: 'Add new Category' })
    @ApiBody({ type: CreateCategoryDto })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image'))
    async create(@Res() response, @Body() createProductDto: CreateCategoryDto, @UploadedFile() imageData: Express.Multer.File) {
        return await this.categoryService.create(createProductDto, imageData.buffer, response);
    }


    @UseGuards(AuthMiddleware, RoleAuthMiddleware)
    @Put('/:id')
    @ApiOperation({ summary: 'Update Category' })
    @ApiBody({ type: UpdateCategoryDto, required: false })
    @ApiConsumes('multipart/form-data')
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
    @ApiOperation({ summary: 'Delete Category' })
    @Delete('/:id')
    async deleteCategory(@Res() response, @Param('id') Id: string) {
        return await this.categoryService.deleteCategory(Id, response);
    }

}