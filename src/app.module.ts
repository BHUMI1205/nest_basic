import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ProductsController } from './products/products.controller';
import { UsersModule } from './users/users.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { LoggerMiddleware } from './common/logger.middleware';
import { JwtModule } from '@nestjs/jwt';
import { CategoryModule } from './category/category.module';
import { CategoryController } from './category/category.controller';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [ProductsModule, UsersModule, MongooseModule.forRoot('mongodb://localhost:27017/nest_basic'),
    JwtModule.register({
      secret: 'logindata',
      signOptions: { expiresIn: '1h' },
    }),
    CategoryModule,
    GatewayModule
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware,LoggerMiddleware)
      .forRoutes(ProductsController,CategoryController);
  }
}