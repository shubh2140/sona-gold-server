/* eslint-disable prettier/prettier */
import {
    BadRequestException,
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import helmet from 'helmet';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import errorConstants from '../../../src/core/constants/error.constants';
import successConstants from '../../../src/core/constants/success.constants';

describe('Login user E2E test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        disableErrorMessages: true,
        exceptionFactory: (errors) => {
          if (errors.length > 0) {
            return new BadRequestException({
              message: 'Validation error',
              statusCode: 400,
              success: false,
            });
          }
        },
      }),
    );
    app.use(helmet());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const routeUrl = '/auth/login';

  it('Should return validation error', async () => {
    const payload = {
      identifier: 'test',
      password: 'pass',
    };

    const response = await request(app.getHttpServer())
      .patch(routeUrl)
      .send(payload);

    expect(response.body).toEqual({
      message: 'Validation error',
      statusCode: 400,
      success: false,
    });
  });

  it('Should return user not found', async () => {
    const payload = {
      identifier: 'notCreatedUser',
      password: 'password',
    };

    const response = await request(app.getHttpServer())
      .patch(routeUrl)
      .send(payload);

    expect(response.body).toEqual({
      message: errorConstants.userNotFound,
      statusCode: 404,
      success: false,
    });
  });

  it('Should return invalid identifier or password', async () => {
    const payload = {
      identifier: 'test',
      password: 'wrongPassword',
    };

    const response = await request(app.getHttpServer())
      .patch(routeUrl)
      .send(payload);

    expect(response.body).toEqual({
      message: errorConstants.invalidIdentifierOrPassword,
      statusCode: 401,
      success: false,
    });
  });

  it('Should return user logged in successfully', async () => {
    const payload = {
      identifier: 'naufal123',
      password: 'password',
    };

    const response = await request(app.getHttpServer())
      .patch(routeUrl)
      .send(payload);

    expect(response.body.message).toEqual(
      successConstants.userLoggedInSuccessfully,
    );
  });
});
