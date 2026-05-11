require('dotenv').config();

const argon2 = require('argon2');
const { Client } = require('pg');

const users = [
  {
    email: 'admin@sonagold.test',
    userName: 'admin_demo',
    password: '12345678',
    role: 'admin',
  },
  {
    email: 'staff@sonagold.test',
    userName: 'staff_demo',
    password: '12345678',
    role: 'user',
  },
];

const feedbacks = [
  {
    branchName: 'MG Road',
    customerName: 'Aarav Sharma',
    emoji: 'Very Happy',
    reason: null,
    mobileNumber: null,
  },
  {
    branchName: 'MG Road',
    customerName: 'Neha Patel',
    emoji: 'Happy',
    reason: null,
    mobileNumber: null,
  },
  {
    branchName: 'City Center',
    customerName: 'Rohan Mehta',
    emoji: 'Satisfied',
    reason: 'Billing took longer than expected',
    mobileNumber: '9876543210',
  },
  {
    branchName: 'City Center',
    customerName: 'Priya Nair',
    emoji: 'Unsatisfied',
    reason: 'Needed more design options',
    mobileNumber: '9876501234',
  },
  {
    branchName: 'Airport Road',
    customerName: 'Karan Shah',
    emoji: 'Very Happy',
    reason: null,
    mobileNumber: null,
  },
  {
    branchName: 'Airport Road',
    customerName: 'Meera Iyer',
    emoji: 'Happy',
    reason: null,
    mobileNumber: null,
  },
  {
    branchName: 'Ring Road',
    customerName: 'Vikram Rao',
    emoji: 'Satisfied',
    reason: 'Good service, waiting area can improve',
    mobileNumber: '9123456780',
  },
  {
    branchName: 'Ring Road',
    customerName: 'Fatima Khan',
    emoji: 'Unsatisfied',
    reason: 'Exchange process was slow',
    mobileNumber: '9988776655',
  },
  {
    branchName: 'Sona Main',
    customerName: 'Divya Joshi',
    emoji: 'Very Happy',
    reason: null,
    mobileNumber: null,
  },
  {
    branchName: 'Sona Main',
    customerName: 'Nikhil Jain',
    emoji: 'Happy',
    reason: null,
    mobileNumber: null,
  },
];

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  const exportedUserIds = [];
  for (const user of users) {
    const passwordHash = await argon2.hash(user.password);
    await client.query(
      `
        insert into "user" (email, user_name, password, role, is_logged)
        values ($1, $2, $3, $4, false)
        on conflict (user_name)
        do update set
          email = excluded.email,
          role = excluded.role,
          updated_at = now()
        returning id
      `,
      [user.email, user.userName, passwordHash, user.role],
    );

    const exportedUser = await client.query(
      `
        insert into users (email, user_name, password, role, is_logged)
        values ($1, $2, $3, $4, false)
        on conflict (user_name)
        do update set
          email = excluded.email,
          role = excluded.role,
          updated_at = now()
        returning id
      `,
      [user.email, user.userName, passwordHash, user.role],
    );
    exportedUserIds.push(exportedUser.rows[0].id);
  }

  await client.query(
    'delete from feedback where customer_name = any($1::varchar[])',
    [feedbacks.map((feedback) => feedback.customerName)],
  );

  for (const [index, feedback] of feedbacks.entries()) {
    await client.query(
      `
        insert into feedback (
          branch_name,
          customer_name,
          emoji,
          reason,
          mobile_number,
          created_at,
          updated_at
        )
        values ($1, $2, $3, $4, $5, now() - ($6::int * interval '1 day'), now())
      `,
      [
        feedback.branchName,
        feedback.customerName,
        feedback.emoji,
        feedback.reason,
        feedback.mobileNumber,
        index,
      ],
    );
  }

  await client.query(
    "delete from exported_feedbacks where feedback_url = 'exports/sample-feedback.xlsx'",
  );

  await client.query(
    `
      insert into exported_feedbacks (feedback_url, format, user_id)
      values ($1, $2, $3)
    `,
    ['exports/sample-feedback.xlsx', 'excel', exportedUserIds[0]],
  );

  const counts = await Promise.all([
    client.query('select count(*)::int as count from "user"'),
    client.query('select count(*)::int as count from users'),
    client.query('select count(*)::int as count from feedback'),
    client.query('select count(*)::int as count from exported_feedbacks'),
  ]);

  console.log('Seed complete');
  console.log(`user=${counts[0].rows[0].count}`);
  console.log(`users=${counts[1].rows[0].count}`);
  console.log(`feedback=${counts[2].rows[0].count}`);
  console.log(`exported_feedbacks=${counts[3].rows[0].count}`);

  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
