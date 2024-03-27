import { Controller, Get, Delete, Req, Res, UseGuards, Param, Post, HttpStatus } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthMiddleware } from '../auth/auth.middleware';
import { request } from 'http';
import { response } from 'express';

@ApiBearerAuth()
@ApiTags('cart')
@Controller('cart')

export class CartController {
    constructor(private cartService: CartService) { }

    @UseGuards(AuthMiddleware)
    @ApiOperation({ summary: 'Add Cart Item By Id' })
    @Post('/:id')
    async add(@Req() req, @Res() response, @Param('id') productId: string) {
        const id = req.user.id
        return await this.cartService.add(productId, id, response);
    }


    @UseGuards(AuthMiddleware)
    @ApiOperation({ summary: 'Delete Cart Item' })
    @Delete('/:id')
    async deleteProduct(@Res() response, @Param('id') Id: string) {
        return await this.cartService.deleteProduct(Id, response);
    }


    @UseGuards(AuthMiddleware)
    @ApiOperation({ summary: 'Show All Cart Detail' })
    @Get()
    async showCartProduct(@Res() response, @Req() request) {
        const id = request.user.id
        return await this.cartService.showCartProduct(id, response)
    }

    @UseGuards(AuthMiddleware)
    @ApiOperation({ summary: 'Checkout' })
    @Get('/checkout')
    async checkout(@Res() response, @Req() request) {
        const id = request.user.id
        return await this.cartService.checkout(response,id)
    }
}
