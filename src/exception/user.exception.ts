import { HttpException } from "@nestjs/common";

export enum UserExceptionCode {
    'USER_BAD_REQUEST' = 'USER_BAD_REQUEST',    // 요청 오류, 정보 누락
    'USER_NOT_FOUND' = 'USER_NOT_FOUND',        // 가입되지 않은 유저
    'USER_UNAUTHORIZED' = 'USER_UNAUTHORIZED',
    'USER_SAVE_FAILED' = 'USER_SAVE_FAILED',    // 사용자 저장 실패
}

const StatusCode: {
    [key in UserExceptionCode]: number
} = {
    'USER_BAD_REQUEST': 400,
    'USER_NOT_FOUND': 404,
    'USER_UNAUTHORIZED': 401,
    'USER_SAVE_FAILED': 500,
}

export class UserException extends HttpException {
    constructor(code: UserExceptionCode) {
        super(code, StatusCode[code]);
    }
}