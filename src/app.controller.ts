import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SocketGateway } from './socket/socket.gateway'; 

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
