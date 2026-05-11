import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import databaseModule from '../../../../src/core/configs/database.config';
import jwtModule from '../../../../src/core/configs/jwt.config';
import errorConstants from '../../../../src/core/constants/error.constants';
import successConstants from '../../../../src/core/constants/success.constants';
import User from '../../../../src/core/entities/user';
import LoginUserService from '../../../../src/features/authentication/services/login.user.service';

describe('Login user service test', () => {
  let loginUserService: LoginUserService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [databaseModule, jwtModule, MikroOrmModule.forFeature([User])],
      providers: [LoginUserService],
    }).compile();

    loginUserService = module.get(LoginUserService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('Should return user not found!', async () => {
    const userData = {
      identifier: 'notCreatedUser',
      password: 'password',
    };
    const response = await loginUserService.loginUser(userData);
    expect(response).toEqual({
      message: errorConstants.userNotFound,
      statusCode: 404,
      success: false,
    });
  });

  it('Should return invalid identifier or password', async () => {
    const userData = {
      identifier: 'test',
      password: 'wrongPassword',
    };
    const response = await loginUserService.loginUser(userData);
    expect(response).toEqual({
      message: errorConstants.invalidIdentifierOrPassword,
      statusCode: 401,
      success: false,
    });
  });

  it('Should return user logged in successfully', async () => {
    const userData = {
      identifier: 'naufal123',
      password: 'password',
    };
    const response = await loginUserService.loginUser(userData);
    expect(response.message).toEqual(successConstants.userLoggedInSuccessfully);
    expect(response.statusCode).toEqual(201);
    expect(response.success).toEqual(true);
  });
});
