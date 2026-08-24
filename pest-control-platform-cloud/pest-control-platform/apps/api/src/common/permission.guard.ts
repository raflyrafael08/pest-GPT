import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma.service';
import { PERMISSION_KEY } from './decorators';
@Injectable()
export class PermissionGuard implements CanActivate {
 constructor(private reflector:Reflector, private prisma:PrismaService){}
 async canActivate(ctx:ExecutionContext){const required=this.reflector.getAllAndOverride<string>(PERMISSION_KEY,[ctx.getHandler(),ctx.getClass()]); if(!required)return true; const req=ctx.switchToHttp().getRequest(); const userId=req.user?.sub; if(!userId)throw new ForbiddenException('Missing user context'); const user=await this.prisma.user.findUnique({where:{id:userId},include:{role:{include:{permissions:{include:{permission:true}}}},permissions:{include:{permission:true}}}}); if(!user)throw new ForbiddenException('User not found'); const explicit=user.permissions.find(p=>p.permission.code===required); if(explicit && !explicit.allow)throw new ForbiddenException('Permission denied'); if(explicit?.allow)return true; const roleAllowed=user.role.permissions.some(p=>p.permission.code===required); if(!roleAllowed)throw new ForbiddenException(`Permission ${required} required`); return true;}
}
