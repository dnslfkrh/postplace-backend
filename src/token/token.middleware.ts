import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'src/configs/env.config';
import { UserException, UserExceptionCode } from 'src/exception/user.exception';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(private readonly userRepository: UserRepository) { }
  async use(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UserException(UserExceptionCode.USER_UNAUTHORIZED);
    }

    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      throw new UserException(UserExceptionCode.USER_UNAUTHORIZED);
    }
    try {
      const decodedToken = jwt.verify(accessToken, JWT_SECRET) as { userID: number; userEmail: string; }

      const user = await this.userRepository.findByIDAndEmail(decodedToken.userID, decodedToken.userEmail);
      if (!user) {
        throw new UserException(UserExceptionCode.USER_NOT_FOUND);
      }

      req['user'] = user;

      next();
    } catch (error) {
      console.error(error);
      throw new UserException(UserExceptionCode.USER_UNAUTHORIZED);
    }
  }
}
