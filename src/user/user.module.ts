import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { MeInfoController, UserController } from './user.controller.js';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    ConfigModule,
  ],
  controllers: [UserController, MeInfoController],
  providers: [UserService],
})
export class UserModule {}
