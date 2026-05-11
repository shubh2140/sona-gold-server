import { EntityManager } from '@mikro-orm/core';
import { HttpStatus, Injectable } from '@nestjs/common';
import errorConstants from '../../../core/constants/error.constants';
import successConstants from '../../../core/constants/success.constants';
import Feedback from '../../../core/entities/feedback';
import User from '../../../core/entities/user';
import { UserRole } from '../../../core/enums/user.role.enum';
import ResponseInterface from '../../../core/interfaces/response.interface';

@Injectable()
export default class GetAllFeedbacksService {
  constructor(private readonly entityManager: EntityManager) {}

  /**
   *
   * @param adminId Id number of admin
   * @param page Page number support. Defaults to 1
   * @param limit To limit query result. Defaults to 20
   */
  async getAllFeedbacks(
    adminId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<ResponseInterface> {
    const findAdmin = await this.entityManager.findOne(
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

    if (!findAdmin) {
      // User not found!
      return {
        message: errorConstants.userNotFound,
        statusCode: HttpStatus.NOT_FOUND,
        success: false,
      };
    }

    if (findAdmin.role !== UserRole.admin) {
      // Only admin can fetch the feedbacks
      return {
        message: errorConstants.unauthorized,
        statusCode: HttpStatus.FORBIDDEN,
        success: false,
      };
    }

    /**
     * Fetch all feedbacks and return the data
     *
     * using page, and limit to perform pagination
     */

    if (page === 0) page = 1;
    if (limit === 0) limit = 20;

    const feedbacks = await this.entityManager.findAll(Feedback, {
      // limit: limit,
      // offset: (page - 1) * limit,
      // Sort the feedback using the id number in Descending order
      orderBy: { id: 'DESC' },
    });

    return {
      data: feedbacks,
      message: successConstants.feedbacksFetchedSuccessfully,
      statusCode: HttpStatus.OK,
      success: true,
    };
  }
}
