import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from '../users/users.controller';
import { Userschema } from './entity/users.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([{ name: 'user', schema: Userschema }]),
      JwtModule.register({
        secret: 'logindata', 
        signOptions: { expiresIn: '1h' }, 
      })
  ]
})

export class UsersModule { }