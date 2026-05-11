import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import express from 'express';
import CreateUserDto from '../../core/dto/create.user.dto';
import LoginUserDto from '../../core/dto/login.user.dto';
import TokenGuard from '../../core/guards/token.guard';
import CreateUserService from './services/create.user.service';
import LoginUserService from './services/login.user.service';
import LogoutUserService from './services/logout.user.service';

@Controller('auth')
export default class AuthenticationController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly loginUserService: LoginUserService,
    private readonly logoutUserService: LogoutUserService,
  ) {}

  @Post('create')
  async createUser(
    @Body() body: CreateUserDto,
    @Res() response: express.Response,
  ) {
    try {
      const result = await this.createUserService.createUser(body);
      return response.status(result.statusCode).send(result);
    } catch (error) {
      throw new InternalServerErrorException({
        message: error.message,
        statusCode: 500,
        success: false,
      });
    }
  }

  @Post('login')
  async loginUser(
    @Body() body: LoginUserDto,
    @Res() response: express.Response,
  ) {
    try {
      const result = await this.loginUserService.loginUser(body);
      return response.status(result.statusCode).send(result);
    } catch (error) {
      throw new InternalServerErrorException({
        message: error.message,
        statusCode: 500,
        success: false,
      });
    }
  }

  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Post('logout')
  async logoutUser(@Request() req, @Res() response: express.Response) {
    try {
      const result = await this.logoutUserService.logoutUser(req.user.id);
      return response.status(result.statusCode).send(result);
    } catch (error) {
      throw new InternalServerErrorException({
        message: error.message,
        statusCode: 500,
        success: false,
      });
    }
  }
}
