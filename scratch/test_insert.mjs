import mysql from 'mysql2/promise';

async function test() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'firstcapital'
  });

  try {
    console.log('Testing query with gender column...');
    await pool.execute('INSERT INTO quiz_leads (name, email, phone, gender, status) VALUES (?, ?, ?, ?, ?)', [
      'Jason', 'jason@example.com', '12345678', 'male', 'NEW'
    ]);
  } catch (err) {
    console.error('FAILED AS EXPECTED WITH GENDER:', err.message);
  }

  try {
    console.log('Testing query with actual table schema (no gender column)...');
    const [res] = await pool.execute(
      'INSERT INTO quiz_leads (name, email, phone, result_code, result_profile, answers_json, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['Test Jason', 'jason@example.com', '0771234567', 'A', 'The Keep-It-Cool Investor', JSON.stringify({1:'A'}), 'New']
    );
    console.log('SUCCESS INSERT ID:', res.insertId);
    
    // Clean up test row
    await pool.execute('DELETE FROM quiz_leads WHERE id = ?', [res.insertId]);
    console.log('Cleaned up test row.');
  } catch (err) {
    console.error('FAILED WITH STANDARD COLS:', err.message);
  }

  await pool.end();
}

test();
