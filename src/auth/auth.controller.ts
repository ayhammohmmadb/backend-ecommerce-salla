import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { SignUpAuthDto } from './dto/sign-up-auth.dto.js';
import { SignInAuthDto } from './dto/sign-in-auth.dto.js';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  SignUp(@Body() signUpDto: SignUpAuthDto) {
    return this.authService.SignUp(signUpDto);
  }
  @Post('sign-in')
  SignIn(@Body() signInDTO: SignInAuthDto) {
    return this.authService.SignIn(signInDTO);
  }


  
}
