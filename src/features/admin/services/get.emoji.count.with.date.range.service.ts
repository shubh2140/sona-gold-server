import { EntityManager } from '@mikro-orm/core';
import { HttpStatus, Injectable } from '@nestjs/common';
import errorConstants from '../../../core/constants/error.constants';
import successConstants from '../../../core/constants/success.constants';
import Feedback from '../../../core/entities/feedback';
import User from '../../../core/entities/user';
import { FeedbackEmoji } from '../../../core/enums/feedback.enum';
import { UserRole } from '../../../core/enums/user.role.enum';
import ResponseInterface from '../../../core/interfaces/response.interface';

@Injectable()
export default class GetEmojiCountWithDateRangeService {
  constructor(private readonly entityManager: EntityManager) {}

  /**
   * To get count of emoji, user need to pass their id number and type or emoji
   *
   * @param userId Id number of user
   * @param branchName Branch Name
   * @param dateRange Date range to filter the query. Assumes in format of **'11-10-2020,12-10-2020'**
   * @param emoji Type of emoji to get count
   */
  async getCount(
    userId: number,
    dateRange: string,
    emoji: FeedbackEmoji,
  ): Promise<ResponseInterface> {
    const findUser = await this.entityManager.findOne(
      User,
      { id: userId },
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

    /**
     * Split the date range
     *
     * assumes dateRange in this form '11-10-2020,12-10-2020'
     */
    const [startDate, endDate] = dateRange.split(',');
    const count = await this.entityManager.count(Feedback, {
      createdAt: { $gte: startDate, $lte: endDate },
      emoji: emoji,
    });

    return {
      data: { count: count },
      message: successConstants.feedbackCountFetchedSuccessfully,
      statusCode: HttpStatus.OK,
      success: true,
    };
  }
}
