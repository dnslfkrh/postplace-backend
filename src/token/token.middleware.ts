import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthService } from 'src/auth/auth.service';
import { JWT_SECRET } from 'src/configs/env.config';
import { UserException, UserExceptionCode } from 'src/exception/user.exception';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    }

    try {
      let decodedToken;

      if (!accessToken && refreshToken) {
        const decodedRefreshToken = await this.authService.verifyRefreshToken(refreshToken);
        const user = await this.userRepository.findById(decodedRefreshToken.userID);

        if (!user) {
          throw new UserException(UserExceptionCode.USER_NOT_FOUND);
        }

        const newAccessToken = await this.authService.regenerateAccessToken(user);

        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax'
        });

        // decodedToken = jwt.verify(newAccessToken, JWT_SECRET) as { userID: number; userEmail: string };
      } else {
        decodedToken = jwt.verify(accessToken, JWT_SECRET) as { userID: number; userEmail: string };
      }

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
