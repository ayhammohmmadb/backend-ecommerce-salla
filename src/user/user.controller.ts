import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { AuthGuard } from '../guard/auth.guard.js';
import { Roles } from '../guard/roles.decorator.js';
import { Role } from '../guard/role.enum.js';
import { RolesGuard } from '../guard/roles.guard.js';
import { UserQueryDto } from './dto/user-query.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //create user by admin and manager
  //must have authentication and authorization  me have token and have role admin and manager
  @Roles(Role.Admin, Role.MANAGER)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  // can get all user by admin and manager

  //must have authentication and authorization  me have token and have role admin and manager
  @Roles(Role.Admin, Role.MANAGER)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  findAll(@Query() query: UserQueryDto) {
    return this.userService.findAll(query);
  }
  // can get all user by limited or sort or some char in world and how to write email

  // can get iser by id  by admin and manager

  //must have authentication and authorization  me have token and have role admin and manager
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  // can update   user by id  by admin and manager

  //must have authentication and authorization  me have token and have role admin
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
  // can delete user by id by admin and manager

  //must have authentication and authorization  me have token and have role admin
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  // if i want create manager i user this api
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('manager')
  createManager(@Body() createUserDto: CreateUserDto) {
    return this.userService.createManager(createUserDto);
  }
}
@Controller('MeInfo')
export class MeInfoController {
  constructor(private readonly userService: UserService) {}
  //For User
  //@decs any user can get data on you account
  //@Route Get/api/v1 /MeInfo
  @Get()
  @UseGuards(AuthGuard)
  getMe(@Req() req: any) {
    return this.userService.getMe(req.user.id);
  }
  //For User
  //@decs any user can Update  data on you account
  //@Route Get/api/v1/MeInfo

  @Patch()
  @UseGuards(AuthGuard)
  updateMe(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.userService.updateMe(req.user.id, dto);
  }
  //For User
  //@decs any user be change activ or not active
  //  data on you account
  //@Route Get/api/v1 /MeInfo

  @Patch('Active')
  @UseGuards(AuthGuard)
  Active(@Req() req: any) {
    return this.userService.Active(req.user.id);
  }
  //For User
  //@decs any user can be non-activ or not active
  //  data on you account
  //@Route Get/api/v1 /MeInfo

  @Patch('deactivate')
  @UseGuards(AuthGuard)
  deactivate(@Req() req: any) {
    return this.userService.deactivate(req.user.id);
  }
  //For User
  //@decs any user can delete account or not active
  //  data on you account
  //@Route Get/api/v1 /MeInfo

  @Delete('delete')
  @UseGuards(AuthGuard)
  deleteAcount(@Req() req: any) {
    return this.userService.deleteAcount(req.user.id);
  }
}
