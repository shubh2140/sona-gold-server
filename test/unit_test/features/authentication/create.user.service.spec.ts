import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import databaseModule from '../../../../src/core/configs/database.config';
import errorConstants from '../../../../src/core/constants/error.constants';
import successConstants from '../../../../src/core/constants/success.constants';
import User from '../../../../src/core/entities/user';
import { UserRole } from '../../../../src/core/enums/user.role.enum';
import CreateUserService from '../../../../src/features/authentication/services/create.user.service';

describe('Create user service test', () => {
  let createUserService: CreateUserService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [databaseModule, MikroOrmModule.forFeature([User])],
      providers: [CreateUserService],
    }).compile();

    createUserService = module.get(CreateUserService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('Should return user registered successfully', async () => {
    const userData = {
      role: UserRole.admin,
      userName: 'test',
      password: 'password',
    };
    const response = await createUserService.createUser(userData);
    expect(response).toEqual({
      message: successConstants.userRegisteredSuccessfully,
      statusCode: 201,
      success: true,
    });
  });

  /**
   * When try to insert the same user again, it must return user already exist.
   */
  it('Should return user already exist!', async () => {
    const userData = {
      role: UserRole.admin,
      userName: 'test',
      password: 'password',
    };
    const response = await createUserService.createUser(userData);
    expect(response).toEqual({
      message: errorConstants.userAlreadyExist,
      statusCode: 409,
      success: false,
    });
  });

  it('Should return user registered successfully with email', async () => {
    const userData = {
      email: 'user@example.com',
      role: UserRole.user,
      userName: 'user',
      password: 'password',
    };
    const response = await createUserService.createUser(userData);
    expect(response).toEqual({
      message: successConstants.userRegisteredSuccessfully,
      statusCode: 201,
      success: true,
    });
  });

  it('Should return user already exist with email', async () => {
    const userData = {
      email: 'user@example.com',
      role: UserRole.user,
      userName: 'user',
      password: 'password',
    };
    const response = await createUserService.createUser(userData);
    expect(response).toEqual({
      message: errorConstants.userAlreadyExist,
      statusCode: 409,
      success: false,
    });
  });
});
