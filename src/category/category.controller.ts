import { Controller, HttpStatus, Body, Req, Res, Param, Get, Post,Put, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';;
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AuthMiddleware } from '../auth/auth.middleware';
import { RoleAuthMiddleware } from '../auth/role.auth';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiBearerAuth()
@ApiTags('category')
@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) { }

    @UseGuards(AuthMiddleware,RoleAuthMiddleware)
    @Get()
    async getproducts(@Res() response) {
        try {
            const productData = await this.categoryService.getAll();
            
            return response.status(HttpStatus.OK).json({
                message: 'All Category data found successfully', productData,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @UseGuards(AuthMiddleware,RoleAuthMiddleware)
    @Get('/:id')
    async getCategory(@Res() response, @Param('id') Id: string) {
        try {
            const categoryData = await this.categoryService.getCategory(Id);
            return response.status(HttpStatus.OK).json({
                message: 'Category data found successfully', categoryData,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @UseGuards(AuthMiddleware,RoleAuthMiddleware)
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

    async create(@Req() req, @Res() res, @Body() createProductDto: CreateCategoryDto, @UploadedFile() imageData: Express.Multer.File) {
        try {
            const newCategory = await this.categoryService.create(createProductDto, imageData.buffer);

            return res.status(HttpStatus.CREATED).json({
                message: 'Category image(s) have been uploaded to Cloudinary',
                newCategory
            });
        } catch (err) {

            return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: 400,
                message: 'Error: Product image(s) not uploaded!',
                error: err.message
            });
        }
    }


    @UseGuards(AuthMiddleware,RoleAuthMiddleware)
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
        @Body() updateCategoryDto: UpdateCategoryDto, @UploadedFile() image:Express.Multer.File) {
        try {

            if (image) {
                const existingProduct = await this.categoryService.updateCategoryImage(Id, image.buffer, updateCategoryDto);
                return response.status(HttpStatus.OK).json({
                    message: 'Product has been successfully updated',
                    existingProduct
                });
            } else {
                const existingProduct = await this.categoryService.updateCategory(Id, updateCategoryDto);

                return response.status(HttpStatus.OK).json({
                    message: 'Product has been successfully updated',
                    existingProduct,
                });
            }

        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @UseGuards(AuthMiddleware,RoleAuthMiddleware)
    @Delete('/:id')
    async deleteCategory(@Res() response, @Param('id') Id: string) {
        try {
            const deletedCategory = await this.categoryService.deleteCategory(Id);
            return response.status(HttpStatus.OK).json({
                message: 'Category deleted successfully',
                deletedCategory,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

}
