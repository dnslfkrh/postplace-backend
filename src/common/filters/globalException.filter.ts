import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Exception } from "../exceptions/Exceptions";

@Catch(Exception)
export class UserExceptionFilter implements ExceptionFilter {
    catch(exception: Exception, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();
        const status = exception.getStatus();
        const message = exception.message;

        response.status(status).json({
            statusCode: status,
            message: message || "Error Occurred",
        });
    }
}