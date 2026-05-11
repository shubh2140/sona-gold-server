require('dotenv').config();

const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  const tables = await client.query(
    "select table_name from information_schema.tables where table_schema = 'public' order by table_name",
  );
  const fks = await client.query(
    "select conname, conrelid::regclass::text as table_name, confrelid::regclass::text as references_table from pg_constraint where contype = 'f' order by conname",
  );

  console.log(tables.rows.map((row) => row.table_name).join('\n'));
  console.table(fks.rows);

  for (const tableName of ['user', 'users', 'feedback', 'exported_feedbacks']) {
    const columns = await client.query(
      "select column_name, data_type, is_nullable from information_schema.columns where table_schema = 'public' and table_name = $1 order by ordinal_position",
      [tableName],
    );
    console.log(`\n${tableName}`);
    console.table(columns.rows);
  }
  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
