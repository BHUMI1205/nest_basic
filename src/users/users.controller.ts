import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private userService: UserService) { }

    @Post('/register')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                cpassword: { type: 'string' }
            },
        },
    })
    async register(@Res() res, @Body() createUserDto: CreateUserDto) {
        try {
            const user = await this.userService.register(createUserDto);

            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                message: 'User created successfully',
                user
            });
        }
        catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: err.message,
                error: 'Bad Request'
            });
        }
    }

    @Post('login')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string' },
                password: { type: 'string' },
            },
        },
    })
    async login(@Res() res, @Body() loginUserDto: LoginUserDto) {
        try {
            const token = await this.userService.login(loginUserDto);

            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                message: 'Authentication done successfully',
                token
            });
        }
        catch (err) {
            console.log(err);
            return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: err.message,
                error: 'Bad Request'
            });
        }
    }
}