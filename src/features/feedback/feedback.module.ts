import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import Feedback from '../../core/entities/feedback';
import FeedbackController from './feedback.controller';
import CreateFeedbackService from './services/create.feedback.service';

@Module({
  imports: [MikroOrmModule.forFeature([Feedback])],
  controllers: [FeedbackController],
  providers: [CreateFeedbackService],
})
export default class FeedbackModule {}
