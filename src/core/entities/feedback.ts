import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { FeedbackEmoji } from '../enums/feedback.enum';

@Entity({ tableName: 'feedback' })
export default class Feedback {
  @PrimaryKey({ type: 'int' })
  id: number;

  @Property({ type: 'datetime', name: 'created_at' })
  createdAt = new Date();

  @Property({ type: 'varchar', length: 256, name: 'branch_name' })
  branchName: string;

  @Property({
    type: 'varchar',
    length: 256,
    name: 'customer_name',
    nullable: true,
  })
  customerName: string | null;

  @Enum(() => FeedbackEmoji)
  emoji: FeedbackEmoji;

  @Property({ type: 'varchar', length: 256, nullable: true })
  reason: string | null;

  @Property({ type: 'varchar', length: 256, nullable: true })
  mobileNumber: string | null;

  @Property({
    type: 'datetime',
    onUpdate: () => new Date(),
    name: 'updated_at',
  })
  updatedAt = new Date();
}
