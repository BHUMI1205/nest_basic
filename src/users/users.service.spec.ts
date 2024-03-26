import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { UsersController } from '../users/users.controller';
import { Userschema } from './entity/users.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

describe('UserService', () => {
  let service: UserService;

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
        })]
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service.register).toBeDefined();
    expect(service.login).toBeDefined();
  });
});
