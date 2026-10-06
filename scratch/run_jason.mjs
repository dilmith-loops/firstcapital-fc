import mysql from 'mysql2/promise';

async function test() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'firstcapital'
  });

  console.log('Testing inserting Jason...');
  const [res] = await pool.execute(
    `INSERT INTO quiz_leads (name, email, phone, gender, result_code, result_profile, matched_product, answers_json, status, notes) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'Jason',
      'jason@example.com',
      '0771234567',
      'male',
      'B',
      'The Smooth Operator',
      'First Capital Fixed Income Fund (FCFIF)',
      JSON.stringify({ 1: 'B', 2: 'B', 3: 'B', 4: 'B', 5: 'B', 6: 'B', 7: 'B' }),
      'NEW',
      'Walk-in / quiz lead for Jason'
    ]
  );

  console.log('Successfully inserted Jason with ID:', res.insertId);

  const [rows] = await pool.query('SELECT * FROM quiz_leads ORDER BY id DESC LIMIT 5');
  console.log('Recent leads:');
  console.table(rows);

  await pool.end();
}

test().catch(console.error);
