import { EntityManager } from '@mikro-orm/core';
import { HttpStatus, Injectable } from '@nestjs/common';
import ResponseInterface from '../../../core/interfaces/response.interface';
import User from '../../../core/entities/user';
import errorConstants from '../../../core/constants/error.constants';
import { UserRole } from '../../../core/enums/user.role.enum';
import successConstants from '../../..//core/constants/success.constants';

@Injectable()
export default class GetEachEmojiCountService {
  constructor(private readonly entityManager: EntityManager) {}

  async getCount(adminId: number): Promise<ResponseInterface> {
    const findUser = await this.entityManager.findOne(
      User,
      { id: adminId },
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
      // User not found!
      return {
        message: errorConstants.userNotFound,
        statusCode: HttpStatus.NOT_FOUND,
        success: false,
      };
    }

    // Ensures user has admin privilege
    if (findUser.role !== UserRole.admin) {
      // User don't have admin rights!
      return {
        message: errorConstants.unauthorized,
        statusCode: HttpStatus.FORBIDDEN,
        success: false,
      };
    }

    const count = await this.entityManager
      .getConnection()
      .execute('SELECT emoji, COUNT(*) as count FROM feedback GROUP BY emoji');

    return {
      data: count,
      message: successConstants.feedbackCountFetchedSuccessfully,
      statusCode: HttpStatus.OK,
      success: true,
    };
  }
}
