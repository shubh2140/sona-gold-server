import { Migration } from '@mikro-orm/migrations';

export class Migration20251104082136 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `CREATE TABLE [feedback] ([id] int identity(1,1) not null primary key, [created_at] date not null, [branch_name] varchar(256) not null, [emoji] nvarchar(100) check ([emoji] in ('Happy', 'Very Happy', 'Satisfied', 'Unsatisfied')) not null, [reason] varchar(256) null, [mobile_number] varchar(256) null, [updated_at] date not null);`,
    );

    this.addSql(
      `CREATE TABLE [user] ([id] int identity(1,1) not null primary key, [created_at] date not null, [email] varchar(256) null, [phone] varchar(256) null, [password] varchar(512) not null, [role] nvarchar(100) check ([role] in ('admin', 'user')) not null, [user_name] varchar(256) not null, [is_logged] bit not null CONSTRAINT [user_is_logged_default] DEFAULT 0, [updated_at] date not null);`,
    );
    this.addSql(
      `CREATE UNIQUE INDEX [user_email_unique] ON [user] ([email]) WHERE [email] IS NOT NULL;`,
    );
    this.addSql(
      `CREATE UNIQUE INDEX [user_phone_unique] ON [user] ([phone]) WHERE [phone] IS NOT NULL;`,
    );

    this.addSql(
      `CREATE TABLE [exported_feedbacks] ([id] int identity(1,1) not null primary key, [created_at] date not null, [feedback_url] varchar(1000) not null, [format] varchar(256) not null, [updated_at] date not null, [user_id] int null);`,
    );

    this.addSql(
      `alter table [exported_feedbacks] add constraint [exported_feedbacks_user_id_foreign] foreign key ([user_id]) references [user] ([id]) on update cascade on delete cascade;`,
    );
  }
}
