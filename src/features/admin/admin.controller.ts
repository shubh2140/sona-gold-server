import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import express from 'express';
import { Roles } from '../../core/decorators/user.role.decorator';
import { FeedbackEmoji } from '../../core/enums/feedback.enum';
import { FeedbackExportType } from '../../core/enums/feedback.export.type.enum';
import { UserRole } from '../../core/enums/user.role.enum';
import AdminRBACGuard from '../../core/guards/admin.rbac.guard';
import TokenGuard from '../../core/guards/token.guard';
import DeleteUserByIdService from './services/delete.user.by.id.service';
import ExportFeedbackService from './services/export.feedback.service';
import GetAllFeedbacksService from './services/get.all.feedbacks.service';
import GetEmojiCountWithDateRangeService from './services/get.emoji.count.with.date.range.service';
import GetEachEmojiCountService from './services/get.each.emoji.count.service';

/**
 * All routes under this controller is protected with Admin role and, Bearer token authentication
 */
@ApiBearerAuth()
@UseGuards(TokenGuard, AdminRBACGuard)
@Roles(UserRole.admin)
@Controller()
export default class AdminController {
  constructor(
    private readonly deleteUserByIdService: DeleteUserByIdService,
    private readonly exportFeedbackService: ExportFeedbackService,
    private readonly getAllFeedbacksService: GetAllFeedbacksService,
    private readonly getEachEmojiCountService: GetEachEmojiCountService,
    private readonly getEmojiCountWithDateRangeService: GetEmojiCountWithDateRangeService,
  ) {}

  /**
   * Endpoint to delete the user by their id
   *
   * @param userId Id number of user to delete
   */
  @Delete('user/delete/:userId')
  async deleteUser(
    @Param(
      'userId',
      new ParseIntPipe({
        exceptionFactory: (_) => {
          throw new BadRequestException({
            message: 'Validation failed',
            statusCode: 400,
            success: false,
          });
        },
        // If the input is undefined ?, ignore the validation.
        optional: true,
      }),
    )
    userId: number,
    @Request() req,
    @Res() res: express.Response,
  ) {
    try {
      const result = await this.deleteUserByIdService.deleteUser(
        req.user.id,
        userId,
      );
      return res.status(result.statusCode).send(result);
    } catch (error) {
      throw new InternalServerErrorException({
        message: error.message,
        statusCode: 500,
        success: false,
      });
    }
  }

  /**
   * Endpoint to export feedback.
   *
   * @param format Format to export the feedback
   */
  @Get('export/feedback/:format')
  async exportFeedback(
    @Param(
      'format',
      new ParseEnumPipe(FeedbackExportType, {
        exceptionFactory: (_) => {
          throw new BadRequestException({
            message: 'Validation failed',
            statusCode: 400,
            success: false,
          });
        },
      }),
    )
    format: FeedbackExportType,
    @Request() req,
    @Res() res: express.Response,
  ) {
    try {
      const result = await this.exportFeedbackService.export(
        req.user.id,
        format,
      );
      return res.status(result.statusCode).send(result);
    } catch (error) {
      throw new InternalServerErrorException({
        message: error.message,
        statusCode: 500,
        success: false,
      });
    }
  }

  /**
   * Endpoint to get all feedbacks.
   *
   * @param page Pagination support. Defaults to 1
   * @param limit Limits the query result to 20 by Default.
   */
  @Get('feedbacks')
  async getAllFeedbacks(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Request() req,
    @Res() res: express.Response,
  ) {
    try {
      const result = await this.getAllFeedbacksService.getAllFeedbacks(
        req.user.id,
        page ?? 1,
        limit ?? 20,
      );
      return res.status(result.statusCode).send(result);
    } catch (error) {
      throw new InternalServerErrorException({
        message: error.message,
        statusCode: 500,
        success: false,
      });
    }
  }

  @Get('emoji/count/all')
  async getEachEmojiCount(@Request() req, @Res() res: express.Response) {
    try {
      const result = await this.getEachEmojiCountService.getCount(req.user.id);
      return res.status(result.statusCode).send(result);
    } catch (error) {
      throw new InternalServerErrorException({
        message: error.message,
        statusCode: 500,
        success: false,
      });
    }
  }

  /**
   * Endpoint to filter emoji count with Date range
   *
   * @param dateRange Date range to filter the query. Assumes in format of **'11-10-2020,12-10-2020'**
   * @param emoji Type of emoji to get count
   */
  @Get('emoji/count/:dateRange/:emoji')
  async getEmojiCount(
    @Param('dateRange') dateRange: string,
    @Param(
      'emoji',
      new ParseEnumPipe(FeedbackEmoji, {
        exceptionFactory: (_) => {
          throw new BadRequestException({
            message: 'Validation failed',
            statusCode: 400,
            success: false,
          });
        },
      }),
    )
    emoji: FeedbackEmoji,
    @Request() req,
    @Res() res: express.Response,
  ) {
    try {
      const result = await this.getEmojiCountWithDateRangeService.getCount(
        req.user.id,
        dateRange,
        emoji,
      );
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
