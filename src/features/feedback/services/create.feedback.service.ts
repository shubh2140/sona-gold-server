import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { HttpStatus, Injectable } from '@nestjs/common';
import errorConstants from '../../../core/constants/error.constants';
import successConstants from '../../../core/constants/success.constants';
import CreateFeedbackDto from '../../../core/dto/create.feedback.dto';
import Feedback from '../../../core/entities/feedback';
import { FeedbackEmoji } from '../../../core/enums/feedback.enum';
import ResponseInterface from '../../../core/interfaces/response.interface';
import { isDigitsOnly } from '../../../core/utils/helpers/regular.expressions';

@Injectable()
export default class CreateFeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: EntityRepository<Feedback>,
  ) {}

  async createFeedback(
    feedback: CreateFeedbackDto,
  ): Promise<ResponseInterface> {
    /**
     * When adding feedback ensures that,
     *
     * Phone number, and reason are present if feedback not in [Happy, VeryHappy]
     */

    if (
      feedback.emoji === FeedbackEmoji.satisfied ||
      feedback.emoji === FeedbackEmoji.unSatisfied
    ) {
      // Phone number and reason is mandatory
      if (!feedback.phone || !feedback.reason) {
        return {
          message: errorConstants.pleaseEnterPhoneNumberAndReason,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }
    }

    // Validate the phone number
    if (feedback.phone) {
      const isPhoneNumberValid = isDigitsOnly(feedback.phone);
      if (!isPhoneNumberValid) {
        // Invalid Phone number
        return {
          message: errorConstants.invalidPhoneNumber,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }
    }

    // Insert the feedback
    await this.feedbackRepository.insert({
      createdAt: new Date(),
      branchName: feedback.branchName,
      customerName: feedback.customerName ?? null,
      emoji: feedback.emoji,
      mobileNumber: feedback.phone ?? null,
      reason: feedback.reason ?? null,
      updatedAt: new Date(),
    });

    return {
      message: successConstants.feedbackAddedSuccessfully,
      statusCode: HttpStatus.CREATED,
      success: true,
    };
  }
}
