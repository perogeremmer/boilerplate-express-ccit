import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool for MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'express_user',
  password: process.env.DB_PASSWORD || 'express_password',
  database: process.env.DB_NAME || 'boilerplate_express',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Query helper function
export const query = async (sql, params) => {
  const start = Date.now();
  const [rows, fields] = await pool.execute(sql, params);
  const duration = Date.now() - start;
  
  if (process.env.NODE_ENV !== 'test') {
    console.log('Executed query', { 
      sql: sql.substring(0, 50), 
      duration, 
      rows: Array.isArray(rows) ? rows.length : 0 
    });
  }
  
  return { rows, fields };
};

// Get connection from pool
export const getClient = async () => {
  return await pool.getConnection();
};

// For Sequelize migrations - create a raw connection config
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'express_user',
  password: process.env.DB_PASSWORD || 'express_password',
  database: process.env.DB_NAME || 'boilerplate_express',
};

export default pool;
