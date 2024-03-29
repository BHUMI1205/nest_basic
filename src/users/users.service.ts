import { Model } from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { user } from './interfaces/users.interfaces';
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserService {

    constructor(@InjectModel('user') private UserModel: Model<user>, private jwtService: JwtService) { }

    async register(createUserDto: CreateUserDto): Promise<user> {
        if (createUserDto.password !== createUserDto.cpassword) {
            throw new Error("Passwords do not match");
        }

        const existingUser = await this.UserModel.findOne({ email: createUserDto.email });
        if (existingUser) {
            throw new Error("Email is already registered");
        }

        let salt = 10;
        const hash = await bcrypt.hash(createUserDto.password, salt);

        const newUser = new this.UserModel({
            name: createUserDto.name,
            email: createUserDto.email,
            password: hash
        });
        return newUser.save();
    }

    async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {

        const existingUser = await this.UserModel.findOne({ email: loginUserDto.email });

        if (existingUser) {
            const isMatch = await bcrypt.compare(loginUserDto.password, existingUser.password);
            if (isMatch) {
                const payload = { email: existingUser.email, id: existingUser._id, role: existingUser.role };

                let token = this.jwtService.sign(payload);

                return { token }
                // const user = new this.UserModel();
                // return user.save();
            } else {
                throw new Error("Password do not match");
            }
        } else {
            throw new Error("Email do not match");
        }
    }
}

