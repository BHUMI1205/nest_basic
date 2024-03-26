import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name)

  use(req: Request, res: Response, next: NextFunction) {

    let message = `${res.statusCode} , ${req.method} , ${req.originalUrl}`
    
    if (res.statusCode >= 400) {
      this.logger.error(message)
    } else {
      this.logger.log(message)
    }
    next();
  }
} 