import { Migration } from '@mikro-orm/migrations';

export class Migration20251110104012 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table [feedback] alter column [created_at] nvarchar(max);`,
    );
    this.addSql(
      `alter table [feedback] alter column [updated_at] nvarchar(max);`,
    );

    this.addSql(`alter table [user] alter column [created_at] nvarchar(max);`);
    this.addSql(`alter table [user] alter column [updated_at] nvarchar(max);`);

    this.addSql(
      `alter table [exported_feedbacks] alter column [created_at] nvarchar(max);`,
    );
    this.addSql(
      `alter table [exported_feedbacks] alter column [updated_at] nvarchar(max);`,
    );

    this.addSql(
      `alter table [feedback] alter column [created_at] datetime2 not null;`,
    );
    this.addSql(
      `alter table [feedback] alter column [updated_at] datetime2 not null;`,
    );

    this.addSql(
      `alter table [user] alter column [created_at] datetime2 not null;`,
    );
    this.addSql(
      `alter table [user] alter column [updated_at] datetime2 not null;`,
    );

    this.addSql(
      `alter table [exported_feedbacks] alter column [created_at] datetime2 not null;`,
    );
    this.addSql(
      `alter table [exported_feedbacks] alter column [updated_at] datetime2 not null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table [feedback] alter column [created_at] nvarchar(max);`,
    );
    this.addSql(
      `alter table [feedback] alter column [updated_at] nvarchar(max);`,
    );

    this.addSql(`alter table [user] alter column [created_at] nvarchar(max);`);
    this.addSql(`alter table [user] alter column [updated_at] nvarchar(max);`);

    this.addSql(
      `alter table [exported_feedbacks] alter column [created_at] nvarchar(max);`,
    );
    this.addSql(
      `alter table [exported_feedbacks] alter column [updated_at] nvarchar(max);`,
    );

    this.addSql(
      `alter table [feedback] alter column [created_at] date not null;`,
    );
    this.addSql(
      `alter table [feedback] alter column [updated_at] date not null;`,
    );

    this.addSql(`alter table [user] alter column [created_at] date not null;`);
    this.addSql(`alter table [user] alter column [updated_at] date not null;`);

    this.addSql(
      `alter table [exported_feedbacks] alter column [created_at] date not null;`,
    );
    this.addSql(
      `alter table [exported_feedbacks] alter column [updated_at] date not null;`,
    );
  }
}
