import { Body, UseInterceptors, UploadedFiles, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { AuthMiddleware } from '../auth/auth.middleware';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private productService: ProductService,
    ) { }

    @UseGuards(AuthMiddleware)
    @ApiOperation({ summary: 'Find all product details' })
    @Get()
    async getproducts(@Res() response ) {
        return await this.productService.getAll(response);
    }


    @UseGuards(AuthMiddleware)
    @Get('/:id')
    async getproduct(@Res() response, @Param('id') Id: string) {
        return await this.productService.getProduct(Id, response);
    }


    @UseGuards(AuthMiddleware)
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
    async create(@Req() req, @Res() response, @Body() createProductDto: CreateProductDto, @UploadedFiles() images: Array<Express.Multer.File>) {
        const id = req.user.id
        const fileBuffers = images.map(image => image.buffer);
        return await this.productService.create(createProductDto, fileBuffers, id, response);
    }


    @UseGuards(AuthMiddleware)
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
        if (image) {
            const fileBuffers = image.map(image => image.buffer);
            return await this.productService.updateProductImage(Id, fileBuffers, updateProductDto, response);
        } else {
            return await this.productService.updateProduct(Id, updateProductDto, response);
        }
    }


    @UseGuards(AuthMiddleware)
    @Delete('/:id')
    async deleteProduct(@Res() response, @Param('id') Id: string) {
        return await this.productService.deleteProduct(Id, response);
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

// @Controller('docs')
// export class docsController {

//     @Get()
//     @Redirect('http://localhost:3000/products', 200)
//     getDocs() {
//         return { url: 'http://localhost:3000/products' };
//     }
// }




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