import pool from '../src/db/connection.js';

// Global teardown - runs once after all test files
export default async () => {
  console.log('\n🔌 Closing database connections...\n');
  
  try {
    await pool.end();
    console.log('✅ Database connections closed\n');
  } catch (err) {
    console.error('❌ Error closing database:', err.message);
  }
};
