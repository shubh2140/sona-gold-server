import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpStatus, Injectable } from '@nestjs/common';
import errorConstants from '../../../core/constants/error.constants';
import successConstants from '../../../core/constants/success.constants';
import User from '../../../core/entities/user';
import { UserRole } from '../../../core/enums/user.role.enum';
import ResponseInterface from '../../../core/interfaces/response.interface';
import { EntityRepository } from '@mikro-orm/core';

@Injectable()
export default class DeleteUserByIdService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  /**
   *
   * @param adminId Id number of admin
   * @param userId Id number of user to delete
   */
  async deleteUser(
    adminId: number,
    userId: number,
  ): Promise<ResponseInterface> {
    const findAdmin = await this.userRepository.findOne(
      {
        id: adminId,
      },
      {
        exclude: [
          'createdAt',
          'email',
          'isLogged',
          'password',
          'phone',
          'updatedAt',
          'userName',
        ],
      },
    );

    if (!findAdmin) {
      return {
        message: errorConstants.userNotFound,
        statusCode: HttpStatus.NOT_FOUND,
        success: false,
      };
    }

    if (findAdmin.role !== UserRole.admin) {
      // Only admin can delete a user
      return {
        message: errorConstants.unauthorized,
        statusCode: HttpStatus.FORBIDDEN,
        success: false,
      };
    }

    const findUser = await this.userRepository.findOne(
      {
        id: userId,
      },
      {
        exclude: [
          'createdAt',
          'email',
          'isLogged',
          'password',
          'phone',
          'updatedAt',
          'userName',
        ],
      },
    );

    if (!findUser) {
      return {
        message: errorConstants.userNotFound,
        statusCode: HttpStatus.NOT_FOUND,
        success: false,
      };
    }

    // Admin and User are valid
    await this.userRepository.nativeDelete({ id: userId });

    return {
      message: successConstants.userDeletedSuccessfully,
      statusCode: HttpStatus.OK,
      success: true,
    };
  }
}
