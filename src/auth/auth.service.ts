import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { SignUpAuthDto } from './dto/sign-up-auth.dto.js';
import { User, UserDocument } from '../user/user.schema.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from '../guard/role.enum.js';
import { JwtService } from '@nestjs/jwt';
import { SignInAuthDto } from './dto/sign-in-auth.dto.js';
import { promises } from 'dns';
import { NotFoundError } from 'rxjs';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}
  async SignUp(
    signUpDto: SignUpAuthDto,
  ): Promise<{ message: string; user: UserDocument }> {
    const userExist = await this.userModel
      .findOne({ email: signUpDto.email })
      .exec();
    if (userExist) {
      throw new ForbiddenException('email is already exist');
    }
    const hashPassword = await bcrypt.hash(signUpDto.password, 12);
    const user = new this.userModel({
      ...signUpDto,
      password: hashPassword,
      role: Role.USER,
    });
    await user.save();
    return {
      message: 'sign up is successfully',
      user,
    };
  }

  async SignIn(
    singInDto: SignInAuthDto,
  ): Promise<{
    message: string;
    existUser: UserDocument;

  }> {
    const existUser = await this.userModel
      .findOne({ email: singInDto.email }).select('-password -__v')
      .exec();
    if (!existUser) {
      throw new NotFoundException('user not exist');
    }
    const tokens = await this.generateToken(existUser);
 existUser.token=tokens.access_token;
 existUser.refreshToken=tokens.refresh_Token;
 existUser.save()
    return {
      message: "you'r sign in successfully",
      existUser,
  
    };
  }

  private async generateToken(user: UserDocument) {
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });
    const refresh_Token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });

    return {
      access_token,
      refresh_Token,
    };
  }
}
