import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
@Injectable()
export class AuditService { constructor(private prisma:PrismaService){} async log(userId:string,action:string,module:string,recordId?:string,oldValue?:any,newValue?:any,req?:any){return this.prisma.auditLog.create({data:{userId,action,module,recordId,oldValue,newValue,ipAddress:req?.ip,userAgent:req?.headers?.['user-agent']}})} }
