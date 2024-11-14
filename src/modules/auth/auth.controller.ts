import { Controller, Get, UseGuards, Req, Res, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { FRONTEND_URL } from 'src/configs/env.config';
import { GoogleUserProps } from 'src/common/types/Props';
import { UserService } from 'src/modules/user/user.service';
import { resCookie } from 'src/common/utils/resCookie';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: Request) { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request & { user: GoogleUserProps }, @Res() res: Response) {
        try {
            const user = await this.authService.validateUserToJudgmentLoginOrRegister(req.user);

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
