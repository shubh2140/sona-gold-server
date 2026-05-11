/* eslint-disable prettier/prettier */
import {
    BadRequestException,
    INestApplication,
    ParseIntPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import errorConstants from '../../../src/core/constants/error.constants';
import successConstants from '../../../src/core/constants/success.constants';
import { generateTestToken } from '../../../test/helpers/token.helper';

describe('Get all feedbacks E2E test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ParseIntPipe({
        exceptionFactory: (_) => {
          throw new BadRequestException({
            message: 'Validation failed',
            statusCode: 400,
            success: false,
          });
        },
        optional: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const routeUrl = '/feedbacks';

  it('Should return validation exception', async () => {
    const appendUrl = routeUrl.concat('?page=1&limit=4a');

    const token = generateTestToken({ id: 3, role: 'admin' });

    const response = await request(app.getHttpServer())
      .get(appendUrl)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual({
      message: 'Validation failed',
      statusCode: 400,
      success: false,
    });
  });

  it('Should return forbidden resource exception', async () => {
    const appendUrl = routeUrl.concat('?page=1&limit=4');

    const token = generateTestToken({ id: 3, role: 'user' });

    const response = await request(app.getHttpServer())
      .get(appendUrl)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual({
      message: 'Forbidden resource',
      statusCode: 403,
      error: 'Forbidden',
    });
  });

  it('Should return user unauthorized', async () => {
    const appendUrl = routeUrl.concat('?page=1');

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

  it('Should return all feedbacks', async () => {
    const appendUrl = routeUrl.concat('?limit=1');

    const token = generateTestToken({ id: 5, role: 'admin' });

    const response = await request(app.getHttpServer())
      .get(appendUrl)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual({
      data: [
        {
          createdAt: '2025-10-29',
          branchName: 'test',
          emoji: 'Happy',
          reason: null,
          mobileNumber: null,
          updatedAt: '2025-10-29',
          id: 1,
        },
      ],
      message: successConstants.feedbacksFetchedSuccessfully,
      statusCode: 200,
      success: true,
    });
  });
});
