import { Controller, Get, UseGuards, Req, Res, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { FRONTEND_URL } from 'src/configs/env.config';
import { GoogleUser } from 'src/types/Props';
import { UserService } from 'src/user/user.service';
import { UserException, UserExceptionCode } from 'src/exception/user.exception';

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
    };

    @Post('refresh')
    async refresh(@Req() req: Request, @Res() res: Response) {
        const refreshToken = req.cookies?.refreshToken;

        try {
            const decodeRefreshToken = await this.authService.verifyRefreshToken(refreshToken);

            const user = await this.userService.getUser(decodeRefreshToken.userID);

            const newAccessToken = await this.authService.regenerateAccessToken(user);

            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: false, /* process.env.NODE_ENV === 'production' */
                sameSite: 'lax'
            });

            return res.status(200).json({
                accessToken: newAccessToken,
                message: 'Access token renewed successfully'
            });

        } catch (error) {
            console.error('엑세스 토큰 재발급 에러:', error);
            throw new UserException(UserExceptionCode.TOKEN_EXPIRED);
        }
    };
}
