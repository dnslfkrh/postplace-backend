import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './strategy/google.strategy';
import { AccessTokenStrategy } from './strategy/accessToken.strategy';
import { RefreshTokenStrategy } from './strategy/refreshToken.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/entities/user.entity';
import { UserModule } from 'src/modules/user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '60m' },
                refreshToken: {
                    secret: configService.get<string>('JWT_REFRESH_SECRET'),
                    signOptions: { expiresIn: '14d' },
                },
            }),
        }),
        TypeOrmModule.forFeature([User]),
        UserModule,
    ],
    providers: [
        AuthService,
        GoogleStrategy,
        AccessTokenStrategy,
        RefreshTokenStrategy,
    ],
    controllers: [AuthController],
    exports: [
        AuthService,
    ]
})

export class AuthModule { }