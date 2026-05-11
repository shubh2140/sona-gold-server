import {
  Cascade,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import User from './user';

@Entity({ tableName: 'exported_feedbacks' })
export default class ExportedFeedbacks {
  @PrimaryKey({ type: 'int' })
  id: number;

  @Property({ type: 'datetime', name: 'created_at' })
  createdAt = new Date();

  @Property({ type: 'varchar', length: 1000, name: 'feedback_url' })
  feedbackUrl: string;

  // Format of feedback, Example: excel, pdf, ...
  @Property({ type: 'varchar', length: 256 })
  format: string;

  @Property({
    type: 'datetime',
    onUpdate: () => new Date(),
    name: 'updated_at',
  })
  updatedAt = new Date();

  // Add all relations here

  /**
   * Many feedbacks belongs to a user
   */
  @ManyToOne(() => User, { cascade: [Cascade.ALL], referenceColumnName: 'id' })
  user?: User;
}
