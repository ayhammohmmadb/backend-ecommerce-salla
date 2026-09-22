import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { createObserveModule } from '@nestjs/observe';
import { UserModule } from './user/user.module.js';


export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    // ObserveModule.forRoot({
    //   appKey: 'YOUR_APP_KEY',
    //   appSecret: 'YOUR_APP_SECRET',
    //   serviceId: 'salla',
    // }),
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:".env"
    }),
  MongooseModule.forRootAsync({
    inject:[ConfigService],
    useFactory:(configService:ConfigService)=>{
      const uri=configService.get<string>("MONGODB_URI");
      if(!uri)
      {
        throw new Error("MONGODB_URI is not defiend in .env");
      }
      return {
        uri
      }
    }
  }),
  UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
