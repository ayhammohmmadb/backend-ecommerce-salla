import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SellerRequest,
  SellerRequestDocument,
} from './seller_request.schema.js';
import { Model, Types } from 'mongoose';
import { Role, User, UserDocument } from '../user/user.schema.js';
import { CreateSellerRequestDto } from './dto/create-seller_request.dto.js';

import { SellerRequestStatus } from './selller.enum.js';

import { RejectSellerRequestDto } from './dto/reject-seller-request.dto.js';

@Injectable()
export class SellerRequestService {
  constructor(
    @InjectModel(SellerRequest.name)
    private sellerRequestModel: Model<SellerRequestDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}
  async create(
    dto: CreateSellerRequestDto,
    userId: string,
  ): Promise<{ message: string; request: SellerRequestDocument }> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (user.role === Role.SELLER) {
      throw new ConflictException('you are already a seller');
    }
    const existRequest = await this.sellerRequestModel.findOne({
      userId: new Types.ObjectId(userId),
      status: SellerRequestStatus.PENDING,
    });
    if (existRequest) {
      throw new ConflictException(
        'you are already have a pending seller request',
      );
    }
    const request = new this.sellerRequestModel({
      UserId: new Types.ObjectId(userId),
      storeName: dto.storeName,
      phone: dto.phone,
      description: dto.description,
      status: SellerRequestStatus.PENDING,
    });
    await request.save();

    return {
      message: 'request create succesfully',
      request,
    };
  }
  //admin get all
  async findAll() {
    return await this.sellerRequestModel
      .find()
      .populate('UserId', 'name email role')
      .populate('ReviewedBy', 'name role email')
      .sort({ createAt: -1 })
      .exec();
  }
  // admin  get  one by id
  async findOne(id: string) {
    const request = await this.sellerRequestModel
      .findOne({ id: id })
      .populate('UserId', 'name email role')
      .populate('ReviewedBy', 'name role email')
      .sort({ createAt: -1 })
      .exec();
    return {
      message: 'this is request',
      request,
    };
  }
  // admin approve
  async approve(requstId: string, adminId: string) {
    const request = await this.sellerRequestModel.findById(requstId).exec();
    if (!request) {
      throw new NotFoundException('Seller request not found');
    }
    if (request.status !== SellerRequestStatus.PENDING) {
      throw new ConflictException('Request already reviewed');
    }
    const user = await this.userModel.findById(request.UserId).exec();
    if (!user) {
      throw new NotFoundException('user not found');
    }
    user.role = Role.SELLER;
    await user.save();
    request.status = SellerRequestStatus.APPROVED;
    request.ReviewedBy = new Types.ObjectId(adminId);
    request.reviewedAt = new Date();

    await request.save();
    return {
      message: 'user now is seller ',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      request,
    };
  }
  async reject(
    requestId: string,
    adminId: string,
    dto: RejectSellerRequestDto,
  ) {
    const request = await this.sellerRequestModel.findById(requestId).exec();
    if (!request) {
      throw new NotFoundException('Seller request Not Found');
    }
    if (request.status !== SellerRequestStatus.PENDING) {
      throw new ConflictException(
        `Request already reviewed  Request is  ${request.status}`,
      );
    }
    request.status = SellerRequestStatus.REJECTED;
    request.rejectionReason = dto.reason;
    request.ReviewedBy = new Types.ObjectId(adminId);
    request.reviewedAt = new Date();
    await request.save();
    return {
      message: 'request is reject  ',
      request,
    };
  }
}
