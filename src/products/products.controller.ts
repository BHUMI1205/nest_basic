import { Body, UseInterceptors, UploadedFiles, Logger, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { AuthMiddleware } from '../auth/auth.middleware';
import { RoleAuthMiddleware } from '../auth/role.auth';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { request } from 'http';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private productService: ProductService,
    ) { }

    @UseGuards(AuthMiddleware, RoleAuthMiddleware)
    @ApiOperation({ summary: 'Find all product details' })
    @Get()
    async getproducts(@Res() response, @Req() request) {
        try {
            const productData = await this.productService.getAll();
            Logger.log('All Products data found successfully')
            return response.status(HttpStatus.OK).json({
                message: 'All Products data found successfully', productData,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @UseGuards(AuthMiddleware, RoleAuthMiddleware)
    @Get('/:id')
    async getproduct(@Res() response, @Param('id') Id: string) {
        try {
            const existingproduct = await
                this.productService.getProduct(Id);
            return response.status(HttpStatus.OK).json({
                message: 'Product found successfully', existingproduct,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }


    // @Post()
    // @UseInterceptors(
    //     FileInterceptor('image', {
    //         storage: diskStorage({
    //             destination: 'public/images',
    //             filename: (req, file, cb) => {
    //                 cb(null, file.originalname);
    //             },
    //         }),
    //     }),
    // )

    // async createProduct(@Res() response, @Body() createProductDto: CreateProductDto, @UploadedFile() image) {
    //     try {
    //         createProductDto.image = image.path

    //         const newProduct = await this.productService.create(createProductDto);
    //         return response.status(HttpStatus.CREATED).json({
    //             message: 'Product has been created successfully',
    //             newProduct,
    //         });
    //     } catch (err) {
    //         return response.status(HttpStatus.BAD_REQUEST).json({
    //             statusCode: 400,
    //             message: 'Error: Product not created!',
    //             error: 'Bad Request'
    //         });
    //     }
    // }


    @UseGuards(AuthMiddleware, RoleAuthMiddleware)
    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                detail: { type: 'string' },
                categoryId: { type: 'string' },
                price: { type: 'integer' },
                image: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })

    @UseInterceptors(FilesInterceptor('image'))

    async create(@Req() req, @Res() res, @Body() createProductDto: CreateProductDto, @UploadedFiles() images: Array<Express.Multer.File>) {
        try {
            const fileBuffers = images.map(image => image.buffer);
            const newProduct = await this.productService.create(createProductDto, fileBuffers);
            Logger.log('Product have been uploaded Successfully')

            return res.status(HttpStatus.CREATED).json({
                message: 'Product have been uploaded Successfully',
                newProduct
            });
        } catch (err) {

            return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: 400,
                message: 'Error: Product not uploaded!',
                error: err.message
            });
        }
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
                price: { type: 'integer' },
                image: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })

    @UseInterceptors(FilesInterceptor('image'))
    async updateProduct(@Res() response, @Param('id') Id: string,
        @Body() updateProductDto: UpdateProductDto, @UploadedFiles() image: Array<Express.Multer.File>) {
        try {

            if (image) {
                const fileBuffers = image.map(image => image.buffer);
                const existingProduct = await this.productService.updateProductImage(Id, fileBuffers, updateProductDto);
                return response.status(HttpStatus.OK).json({
                    message: 'Product has been successfully updated',
                    existingProduct
                });
            } else {
                const existingProduct = await this.productService.updateProduct(Id, updateProductDto);

                return response.status(HttpStatus.OK).json({
                    message: 'Product has been successfully updated',
                    existingProduct,
                });
            }

        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @UseGuards(AuthMiddleware, RoleAuthMiddleware)
    @Delete('/:id')
    async deleteProduct(@Res() response, @Param('id') Id: string) {
        try {
            const deletedProduct = await this.productService.deleteProduct(Id);
            return response.status(HttpStatus.OK).json({
                message: 'Product deleted successfully',
                deletedProduct,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    // @Get()
    // async findAll() {
    //     try {
    //         await this.productService.getAll()
    //         return this.productService
    //     } catch (error) {
    //         throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    //     }
    // }

}


// @Controller('docs')
// export class docsController {

//     @Get()
//     @Redirect('http://localhost:3000/products', 200)
//     getDocs() {
//         return { url: 'http://localhost:3000/products' };
//     }
// }