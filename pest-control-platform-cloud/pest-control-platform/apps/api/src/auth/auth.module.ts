import { Module } from '@nestjs/common'; import { PrismaModule } from '../prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
@Module({imports:[PrismaModule,JwtModule.register({secret:process.env.JWT_SECRET||'dev-secret',signOptions:{expiresIn:process.env.JWT_EXPIRES_IN||'8h'}})],controllers:[AuthController],providers:[AuthService],exports:[AuthService,JwtModule]}) export class AuthModule{}
