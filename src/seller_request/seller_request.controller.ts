import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SellerRequestService } from './seller_request.service.js';
import { CreateSellerRequestDto } from './dto/create-seller_request.dto.js';

import { AuthGuard } from '../guard/auth.guard.js';
import { Role } from '../guard/role.enum.js';
import { Roles } from '../guard/roles.decorator.js';
import { RolesGuard } from '../guard/roles.guard.js';
import { RejectSellerRequestDto } from './dto/reject-seller-request.dto.js';
import { dot } from 'node:test/reporters';

@Controller('seller-request')
export class SellerRequestController {
  constructor(private readonly sellerRequestService: SellerRequestService) {}
  // user request to be seller 
@UseGuards(AuthGuard)
@Post()
create(@Body() dto:CreateSellerRequestDto,@Req()req:any)
{
  return this.sellerRequestService.create(dto,req.user.id);
}
//admin  get all request
@Roles(Role.Admin) 

@UseGuards(AuthGuard,RolesGuard)
@Get()
findALL()
{
  return this.sellerRequestService.findAll()
}
//admin get request by id
@Roles(Role.Admin) 

@UseGuards(AuthGuard,RolesGuard)
@Get(':id')
findOne(@Param(':id') id:string)
{
  return this.sellerRequestService.findOne(id);
}
//admin Aprove
@Roles(Role.Admin) 

@UseGuards(AuthGuard,RolesGuard)
@Patch(':id/approve')
approve(@Param('id')id:string,@Req() req:any)
{
  return this.sellerRequestService.approve(id,req.user.id)
}
//admin reject
@Roles(Role.Admin) 

@UseGuards(AuthGuard,RolesGuard)
@Patch(':id/reject')
reject(@Param('id')id:string,@Body() dto:RejectSellerRequestDto ,@Req()req:any)
{
return this.sellerRequestService.reject(id,req.user.id,dto)
}
}
