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

describe('Create user E2E test', () => {
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

  const routeUrl = '/auth/create';

  it('Should return validation error', async () => {
    const payload = {
      userName: '',
      password: 'password',
      role: 'admin',
    };

    const response = await request(app.getHttpServer())
      .post(routeUrl)
      .send(payload);

    expect(response.body).toEqual({
      message: 'Validation error',
      statusCode: 400,
      success: false,
    });
  });

  it('Should return user already exist', async () => {
    const payload = {
      userName: 'test',
      password: 'password',
      role: 'admin',
    };

    const response = await request(app.getHttpServer())
      .post(routeUrl)
      .send(payload);

    expect(response.body).toEqual({
      message: errorConstants.userAlreadyExist,
      statusCode: 409,
      success: false,
    });
  });

  it('Should return user registered successfully', async () => {
    const payload = {
      userName: 'naufal123',
      password: 'password',
      role: 'admin',
    };

    const response = await request(app.getHttpServer())
      .post(routeUrl)
      .send(payload);

    expect(response.body).toEqual({
      message: successConstants.userRegisteredSuccessfully,
      statusCode: 201,
      success: true,
    });
  });
});
