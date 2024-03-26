import { Module, NestModule, MiddlewareConsumer, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ProductsController } from './products/products.controller';
import { UsersModule } from './users/users.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { JwtModule } from '@nestjs/jwt';
import { CategoryModule } from './category/category.module';
import { CategoryController } from './category/category.controller';
import { GatewayModule } from './gateway/gateway.module';
import { CartModule } from './cart/cart.module';
import { RoleAuthMiddleware } from './auth/role.auth';
import { CartController } from './cart/cart.controller';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/nest_basic'),
  JwtModule.register({
    secret: 'logindata',
    signOptions: { expiresIn: '1h' },
  }),
    UsersModule,
    CategoryModule,
    ProductsModule,
    CartModule,
    GatewayModule,
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware, RoleAuthMiddleware).forRoutes(CartController, CartController, ProductsController)
  }
}
