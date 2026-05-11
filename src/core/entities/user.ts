import {
  Cascade,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { UserRole } from '../enums/user.role.enum';
import ExportedFeedbacks from './exported.feedbacks';

@Entity({ tableName: 'user' })
export default class User {
  @PrimaryKey({ type: 'int' })
  id: number;

  @Property({ type: 'datetime', name: 'created_at' })
  createdAt = new Date();

  @Property({ type: 'varchar', length: 256, nullable: true, unique: true })
  email: string;

  @Property({ type: 'varchar', length: 256, nullable: true, unique: true })
  phone: string;

  @Property({ type: 'varchar', length: 512 })
  password: string;

  @Enum(() => UserRole)
  role: UserRole;

  @Property({ type: 'varchar', length: 256, name: 'user_name' })
  userName: string;

  @Property({ type: 'boolean', default: false, name: 'is_logged' })
  isLogged: boolean;

  @Property({
    type: 'datetime',
    onUpdate: () => new Date(),
    name: 'updated_at',
  })
  updatedAt = new Date();

  // All all relations here

  /**
   * One user can export many feedback
   */
  @OneToMany(() => ExportedFeedbacks, 'user', {
    cascade: [Cascade.ALL],
  })
  feedbacks?: ExportedFeedbacks[];
}
