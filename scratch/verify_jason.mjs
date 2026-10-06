import mysql from 'mysql2/promise';

async function test() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'firstcapital'
  });

  const [rows] = await pool.query('SELECT * FROM quiz_leads ORDER BY created_at DESC');
  console.log('Total leads found:', rows.length);
  const jason = rows.find(r => r.name.toLowerCase().includes('jason'));
  console.log('Jason row in DB:', jason);
  await pool.end();
}

test().catch(console.error);
