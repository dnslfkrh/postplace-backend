import { HttpException } from "@nestjs/common";

export enum PinExceptionCode {
    'PIN_BAD_REQUEST' = 'PIN_BAD_REQUEST',    // 요청 오류, 정보 누락
    'PIN_NOT_FOUND' = 'PIN_NOT_FOUND',        // 해당 핀포인트를 찾을 수 없음
}

const StatusCode: {
    [key in PinExceptionCode]: number
} = {
    'PIN_BAD_REQUEST': 400,
    'PIN_NOT_FOUND': 404,
}

export class PinException extends HttpException {
    constructor(code: PinExceptionCode) {
        super(code, StatusCode[code]);
    }
}