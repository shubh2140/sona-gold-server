import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import databaseModule from '../../../../src/core/configs/database.config';
import errorConstants from '../../../../src/core/constants/error.constants';
import successConstants from '../../../../src/core/constants/success.constants';
import Feedback from '../../../../src/core/entities/feedback';
import User from '../../../../src/core/entities/user';
import { FeedbackEmoji } from '../../../../src/core/enums/feedback.enum';
import GetEmojiCountWithDateRangeService from '../../../../src/features/admin/services/get.emoji.count.with.date.range.service';

describe('Get emoji count with date range service test', () => {
  let getEmojiCountWithDateRangeService: GetEmojiCountWithDateRangeService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [databaseModule, MikroOrmModule.forFeature([User, Feedback])],
      providers: [GetEmojiCountWithDateRangeService],
    }).compile();
    getEmojiCountWithDateRangeService = module.get(
      GetEmojiCountWithDateRangeService,
    );
  });

  afterAll(async () => {
    await module.close();
  });

  it('Should return user not found', async () => {
    const result = await getEmojiCountWithDateRangeService.getCount(
      254,
      '11-20-2020-12-20-2020',
      FeedbackEmoji.happy,
    );

    expect(result).toEqual({
      message: errorConstants.userNotFound,
      statusCode: 404,
      success: false,
    });
  });

  it('Should return unauthorized', async () => {
    const result = await getEmojiCountWithDateRangeService.getCount(
      3,
      '11-20-2020-12-20-2020',
      FeedbackEmoji.happy,
    );

    expect(result).toEqual({
      message: errorConstants.unauthorized,
      statusCode: 403,
      success: false,
    });
  });

  it('Should return count of emoji with date range', async () => {
    const result = await getEmojiCountWithDateRangeService.getCount(
      2,
      '2025-10-29,2025-10-29',
      FeedbackEmoji.satisfied,
    );

    expect(result).toEqual({
      data: { count: 2 },
      message: successConstants.feedbackCountFetchedSuccessfully,
      statusCode: 200,
      success: true,
    });
  });
});
