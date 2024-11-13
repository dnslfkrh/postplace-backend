import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class RefreshTokenGuard extends AuthGuard("jwt-refresh") implements CanActivate {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }
}