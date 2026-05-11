import { EntityManager } from '@mikro-orm/core';
import { HttpStatus, Injectable } from '@nestjs/common';
import errorConstants from '../../../core/constants/error.constants';
import successConstants from '../../../core/constants/success.constants';
import ExportedFeedbacks from '../../../core/entities/exported.feedbacks';
import Feedback from '../../../core/entities/feedback';
import User from '../../../core/entities/user';
import { FeedbackExportType } from '../../../core/enums/feedback.export.type.enum';
import { UserRole } from '../../../core/enums/user.role.enum';
import ResponseInterface from '../../../core/interfaces/response.interface';
import { getCurrentMonth } from '../../../core/utils/helpers/date.helpers';
import feedbackExcelExport from '../../../core/utils/helpers/feedback.excel.export';

@Injectable()
export default class ExportFeedbackService {
  constructor(private readonly entityManager: EntityManager) {}

  /**
   *
   * @param adminId Id number of admin.
   * @param type Type to export feedback. PDF, Excel, etc...
   * @param date Date to filter the feedbacks. Defaults to current date.
   */
  async export(
    adminId: number,
    type: FeedbackExportType,
    date = new Date('2025-10-29'),
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
      return {
        message: errorConstants.userNotFound,
        statusCode: HttpStatus.NOT_FOUND,
        success: false,
      };
    }

    if (findAdmin.role !== UserRole.admin) {
      // Only Admin can export feedback
      return {
        message: errorConstants.unauthorized,
        statusCode: HttpStatus.FORBIDDEN,
        success: false,
      };
    }

    /**
     * User has admin rights, fetch all feedbacks and export it using the preferred format type.
     *
     * @var userFeedbacks assigned with all feedbacks
     */

    const currentDate = date;
    const currentStartAndEndMonth = getCurrentMonth(currentDate);

    const userFeedbacks = await this.entityManager.find(Feedback, {
      createdAt: {
        $gte: currentStartAndEndMonth.startDate,
        $lte: currentStartAndEndMonth.endDate,
      },
    });

    if (userFeedbacks.length == 0) {
      // No feedbacks found, cant process the request
      return {
        message: errorConstants.noFeedbacksFound,
        statusCode: HttpStatus.BAD_REQUEST,
        success: false,
      };
    }

    // Export the feedback
    const exportedFeedbacksPath = await feedbackExcelExport(userFeedbacks);

    await this.entityManager.insert(ExportedFeedbacks, {
      createdAt: new Date(),
      feedbackUrl: exportedFeedbacksPath,
      format: 'excel',
      updatedAt: new Date(),
      user: findAdmin.id,
    });

    // Feedbacks exported successfully return the feedback file path url.
    return {
      message: successConstants.feedbackExportedSuccessfully,
      statusCode: HttpStatus.CREATED,
      success: true,
    };
  }
}
