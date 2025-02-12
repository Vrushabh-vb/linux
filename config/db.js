const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'mysql',  // Use the service name from docker-compose.yml
  user: 'admin',
  password: 'admin123',
  database: 'food_ordering_db'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit the app if DB connection fails
  }
  console.log('Connected to the database!');
});

module.exports = db;
