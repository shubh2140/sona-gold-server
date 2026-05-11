import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import errorConstants from '../../../src/core/constants/error.constants';
import successConstants from '../../../src/core/constants/success.constants';
import { generateTestToken } from '../../../test/helpers/token.helper';

describe('Get each emoji count E2E test', () => {
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

  const routeUrl = '/emoji/count/all';

  it('Should return forbidden resource exception', async () => {
    const token = generateTestToken({ id: 3, role: 'user' });

    const response = await request(app.getHttpServer())
      .get(routeUrl)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual({
      message: 'Forbidden resource',
      statusCode: 403,
      error: 'Forbidden',
    });
  });

  it('Should return user unauthorized', async () => {
    const token = generateTestToken({ id: 3, role: 'admin' });

    const response = await request(app.getHttpServer())
      .get(routeUrl)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual({
      message: errorConstants.unauthorized,
      statusCode: 403,
      success: false,
    });
  });

  it('Should return feedback count fetched successfully', async () => {
    const token = generateTestToken({ id: 2, role: 'admin' });

    const response = await request(app.getHttpServer())
      .get(routeUrl)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual({
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
