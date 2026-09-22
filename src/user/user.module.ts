import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema.js';

@Module({
  imports:[ MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
