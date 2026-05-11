import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import ExportedFeedbacks from '../../core/entities/exported.feedbacks';
import Feedback from '../../core/entities/feedback';
import User from '../../core/entities/user';
import AdminController from './admin.controller';
import DeleteUserByIdService from './services/delete.user.by.id.service';
import ExportFeedbackService from './services/export.feedback.service';
import GetAllFeedbacksService from './services/get.all.feedbacks.service';
import GetEmojiCountWithDateRangeService from './services/get.emoji.count.with.date.range.service';
import GetEachEmojiCountService from './services/get.each.emoji.count.service';

@Module({
  imports: [MikroOrmModule.forFeature([User, ExportedFeedbacks, Feedback])],
  controllers: [AdminController],
  providers: [
    DeleteUserByIdService,
    ExportFeedbackService,
    GetAllFeedbacksService,
    GetEachEmojiCountService,
    GetEmojiCountWithDateRangeService,
  ],
})
export default class AdminModule {}
