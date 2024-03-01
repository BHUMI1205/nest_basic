import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ProductsController } from './products/products.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [ProductsModule, UsersModule, MongooseModule.forRoot('mongodb://localhost:27017/nest_basic'), AuthModule,
    JwtModule.register({
      secret: 'logindata',
      signOptions: { expiresIn: '1h' },
    }),]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(ProductsController);
  }
}