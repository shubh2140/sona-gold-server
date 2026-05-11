import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Res,
} from '@nestjs/common';
import express from 'express';
import CreateFeedbackDto from '../../core/dto/create.feedback.dto';
import CreateFeedbackService from './services/create.feedback.service';

@Controller('feedback')
export default class FeedbackController {
  constructor(private readonly createFeedbackService: CreateFeedbackService) {}

  @Post('create')
  async createFeedback(
    @Body() body: CreateFeedbackDto,
    @Res() res: express.Response,
  ) {
    try {
      const result = await this.createFeedbackService.createFeedback(body);
      return res.status(result.statusCode).send(result);
    } catch (error) {
      throw new InternalServerErrorException({
        message: error.message,
        statusCode: 500,
        success: false,
      });
    }
  }
}
