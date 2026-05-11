import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import databaseModule from '../../../../src/core/configs/database.config';
import errorConstants from '../../../../src/core/constants/error.constants';
import successConstants from '../../../../src/core/constants/success.constants';
import Feedback from '../../../../src/core/entities/feedback';
import User from '../../../../src/core/entities/user';
import GetAllFeedbacksService from '../../../../src/features/admin/services/get.all.feedbacks.service';
import ExportedFeedbacks from '../../../../src/core/entities/exported.feedbacks';

describe('Get all feedbacks service test', () => {
  let getAllFeedbacksService: GetAllFeedbacksService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [databaseModule, MikroOrmModule.forFeature([User, Feedback, ExportedFeedbacks])],
      providers: [GetAllFeedbacksService],
    }).compile();

    getAllFeedbacksService = module.get(GetAllFeedbacksService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('Should return user not found', async () => {
    const result = await getAllFeedbacksService.getAllFeedbacks(200);

    expect(result).toEqual({
      message: errorConstants.userNotFound,
      statusCode: 404,
      success: false,
    });
  });

  it('Should return unauthorized', async () => {
    const result = await getAllFeedbacksService.getAllFeedbacks(3);

    expect(result).toEqual({
      message: errorConstants.unauthorized,
      statusCode: 403,
      success: false,
    });
  });

  it('Should return all feedbacks', async () => {
    const result = await getAllFeedbacksService.getAllFeedbacks(2, 1, 2);

    const feedbacks = [
      {
        createdAt: '2025-10-29',
        branchName: 'test',
        emoji: 'Happy',
        reason: null,
        mobileNumber: null,
        updatedAt: '2025-10-29',
        id: 1,
      },
      {
        createdAt: '2025-10-29',
        branchName: 'test',
        emoji: 'Satisfied',
        reason: 'test-reason',
        mobileNumber: '7410258963',
        updatedAt: '2025-10-29',
        id: 2,
      },
    ];

    expect(result).toEqual({
      data: feedbacks,
      message: successConstants.feedbacksFetchedSuccessfully,
      statusCode: 200,
      success: true,
    });
  });

  it('Should return empty feedbacks', async () => {
    const result = await getAllFeedbacksService.getAllFeedbacks(2, 50);

    const feedbacks = [];

    expect(result).toEqual({
      data: feedbacks,
      message: successConstants.feedbacksFetchedSuccessfully,
      statusCode: 200,
      success: true,
    });
  });
});
