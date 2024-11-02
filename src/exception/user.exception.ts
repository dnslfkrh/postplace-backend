import { HttpException } from "@nestjs/common";

export enum UserExceptionCode {
    'USER_BAD_REQUEST' = 'USER_BAD_REQUEST',    // 요청 오류, 정보 누락
    'USER_NOT_FOUND' = 'USER_NOT_FOUND',        // 가입되지 않은 유저
    'USER_UNAUTHORIZED' = 'USER_UNAUTHORIZED',
    'TOKEN_EXPIRED' = 'TOKEN_EXPIRED',
}

const StatusCode: {
    [key in UserExceptionCode]: number
} = {
    'USER_BAD_REQUEST': 400,
    'USER_NOT_FOUND': 404,
    'USER_UNAUTHORIZED': 401,
    'TOKEN_EXPIRED': 403,
}

export class UserException extends HttpException {
    constructor(code: UserExceptionCode) {
        super(code, StatusCode[code]);
    }
}
