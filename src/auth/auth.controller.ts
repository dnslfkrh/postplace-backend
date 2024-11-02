import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { FRONTEND_URL } from 'src/configs/env.config';
import { GoogleUser } from 'src/types/Props';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: Request) { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request & { user: GoogleUser }, @Res() res: Response) {
        try {
            const user = await this.authService.validateUserToJudgmentLoginOrRegister(req.user);
            
            const { accessToken, refreshToken } = await this.authService.generateTokens(user);

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: false, /* process.env.NODE_ENV === 'production' */
                sameSite: 'lax'
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false, /* process.env.NODE_ENV === 'production' */
                sameSite: 'lax'
            });

            res.redirect(`${FRONTEND_URL}`);
        } catch (error) {
            console.error('구글 로그인 에러:', error);
            res.redirect(`${FRONTEND_URL}/login`);
        }
    }
}