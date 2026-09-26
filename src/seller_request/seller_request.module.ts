import { Module } from '@nestjs/common';
import { SellerRequestService } from './seller_request.service.js';
import { SellerRequestController } from './seller_request.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { SellerRequest, SellerRequestSchema } from './seller_request.schema.js';
import { User, UserSchema } from '../user/user.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SellerRequest.name,
        schema: SellerRequestSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [SellerRequestController],
  providers: [SellerRequestService],
  exports: [SellerRequestService],
})
export class SellerRequestModule {}
