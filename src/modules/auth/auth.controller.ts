import { Controller, Get, UseGuards, Req, Res, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { FRONTEND_URL } from 'src/configs/env.config';
import { GoogleUserProps } from 'src/common/types/Props';
import { resCookie } from 'src/common/utils/resCookie';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request & { user: GoogleUserProps }, @Res() res: Response) {
        try {
            const user = await this.userService.validateUserToJudgmentLoginOrRegister(req.user);

            const { accessToken, refreshToken } = await this.authService.generateTokens(user);

            resCookie(res, 'accessToken', accessToken);
            resCookie(res, 'refreshToken', refreshToken);

            res.redirect(`${FRONTEND_URL}`);
        } catch (error) {
            console.error('구글 로그인 에러:', error);
            res.redirect(`${FRONTEND_URL}/login`);
        }
    };
}
