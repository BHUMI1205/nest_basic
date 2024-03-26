import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class RoleAuthMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) { }

    async use(req: Request, res: Response, next: NextFunction) {

        try {
            let role = req.user.role;
            if (role == "admin") {
                next();
            } else {
                return "Authorized error"
            }

        } catch (error) {
            if (error instanceof TokenExpiredError) {
                return res.status(401).json({ message: 'Token has expired' });
            } else {
                return res.status(401).json({ message: 'Invalid token' });
            }
        }
    }
}
