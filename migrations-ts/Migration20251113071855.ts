import { Migration } from '@mikro-orm/migrations';

export class Migration20251113071855 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table [feedback] add [customer_name] varchar(256) null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `declare @constraint0 varchar(100) = (select default_constraints.name from sys.all_columns join sys.tables on all_columns.object_id = tables.object_id join sys.schemas on tables.schema_id = schemas.schema_id join sys.default_constraints on all_columns.default_object_id = default_constraints.object_id where schemas.name = 'dbo' and tables.name = 'feedback' and all_columns.name = 'customer_name') if @constraint0 is not null exec('alter table [feedback] drop constraint ' + @constraint0);`,
    );
    this.addSql(`alter table [feedback] drop column [customer_name];`);
  }
}
