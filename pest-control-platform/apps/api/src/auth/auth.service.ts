import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import bcrypt from 'bcryptjs';
@Injectable()
export class AuthService {
 constructor(private prisma:PrismaService,private jwt:JwtService){}
 async login(username:string,password:string){const user=await this.prisma.user.findFirst({where:{OR:[{username},{email:username}]},include:{role:true}}); if(!user || user.status!=='ACTIVE' || !(await bcrypt.compare(password,user.passwordHash))) throw new UnauthorizedException('Invalid credentials'); const payload={sub:user.id,username:user.username,role:user.role.name}; const token=this.jwt.sign(payload); await this.prisma.user.update({where:{id:user.id},data:{lastSeenAt:new Date()}}); return {token,user:{id:user.id,username:user.username,email:user.email,fullName:user.fullName,position:user.position,role:user.role.name}};}
 async me(userId:string){return this.prisma.user.findUnique({where:{id:userId},select:{id:true,username:true,email:true,fullName:true,position:true,status:true,role:{select:{name:true}},lastSeenAt:true,lastLatitude:true,lastLongitude:true}})}
}
