const mysql = require('mysql2');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',  // Use .env variable or default to localhost
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'food_ordering_db'
};

const db = mysql.createConnection(dbConfig);

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit if DB connection fails
  }
  console.log('Connected to the database!');
});

module.exports = db;
