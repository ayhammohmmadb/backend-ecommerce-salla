import { IsBoolean, IsEmail, IsEnum, IsIn, IsNumber, IsOptional, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Gender, Role } from "../user.schema.js";

export class CreateUserDto {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
name:string;
@IsEmail()
email:string;
@IsString()
@MinLength(8)

@Matches(/[A-Z]/,{message:'Password must contain an upercase letter'})
@Matches(/[a-z]/,{message:'Password must contain a lowercase letter'})
@Matches(/[0-9]/,{message:"Password must contain a number"})
@Matches(/[@$!%*?&]/, { message: 'Password must contain a special character', })
 password: string;

 @IsOptional()
 @IsEnum(Role)
 role?:Role;
 @IsOptional()
 @IsString()
 Avatar?:string;
 @IsOptional()
 @IsNumber()
 Age?:Number;
 @IsOptional()
 @IsPhoneNumber()
 phone_Number?:string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  aCtive?: boolean;

  @IsOptional()
  @IsString()
  verfication_code?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

}