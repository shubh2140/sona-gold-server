/* eslint-disable prettier/prettier */
import {
    BadRequestException,
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import errorConstants from '../../../src/core/constants/error.constants';
import successConstants from '../../../src/core/constants/success.constants';

describe('Create feedback E2E test', () => {
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
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const routeUrl = '/feedback/create';

  it('Should return validation error', async () => {
    const payload = {
      emoji: 'satisfied',
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

  it('Should return please enter phone and reason', async () => {
    const payload = {
      branchName: 'test-branch',
      emoji: 'Satisfied',
    };
    const response = await request(app.getHttpServer())
      .post(routeUrl)
      .send(payload);

    expect(response.body).toEqual({
      message: errorConstants.pleaseEnterPhoneNumberAndReason,
      statusCode: 400,
      success: false,
    });
  });

  it('Should add feedback with phone and reason', async () => {
    const payload = {
      branchName: 'test-branch',
      emoji: 'Satisfied',
      phone: '9874563210',
      reason: 'test-e2e-reason',
    };
    const response = await request(app.getHttpServer())
      .post(routeUrl)
      .send(payload);

    expect(response.body).toEqual({
      message: successConstants.feedbackAddedSuccessfully,
      statusCode: 201,
      success: true,
    });
  });

  it('Should add feedback with customerName and without reason', async () => {
    const payload = {
      branchName: 'test-branch-e2e',
      customerName: 'User',
      emoji: 'Very Happy',
      phone: '9874563210',
    };
    const response = await request(app.getHttpServer())
      .post(routeUrl)
      .send(payload);

    expect(response.body).toEqual({
      message: successConstants.feedbackAddedSuccessfully,
      statusCode: 201,
      success: true,
    });
  });
});
