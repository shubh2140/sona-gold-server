import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import databaseModule from '../../../../src/core/configs/database.config';
import successConstants from '../../../../src/core/constants/success.constants';
import Feedback from '../../../../src/core/entities/feedback';
import User from '../../../../src/core/entities/user';
import { FeedbackExportType } from '../../../../src/core/enums/feedback.export.type.enum';
import ExportFeedbackService from '../../../../src/features/admin/services/export.feedback.service';
import FeedbackEventsService from '../../../../src/features/events/services/feedback.events.service';

describe('Export feedback service test', () => {
  let exportFeedbackService: ExportFeedbackService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        databaseModule,
        EventEmitterModule.forRoot(),
        MikroOrmModule.forFeature([User, Feedback]),
      ],
      providers: [ExportFeedbackService, FeedbackEventsService],
    }).compile();

    exportFeedbackService = module.get(ExportFeedbackService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('Should return feedback created successfully', async () => {
    const result = await exportFeedbackService.export(
      2,
      FeedbackExportType.excel,
    );

    expect(result).toEqual({
      message: successConstants.feedbackExportedSuccessfully,
      statusCode: 201,
      success: true,
    });
  });
});
