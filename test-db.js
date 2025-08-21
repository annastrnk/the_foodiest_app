import { sql } from '@vercel/postgres';

async function testDB() {
  const { rows } = await sql`SELECT NOW()`;
  console.log(rows);
}

testDB();
