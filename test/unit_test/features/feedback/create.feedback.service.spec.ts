import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import databaseModule from '../../../../src/core/configs/database.config';
import errorConstants from '../../../../src/core/constants/error.constants';
import successConstants from '../../../../src/core/constants/success.constants';
import Feedback from '../../../../src/core/entities/feedback';
import { FeedbackEmoji } from '../../../../src/core/enums/feedback.enum';
import CreateFeedbackService from '../../../../src/features/feedback/services/create.feedback.service';

describe('Create feedback service test', () => {
  let createFeedbackService: CreateFeedbackService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [databaseModule, MikroOrmModule.forFeature([Feedback])],
      providers: [CreateFeedbackService],
    }).compile();

    createFeedbackService = module.get(CreateFeedbackService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('Should return Please enter phone and reason', async () => {
    const feedback = {
      branchName: 'test',
      emoji: FeedbackEmoji.satisfied,
      phone: '7410258963',
    };

    const result = await createFeedbackService.createFeedback(feedback);

    expect(result).toEqual({
      message: errorConstants.pleaseEnterPhoneNumberAndReason,
      statusCode: 400,
      success: false,
    });
  });

  it('Should return Phone number is invalid', async () => {
    const feedback = {
      branchName: 'test',
      emoji: FeedbackEmoji.satisfied,
      phone: '741025896g',
      reason: 'reason',
    };

    const result = await createFeedbackService.createFeedback(feedback);

    expect(result).toEqual({
      message: errorConstants.invalidPhoneNumber,
      statusCode: 400,
      success: false,
    });
  });

  it('Should add feedback without phone and reason', async () => {
    const feedback = {
      branchName: 'test',
      emoji: FeedbackEmoji.happy,
    };

    const result = await createFeedbackService.createFeedback(feedback);

    expect(result).toEqual({
      message: successConstants.feedbackAddedSuccessfully,
      statusCode: 201,
      success: true,
    });
  });

  it('Should add feedback with phone and reason', async () => {
    const feedback = {
      branchName: 'test',
      emoji: FeedbackEmoji.satisfied,
      phone: '7410258963',
      reason: 'test-reason',
    };

    const result = await createFeedbackService.createFeedback(feedback);

    expect(result).toEqual({
      message: successConstants.feedbackAddedSuccessfully,
      statusCode: 201,
      success: true,
    });
  });
});
