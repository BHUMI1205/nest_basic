import { Body, UseInterceptors, UploadedFile, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { AuthMiddleware } from '../auth/auth.middleware';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { product } from './interfaces/products.interface'

@ApiTags('Products') 
@Controller('products')
    export class ProductsController {
        constructor(private productService: ProductService) { }

        @UseGuards(AuthMiddleware)

        @Get()
        async getproducts(@Res() response) {
            try {
                const productData = await this.productService.getAll();
                return response.status(HttpStatus.OK).json({
                    message: 'All Products data found successfully', productData,
                });
            } catch (err) {
                return response.status(err.status).json(err.response);
            }
        }


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


        @Post()
        @UseInterceptors(
            FileInterceptor('image', {
                storage: diskStorage({
                    destination: 'public/images',
                    filename: (req, file, cb) => {
                        cb(null, file.originalname);
                    },
                }),
            }),
        )

        async createProduct(@Res() response, @Body() createProductDto: CreateProductDto, @UploadedFile() image){
            try {
                createProductDto.image = image.path
                
                const newProduct = await this.productService.create(createProductDto);
                return response.status(HttpStatus.CREATED).json({
                    message: 'Product has been created successfully',
                    newProduct,
                });
            } catch (err) {
                return response.status(HttpStatus.BAD_REQUEST).json({
                    statusCode: 400,
                    message: 'Error: Product not created!',
                    error: 'Bad Request'
                });
            }
        }

        @Put('/:id')
        async updateProduct(@Res() response, @Param('id') Id: string,
            @Body() updateProductDto: UpdateProductDto) {
            try {
                const existingProduct = await this.productService.updateProduct(Id, updateProductDto);
                return response.status(HttpStatus.OK).json({
                    message: 'Product has been successfully updated',
                    existingProduct,
                });
            } catch (err) {
                return response.status(err.status).json(err.response);
            }
        }

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
        // findAll(): string {
        //   return 'This action returns all product';
        // }

        // @Get()
        // findAll(@Req() request: Request): string {
        //     return 'This action returns all product';
        // }

        // @Get()
        // async findAll() {
        //     try {
        //         await this.productService.getAll()
        //         return this.productService
        //     } catch (error) {
        //         throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        //     }
        // }

        // @Post()
        // @HttpCode(200)
        // create() {
        //     return 'This action adds a new product';
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