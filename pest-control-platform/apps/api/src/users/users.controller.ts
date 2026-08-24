import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../common/auth.guard';
import { Permission } from '../common/decorators';
import { PermissionGuard } from '../common/permission.guard';
import { AuditService } from '../audit.service';
@Controller('users') @UseGuards(AuthGuard,PermissionGuard)
export class UsersController { constructor(private prisma:PrismaService,private audit:AuditService){}
 @Get() @Permission('USER.VIEW') list(){return this.prisma.user.findMany({select:{id:true,username:true,email:true,fullName:true,position:true,status:true,role:{select:{name:true}},lastSeenAt:true,lastLatitude:true,lastLongitude:true,leaveEntitlement:true},orderBy:{fullName:'asc'}})}
 @Get(':id') @Permission('USER.VIEW') get(@Param('id')id:string){return this.prisma.user.findUnique({where:{id},select:{id:true,username:true,email:true,fullName:true,position:true,phone:true,address:true,identityNumber:true,status:true,role:{select:{name:true}},leaveEntitlement:true,lastSeenAt:true,lastLatitude:true,lastLongitude:true}})}
 @Patch(':id') @Permission('USER.MANAGE') async patch(@Param('id')id:string,@Body()body:any,@Req()req:any){const old=await this.prisma.user.findUnique({where:{id}});const user=await this.prisma.user.update({where:{id},data:{fullName:body.fullName,position:body.position,phone:body.phone,address:body.address,leaveEntitlement:body.leaveEntitlement,status:body.status}});await this.audit.log(req.user.sub,'USER_UPDATED','USERS',id,old,user,req);return user}
 @Post(':id/permissions') @Permission('USER.MANAGE') async permissions(@Param('id')id:string,@Body()body:any,@Req()req:any){await this.prisma.userPermission.deleteMany({where:{userId:id}});for(const p of body.permissions||[])await this.prisma.userPermission.create({data:{userId:id,permissionId:p.permissionId,allow:p.allow!==false}});await this.audit.log(req.user.sub,'PERMISSION_UPDATED','USERS',id,null,body.permissions,req);return {ok:true}}
 @Get('/meta/permissions') @Permission('USER.MANAGE') permissionsList(){return this.prisma.permission.findMany({orderBy:{code:'asc'}})}
}
