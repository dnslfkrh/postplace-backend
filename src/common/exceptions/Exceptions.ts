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

    // 리소스를 찾을 수 없음
    'RESOURCE_NOT_FOUND' = 'RESOURCE_NOT_FOUND',

    // 중복된 리소스
    'RESOURCE_CONFLICT' = 'RESOURCE_CONFLICT',

    // 유효성 검사 실패
    'VALIDATION_FAILED' = 'VALIDATION_FAILED',

    // 데이터베이스 오류
    'DATABASE_ERROR' = 'DATABASE_ERROR',

    // 서비스 제한 초과 (Rate limit exceeded)
    'RATE_LIMIT_EXCEEDED' = 'RATE_LIMIT_EXCEEDED',
}

const StatusCode: {
    [key in ExceptionCode]: number
} = {
    'BAD_REQUEST': 400,
    'USER_NOT_FOUND': 404,
    'USER_UNAUTHORIZED': 401,
    'USER_FORBIDDEN': 403,
    'INTERNAL_SERVER_ERROR': 500,
    'RESOURCE_NOT_FOUND': 404,
    'RESOURCE_CONFLICT': 409,
    'VALIDATION_FAILED': 422,
    'DATABASE_ERROR': 500,
    'RATE_LIMIT_EXCEEDED': 429,
}

export class Exception extends HttpException {
    constructor(code: ExceptionCode) {
        super(code, StatusCode[code]);
    }
}