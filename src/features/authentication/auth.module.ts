import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import User from '../../core/entities/user';
import AuthenticationController from './authentication.controller';
import CreateUserService from './services/create.user.service';
import LoginUserService from './services/login.user.service';
import LogoutUserService from './services/logout.user.service';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [AuthenticationController],
  providers: [CreateUserService, LoginUserService, LogoutUserService],
})
export default class AuthModule {}
