import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FeedbackEmoji } from '../enums/feedback.enum';

export default class CreateFeedbackDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  branchName: string;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiProperty({ enum: FeedbackEmoji })
  @IsEnum(FeedbackEmoji)
  emoji: FeedbackEmoji;

  @ApiProperty({ type: 'string', nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ type: 'string', nullable: true })
  @IsOptional()
  @IsString()
  reason?: string;
}
