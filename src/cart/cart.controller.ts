import { Controller, Get, Delete, Req, Res, UseGuards, Param, HttpStatus } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthMiddleware } from '../auth/auth.middleware';
import { response } from 'express';


@ApiBearerAuth()
@ApiTags('cart')
@Controller('cart')

export class CartController {
    constructor(private cartService: CartService) { }

    @UseGuards(AuthMiddleware)
    @Get('/:id')
    async add(@Req() req, @Res() response, @Param('id') productId: string) {
        const id = req.user.id
        return await this.cartService.add(productId, id, response);
    }


    @UseGuards(AuthMiddleware)
    @Delete('/:id')
    async deleteProduct(@Res() response, @Param('id') Id: string) {
        return await this.cartService.deleteProduct(Id, response);
    }

    @UseGuards(AuthMiddleware)
    @Get()
    async showCartProduct(@Res() response){
        return await this.cartService.showCartProduct(response)
    }
}
