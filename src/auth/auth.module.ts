import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.schema.js';

@Module({
   imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
