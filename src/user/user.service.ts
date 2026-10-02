import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema.js';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { BasicGroupByOptions } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { UserQueryDto } from './dto/user-query.dto.js';
import { Role } from '../guard/role.enum.js';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string; user: UserDocument }> {
    const existUser = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (existUser) {
      throw new ForbiddenException('email is already exist');
    }
    const hashPassword = await bcrypt.hash(createUserDto.password, 12);
    const user = new this.userModel({
      ...createUserDto,
      password: hashPassword,
      role: Role.USER,
    });
    user.save();
    return {
      message: 'user created successfully',
      user,
    };
  }

  async findAll(query: UserQueryDto) {
    const skip = query.skip ?? 0;
    const limit = query.limit ?? 10;
    const filter: any = {};
    if (query.role) {
      filter.role = query.role;
    }

    if (query.name) {
      filter.name = {
        $regex: query.name,
        $options: 'i',
      };
    }
    if (query.email) {
      filter.email = {
        $regex: query.email,
        $options: 'i',
      };
    }

    const sortOrder = query.sort === 'desc' ? -1 : 1;
    const user = await this.userModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ email: sortOrder })
      .select('-password -__v')
      .exec();
    if (user.length === 0) {
      return {
        length: user.length,
        message: 'not found any user sorry',
        status: 200,
      };
    }
    return {
      length: user.length,
      status: 200,
      message: 'User found Successfully',
      data: user,
    };
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('user not exist');
    }
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ user: UserDocument; message: string }> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return {
      user,
      message: 'user is updated successfully',
    };
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return {
      message: ' user is deleted successfully',
    };
  }

  // create manager
  async createManager(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string; user: UserDocument }> {
    const existUser = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (!existUser) {
      throw new ForbiddenException('email is already exist');
    }
    const hashPassword = await bcrypt.hash(createUserDto.password, 12);
    const user = new this.userModel({
      ...existUser,
      password: hashPassword,
      role: Role.MANAGER,
    });
    await user.save();
    return {
      message: 'you create new manager ',
      user,
    };
  }
  async getMe(id: string) {
    const Me = await this.userModel
      .findById(id)
      .select('-password -role')
      .exec();
    if (!Me) {
      throw new NotFoundException();
    }

    return {
      status: 200,
      message: 'you info is',
      data: Me,
    };
  }
  async updateMe(id: string, dto: UpdateUserDto) {
    const Me = await this.userModel
      .findByIdAndUpdate(id, dto, {
        returnDocument: 'after',
        runValidators: true,
      })
      .exec();
    if (!Me) {
      throw new NotFoundException();
    }
    return {
      status: 200,
      message: "updated you'r info successfully",
      data: Me,
    };
  }
  async Active(id: string) {
    const Me = await this.userModel
      .findByIdAndUpdate(
        id,
        { active: true },
        { returnDocument: 'after', runValidators: true },
      )
      .exec();
    if (!Me) {
      throw new NotFoundException();
    }
    return {
      status: 200,
      message: "updated you'r info successfully",
      data: Me,
    };
  }

  async deactivate(id: string) {
    const Me = await this.userModel
      .findByIdAndUpdate(
        id,
        { active: false },
        { returnDocument: 'after', runValidators: true },
      )
      .exec();
    if (!Me) {
      throw new NotFoundException();
    }
    return {
      status: 200,
      message: "updated you'r info successfully",
      data: Me,
    };
  }
  async deleteAcount(id: string) {
    const user = await this.userModel
      .findByIdAndDelete(id)
      .select('-password')
      .exec();
    if (!user) {
      throw new NotFoundException();
    }
    return {
      status: 200,
      message: 'Account deleted successfully',
      data: user,
    };
  }
}
