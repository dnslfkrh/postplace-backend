import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'src/configs/env.config';
import { UserException, UserExceptionCode } from 'src/exception/user.exception';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(private readonly userRepository: UserRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log('TokenMiddleware 호출됨'); // 미들웨어 시작 로그

    const accessToken = req.cookies.accessToken;
    console.log('AccessToken:', accessToken); // 추가된 로그

    if (!accessToken) {
      console.log('AccessToken이 없습니다.');
      throw new UserException(UserExceptionCode.USER_UNAUTHORIZED);
    }

    try {
      console.log('AccessToken 검증 중...');
      const decodedToken = jwt.verify(accessToken, JWT_SECRET) as { userID: number; userEmail: string; };

      console.log('디코드된 토큰:', decodedToken);

      const user = await this.userRepository.findByIDAndEmail(decodedToken.userID, decodedToken.userEmail);
      if (!user) {
        console.log('사용자를 찾을 수 없습니다.');
        throw new UserException(UserExceptionCode.USER_NOT_FOUND);
      }

      req['user'] = user.id;
      console.log('사용자 ID:', req['user']);

      next();
    } catch (error) {
      console.error('미들웨어 오류:', error);
      throw new UserException(UserExceptionCode.USER_UNAUTHORIZED);
    }
  }
}
