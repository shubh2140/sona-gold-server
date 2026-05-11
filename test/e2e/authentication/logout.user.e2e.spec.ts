import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import helmet from 'helmet';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import errorConstants from '../../../src/core/constants/error.constants';
import successConstants from '../../../src/core/constants/success.constants';
import { generateTestToken } from '../../../test/helpers/token.helper';

describe('Logout user E2E test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.use(helmet());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const routeUrl = '/auth/logout';

  it('Should return user not found', async () => {
    const payload = {
      id: 741,
    };

    const token = generateTestToken(payload);

    const response = await request(app.getHttpServer())
      .patch(routeUrl)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual({
      message: errorConstants.userNotFound,
      statusCode: 404,
      success: false,
    });
  });

  it('Should return user logged out successfully', async () => {
    const payload = {
      id: 4,
    };

    const token = generateTestToken(payload);

    const response = await request(app.getHttpServer())
      .patch(routeUrl)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toEqual({
      message: successConstants.userLoggedOutSuccessfully,
      statusCode: 201,
      success: true,
    });
  });
});
