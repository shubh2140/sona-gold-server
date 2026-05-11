import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import databaseModule from '../../../../src/core/configs/database.config';
import errorConstants from '../../../../src/core/constants/error.constants';
import successConstants from '../../../../src/core/constants/success.constants';
import User from '../../../../src/core/entities/user';
import DeleteUserByIdService from '../../../../src/features/admin/services/delete.user.by.id.service';

describe('Delete user by id service test', () => {
  let deleteUserByIdService: DeleteUserByIdService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [databaseModule, MikroOrmModule.forFeature([User])],
      providers: [DeleteUserByIdService],
    }).compile();

    deleteUserByIdService = module.get(DeleteUserByIdService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('Should return admin not found', async () => {
    const result = await deleteUserByIdService.deleteUser(100, 5);

    expect(result).toEqual({
      message: errorConstants.userNotFound,
      statusCode: 404,
      success: false,
    });
  });

  it('Should return unauthorized', async () => {
    const result = await deleteUserByIdService.deleteUser(3, 5);

    expect(result).toEqual({
      message: errorConstants.unauthorized,
      statusCode: 403,
      success: false,
    });
  });

  it('Should return user not found', async () => {
    const result = await deleteUserByIdService.deleteUser(2, 500);

    expect(result).toEqual({
      message: errorConstants.userNotFound,
      statusCode: 404,
      success: false,
    });
  });

  it('Should return user deleted successfully', async () => {
    const result = await deleteUserByIdService.deleteUser(2, 5);

    expect(result).toEqual({
      message: successConstants.userDeletedSuccessfully,
      statusCode: 200,
      success: true,
    });
  });
});
