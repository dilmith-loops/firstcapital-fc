import mysql from 'mysql2/promise';

async function main() {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'firstcapital'
    });
    const [rows] = await pool.query('SELECT * FROM quiz_leads ORDER BY id DESC LIMIT 15');
    console.log('Database connected! Recent leads:');
    console.table(rows);
    await pool.end();
  } catch (err) {
    console.error('MySQL connection error:', err.message);
  }
}

main();
