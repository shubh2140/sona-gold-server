import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { HttpStatus, Injectable } from '@nestjs/common';
import errorConstants from '../../../core/constants/error.constants';
import successConstants from '../../../core/constants/success.constants';
import User from '../../../core/entities/user';
import ResponseInterface from '../../../core/interfaces/response.interface';

@Injectable()
export default class LogoutUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async logoutUser(userId: number): Promise<ResponseInterface> {
    const findUser = await this.userRepository.findOne(
      {
        id: userId,
      },
      {
        exclude: [
          'createdAt',
          'email',
          'password',
          'phone',
          'role',
          'updatedAt',
        ],
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

    // User found, update the is_logged column
    await this.userRepository.nativeUpdate({ id: userId }, { isLogged: false });

    return {
      message: successConstants.userLoggedOutSuccessfully,
      statusCode: HttpStatus.CREATED,
      success: true,
    };
  }
}
