import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import databaseModule from '../../../../src/core/configs/database.config';
import errorConstants from '../../../../src/core/constants/error.constants';
import successConstants from '../../../../src/core/constants/success.constants';
import User from '../../../../src/core/entities/user';
import LogoutUserService from '../../../../src/features/authentication/services/logout.user.service';

describe('Logout user service test', () => {
  let logoutUserService: LogoutUserService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [databaseModule, MikroOrmModule.forFeature([User])],
      providers: [LogoutUserService],
    }).compile();

    logoutUserService = module.get(LogoutUserService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('Should return user not found!', async () => {
    const userId = 256;
    const response = await logoutUserService.logoutUser(userId);
    expect(response).toEqual({
      message: errorConstants.userNotFound,
      statusCode: 404,
      success: false,
    });
  });

  it('Should return user logged out successfully', async () => {
    const userId = 2;
    const response = await logoutUserService.logoutUser(userId);
    expect(response).toEqual({
      message: successConstants.userLoggedOutSuccessfully,
      statusCode: 201,
      success: true,
    });
  });
});
