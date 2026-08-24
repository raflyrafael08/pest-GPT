import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '../common/auth.guard';
@Controller('auth')
export class AuthController { constructor(private auth:AuthService){}
 @Post('login') async login(@Body() body:any,@Res({passthrough:true})res:Response){const r=await this.auth.login(body.username,body.password); res.cookie('access_token',r.token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',maxAge:8*3600*1000}); return {user:r.user}}
 @Post('logout') logout(@Res({passthrough:true})res:Response){res.clearCookie('access_token');return {ok:true}}
 @Get('me') @UseGuards(AuthGuard) me(@Req()req:any){return this.auth.me(req.user.sub)}
}
