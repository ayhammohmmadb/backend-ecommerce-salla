import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema.js';
import {Model} from 'mongoose';
import * as bcrypt from 'bcrypt';
import { BasicGroupByOptions } from 'rxjs';
@Injectable()
export class UserService {
   constructor(@InjectModel(User.name) private userModel:Model<UserDocument>){}


  async create(createUserDto: CreateUserDto):Promise<UserDocument> {
    const existUser = await this.userModel.findOne({email:createUserDto.email}).exec();
    if(existUser)
    {
      throw new ForbiddenException("email is already exist")
    }
    const hashPassword=await bcrypt.hash(createUserDto.password,12);
    const user=new this.userModel({...createUserDto,password:hashPassword});
    user.save();
    return user;
  }

  findAll() {
    return this.userModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
