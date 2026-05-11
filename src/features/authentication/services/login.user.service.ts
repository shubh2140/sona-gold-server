import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import errorConstants from '../../../core/constants/error.constants';
import successConstants from '../../../core/constants/success.constants';
import LoginUserDto from '../../../core/dto/login.user.dto';
import User from '../../../core/entities/user';
import ResponseInterface from '../../../core/interfaces/response.interface';
import serviceLocator from '../../../core/services/service.locator';
import PasswordHash from '../../../core/utils/security/password_hash/password.hash';

@Injectable()
export default class LoginUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async loginUser(userData: LoginUserDto): Promise<ResponseInterface> {
    /**
     * Currently user login to the server using userName, and password
     */
    const findUser = await this.userRepository.findOne(
      { userName: userData.identifier },
      {
        exclude: ['createdAt', 'isLogged', 'updatedAt'],
      },
    );

    if (!findUser) {
      // User not found!
      return {
        message: errorConstants.userNotFound,
        statusCode: HttpStatus.NOT_FOUND,
        success: false,
      };
    }

    // User found, verify password
    const isPasswordMatching = await serviceLocator
      .resolve<PasswordHash>('argon')
      .verifyPassword(userData.password, findUser.password);

    if (!isPasswordMatching) {
      // Password not matching!
      return {
        message: errorConstants.invalidIdentifierOrPassword,
        statusCode: HttpStatus.UNAUTHORIZED,
        success: false,
      };
    }

    // User password matching, update the is_logged column
    await this.userRepository.nativeUpdate(
      { id: findUser.id },
      { isLogged: true },
    );

    // After login success, create a jwt access token
    const payload = { id: findUser.id, role: findUser.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload);

    return {
      data: {
        email: findUser.email,
        phone: findUser.phone,
        userName: findUser.userName,
        secret: {
          // Token to access protected route
          accessToken: accessToken,
          // Token to refresh the access token
          refreshToken: refreshToken,
        },
      },
      message: successConstants.userLoggedInSuccessfully,
      statusCode: HttpStatus.CREATED,
      success: true,
    };
  }
}
