import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from '../users/users.controller';
import { UserSchema } from './entity/users.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
      JwtModule.register({
        secret: 'logindata', 
        signOptions: { expiresIn: '1h' }, 
      })
  ]
})

export class UsersModule { }