import {
  INestApplication
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import errorConstants from '../../../src/core/constants/error.constants';
import successConstants from '../../../src/core/constants/success.constants';
import { generateTestToken } from '../../../test/helpers/token.helper';

describe('Delete user by id E2E test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const routeUrl = '/user/delete';

  it('Should return validation exception', async () => {
    const appendUrl = routeUrl.concat('/4a');

    const token = generateTestToken({ id: 3, role: 'admin' });

    const response = await request(app.getHttpServer())
      .delete(appendUrl)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual({
      message: 'Validation failed',
      statusCode: 400,
      success: false,
    });
  });

  it('Should return forbidden resource exception', async () => {
    const appendUrl = routeUrl.concat('/6');

    const token = generateTestToken({ id: 3, role: 'user' });

    const response = await request(app.getHttpServer())
      .delete(appendUrl)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual({
      message: 'Forbidden resource',
      statusCode: 403,
      error: 'Forbidden',
    });
  });

  it('Should return admin not found', async () => {
    const appendUrl = routeUrl.concat('/6');

    const token = generateTestToken({ id: 300, role: 'admin' });

    const response = await request(app.getHttpServer())
      .delete(appendUrl)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual({
      message: errorConstants.userNotFound,
      statusCode: 404,
      success: false,
    });
  });

  it('Should return unauthorized', async () => {
    const appendUrl = routeUrl.concat('/6');

    const token = generateTestToken({ id: 3, role: 'admin' });

    const response = await request(app.getHttpServer())
      .delete(appendUrl)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual({
      message: errorConstants.unauthorized,
      statusCode: 403,
      success: false,
    });
  });

  it('Should return user not found', async () => {
    const appendUrl = routeUrl.concat('/600');

    const token = generateTestToken({ id: 2, role: 'admin' });

    const response = await request(app.getHttpServer())
      .delete(appendUrl)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual({
      message: errorConstants.userNotFound,
      statusCode: 404,
      success: false,
    });
  });

  it('Should return user deleted successfully', async () => {
    const appendUrl = routeUrl.concat('/3');

    const token = generateTestToken({ id: 2, role: 'admin' });

    const response = await request(app.getHttpServer())
      .delete(appendUrl)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual({
      message: successConstants.userDeletedSuccessfully,
      statusCode: 200,
      success: true,
    });
  });
});
