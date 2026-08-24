import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthGuard implements CanActivate {
 constructor(private jwt:JwtService){}
 canActivate(ctx:ExecutionContext){const req=ctx.switchToHttp().getRequest(); const token=req.cookies?.access_token || (req.headers.authorization?.startsWith('Bearer ')?req.headers.authorization.slice(7):null); if(!token) throw new UnauthorizedException('Authentication required'); try{req.user=this.jwt.verify(token); return true}catch{throw new UnauthorizedException('Invalid or expired session')}}
}
