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
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    console.log(accessToken, refreshToken);

    if (!accessToken && !refreshToken) {
      console.log("로그인을 다시 해라");
      throw new UserException(UserExceptionCode.USER_UNAUTHORIZED);
    }

    if (!accessToken && refreshToken) {
      // 리프레시 토큰으로 새로운 에세스 토큰 발급
    }

    try {
      const decodedToken = jwt.verify(accessToken, JWT_SECRET) as { userID: number; userEmail: string; };

      const user = await this.userRepository.findByIDAndEmail(decodedToken.userID, decodedToken.userEmail);
      if (!user) {
        throw new UserException(UserExceptionCode.USER_NOT_FOUND);
      }

      req['user'] = user.id;
      next();
    } catch (error) {
      console.error('토큰 미들웨어 오류:', error);
      throw new UserException(UserExceptionCode.USER_UNAUTHORIZED);
    }
  }
}
