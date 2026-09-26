import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
export enum Role {
  USER = 'user',
  Admin = 'admin',
  MANAGER = 'manager',
  SELLER = 'seller',
}
export enum Gender {
  MALE = 'male',
  FEMAL = 'female',
}
@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
    minlength: [3, 'Name must be at least 3 Characters'],
    maxlength: [30, 'Name must be at most 30 Characters'],
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    minlength: [3, 'Password must be at least 3 Characters'],
  })
  password: string;

  @Prop({
    type: String,
    enum: Role,
    default: Role.USER,
  })
  role: Role;
  @Prop({
    type: String,
  })
  avatar?: string;

  @Prop({
    type: Number,
  })
  age?: number;

  @Prop({
    type: String,
  })
  phone_Number?: String;
  @Prop({
    type: String,
  })
  address?: string;
  @Prop({
    type: Boolean,
    default: true,
  })
  active?: boolean;
  @Prop({
    type: String,
  })
  verfication_code?: string;
  @Prop({
    type: String,

    enum: Gender,
  })
  gender?: Gender;
}
export const UserSchema = SchemaFactory.createForClass(User);
