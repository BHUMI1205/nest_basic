import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Userschema } from './entity/users.entity';
import { JwtModule } from '@nestjs/jwt';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UserService],
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/nest_basic'),
        MongooseModule.forFeature([{ name: 'user', schema: Userschema }]),
        JwtModule.register({
          secret: 'logindata',
          signOptions: { expiresIn: '1h' },
        })
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller.login).toBeDefined();
    expect(controller.register).toBeDefined();
  });
});
