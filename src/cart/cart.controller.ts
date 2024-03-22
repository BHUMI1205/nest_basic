import { Body, Controller, Post, Req, Res, UseGuards, HttpStatus } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { RoleAuthMiddleware } from 'src/auth/role.auth';
import { CreateCartProductDto } from './dto/add-cartProduct.dto';

@ApiBearerAuth()
@ApiTags('cart')
@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) { }

    @UseGuards(AuthMiddleware, RoleAuthMiddleware)
    @ApiOperation({ summary: 'Add product to Cart' })
    @Post()
    async add(@Req() req, @Res() res, @Body() createCartProductDto: CreateCartProductDto) {
        
        try {
            const newProduct = await this.cartService.add(createCartProductDto, req);
            
            return res.status(HttpStatus.CREATED).json({
                message: 'Product has been Added to cart successfully',
                newProduct,
            });
        } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: 400,
                message: 'Error: Product not added to Cart!',
                error: 'Bad Request'
            });
        }
    }
}
