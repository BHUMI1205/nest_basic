import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module'; 

@Module({
  imports: [
    JwtModule.register({
      secret: 'logindata', 
      signOptions: { expiresIn: '1h' }, 
    }),
    UsersModule
  ],
})
export class AuthModule {}