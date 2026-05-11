import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import errorConstants from '../../../src/core/constants/error.constants';
import successConstants from '../../../src/core/constants/success.constants';
import { generateTestToken } from '../../../test/helpers/token.helper';

describe('Export feedback E2E test', () => {
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

  const routeUrl = '/export/feedback';

  it('Should return validation failed', async () => {
    const appendUrl = routeUrl.concat('/xlsx');

    const token = generateTestToken({ id: 2, role: 'admin' });

    const response = await request(app.getHttpServer())
      .get(appendUrl)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual({
      message: 'Validation failed',
      statusCode: 400,
      success: false,
    });
  });

  it('Should return user not found', async () => {
    const appendUrl = routeUrl.concat('/pdf');

    const token = generateTestToken({ id: 200, role: 'admin' });

    const response = await request(app.getHttpServer())
      .get(appendUrl)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual({
      message: errorConstants.userNotFound,
      statusCode: 404,
      success: false,
    });
  });

  it('Should return unauthorized', async () => {
    const appendUrl = routeUrl.concat('/pdf');

    const token = generateTestToken({ id: 3, role: 'admin' });

    const response = await request(app.getHttpServer())
      .get(appendUrl)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual({
      message: errorConstants.unauthorized,
      statusCode: 403,
      success: false,
    });
  });

  it('Should export all feedback to an xlsx file', async () => {
    const appendUrl = routeUrl.concat('/excel');

    const token = generateTestToken({ id: 2, role: 'admin' });

    const response = await request(app.getHttpServer())
      .get(appendUrl)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual({
      message: successConstants.feedbackExportedSuccessfully,
      statusCode: 201,
      success: true,
    });
  });
});
