import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import databaseModule from '../../../../src/core/configs/database.config';
import errorConstants from '../../../../src/core/constants/error.constants';
import successConstants from '../../../../src/core/constants/success.constants';
import Feedback from '../../../../src/core/entities/feedback';
import User from '../../../../src/core/entities/user';
import GetEachEmojiCountService from '../../../../src/features/admin/services/get.each.emoji.count.service';

describe('Get each emoji count service test', () => {
  let getEachEmojiCountService: GetEachEmojiCountService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [databaseModule, MikroOrmModule.forFeature([User, Feedback])],
      providers: [GetEachEmojiCountService],
    }).compile();
    getEachEmojiCountService = module.get(GetEachEmojiCountService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('Should return user not found', async () => {
    const result = await getEachEmojiCountService.getCount(254);

    expect(result).toEqual({
      message: errorConstants.userNotFound,
      statusCode: 404,
      success: false,
    });
  });

  it('Should return unauthorized', async () => {
    const result = await getEachEmojiCountService.getCount(3);

    expect(result).toEqual({
      message: errorConstants.unauthorized,
      statusCode: 403,
      success: false,
    });
  });

  it('Should return count of emoji with date range', async () => {
    const result = await getEachEmojiCountService.getCount(2);

    expect(result).toEqual({
      data: [
        { emoji: 'Happy', count: 2 },
        { emoji: 'Very Happy', count: 2 },
        { emoji: 'Satisfied', count: 2 },
      ],
      message: successConstants.feedbackCountFetchedSuccessfully,
      statusCode: 200,
      success: true,
    });
  });
});
