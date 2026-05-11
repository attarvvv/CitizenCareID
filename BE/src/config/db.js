import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'db_pengaduan_masyarakat'
});

db.connect((err) => {
  if (err) {
    console.log('DB Error:', err);
  } else {
    console.log('Database connected ✅');
  }
});

export default db;