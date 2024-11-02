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
        const user = await this.authService.validateUser(req.user);
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
    }

    // @Get('isTokenExist')
    // @UseGuards(AccessTokenGuard)
    // isTokenExist(@Req() req: Request, @Res() res: Response) {
    //     const accessToken = req.cookies['accessToken'];
    //     const refreshToken = req.cookies['refreshToken'];

    //     if (accessToken && refreshToken) {
    //         return res.status(HttpStatus.OK).json({ message: 'Tokens exist' });
    //     } else {
    //         return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Tokens not found' });
    //     }
    // }
}