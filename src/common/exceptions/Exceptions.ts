import { HttpException } from "@nestjs/common";

export enum ExceptionCode {
    // 잘못된 요청
    'BAD_REQUEST' = 'BAD_REQUEST',

    // 사용자를 찾을 수 없음
    'USER_NOT_FOUND' = 'USER_NOT_FOUND',

    // 인증되지 않은 사용자
    'USER_UNAUTHORIZED' = 'USER_UNAUTHORIZED',

    // 인증은 되었지만 권한이 없는 사용자
    'USER_FORBIDDEN' = 'USER_FORBIDDEN',

    // 서버 오류
    'INTERNAL_SERVER_ERROR' = 'INTERNAL_SERVER_ERROR',
}

const StatusCode: {
    [key in ExceptionCode]: number
} = {
    'BAD_REQUEST': 400,
    'USER_NOT_FOUND': 404,
    'USER_UNAUTHORIZED': 401,
    'USER_FORBIDDEN': 403,
    'INTERNAL_SERVER_ERROR': 500,
}

export class Exception extends HttpException {
    constructor(code: ExceptionCode) {
        super(code, StatusCode[code]);
    }
}
