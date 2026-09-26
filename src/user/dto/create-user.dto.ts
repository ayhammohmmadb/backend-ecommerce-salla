import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../../guard/role.enum.js';
import { Gender } from '../user.schema.js';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/, { message: 'Password must contain an upercase letter' })
  @Matches(/[a-z]/, { message: 'Password must contain a lowercase letter' })
  @Matches(/[0-9]/, { message: 'Password must contain a number' })
  @Matches(/[@$!%*?&]/, {
    message: 'Password must contain a special character',
  })
  password: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  @IsNumber()
  age?: number;
  @IsString()
  @IsOptional()
  @IsPhoneNumber()
  phone_Number?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsBoolean()
  @IsEnum([true, false])
  active?: boolean;

  @IsString()
  @IsOptional()
  @Length(6, 6, { message: 'verificationcode must be 6 characters' })
  verfication_code?: string;

  @IsEnum(Gender)
  gender?: Gender;
}
