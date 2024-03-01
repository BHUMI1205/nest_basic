import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService} from '@nestjs/jwt';
import { user } from '../users/interfaces/users.interfaces';
import { TokenExpiredError } from 'jsonwebtoken'; 

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) { }

  async use(req: Request, res: Response, next: NextFunction) {

    try {
      let token = req.headers['authorization'];

      if (!token) {
        return res.status(401).json({ message: 'Authorization token is missing' });
      }
      else {
        token = token.slice(7)
        
        const decoded = await this.jwtService.verifyAsync(token);
        req.user = decoded as user;
        next();
      }
    } catch (error) { 
      if (error instanceof TokenExpiredError) {
        return res.status(401).json({ message: 'Token has expired' });
      } else {
        return res.status(401).json({ message: 'Invalid token' });
      }    }
  }
}
