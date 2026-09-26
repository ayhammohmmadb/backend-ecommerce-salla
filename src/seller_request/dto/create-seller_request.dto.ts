import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSellerRequestDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  storeName: string;
  @IsString()
  @IsPhoneNumber()
  phone: string;
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  description: string;
  @IsOptional()
  @IsUrl()
  avatar?: string;
}
