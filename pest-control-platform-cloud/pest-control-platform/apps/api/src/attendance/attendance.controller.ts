import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; import { AuthGuard } from '../common/auth.guard'; import { Permission } from '../common/decorators'; import { PermissionGuard } from '../common/permission.guard';
function distanceM(aLat:number,aLng:number,bLat:number,bLng:number){const R=6371000;const p=Math.PI/180;const a=0.5-Math.cos((bLat-aLat)*p)/2+Math.cos(aLat*p)*Math.cos(bLat*p)*(1-Math.cos((bLng-aLng)*p))/2;return 2*R*Math.asin(Math.sqrt(a));}
@Controller('attendance') @UseGuards(AuthGuard,PermissionGuard)
export class AttendanceController { constructor(private prisma:PrismaService){}
 @Get() @Permission('ATTENDANCE.VIEW') list(@Req()req:any){return this.prisma.attendance.findMany({where:req.user.role==='Admin'?undefined:{userId:req.user.sub},include:{user:{select:{fullName:true,username:true}},task:{include:{customer:true}}},orderBy:{timestamp:'desc'},take:200})}
 @Post('check-in') @Permission('ATTENDANCE.CREATE') async checkIn(@Body()b:any,@Req()req:any){return this.check('CHECK_IN',b,req)}
 @Post('check-out') @Permission('ATTENDANCE.CREATE') async checkOut(@Body()b:any,@Req()req:any){return this.check('CHECK_OUT',b,req)}
 private async check(type:any,b:any,req:any){let task:any=null;if(b.taskId)task=await this.prisma.task.findUnique({where:{id:b.taskId},include:{customer:true}});if(task?.customer?.latitude&&task.customer.longitude&&b.latitude&&b.longitude){const d=distanceM(Number(b.latitude),Number(b.longitude),Number(task.customer.latitude),Number(task.customer.longitude));if(d>(task.customer.geofenceRadius||100))return {ok:false,code:'OUTSIDE_GEOFENCE',distance:Math.round(d),message:'You are outside the permitted work location.'};}
 const a=await this.prisma.attendance.create({data:{userId:req.user.sub,taskId:b.taskId||null,type,timestamp:new Date(),latitude:b.latitude,longitude:b.longitude,accuracy:b.accuracy,photoUrl:b.photoUrl,deviceId:b.deviceId,ipAddress:req.ip}});if(b.taskId) await this.prisma.task.update({where:{id:b.taskId},data:{status:type==='CHECK_IN'?'IN_PROGRESS':'COMPLETED'}});return {ok:true,attendance:a};}
}
