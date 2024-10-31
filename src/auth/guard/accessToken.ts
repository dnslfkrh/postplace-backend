import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class AccessTokenGuard extends AuthGuard("jwt") implements CanActivate {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }
}