import { execSync } from 'child_process';
import mysql from 'mysql2/promise';
import { query } from '../src/db/connection.js';

// Test database setup using sequelize-cli
export const setupTestDatabase = async () => {
  console.log('\n🧪 Setting up test database...\n');
  
  // Step 1: Ensure database exists
  await createDatabaseIfNotExists();
  
  // Step 2: Run migrations using sequelize-cli (creates tables only)
  try {
    console.log('📦 Running migrations...');
    execSync('npx sequelize-cli db:migrate', {
      env: { ...process.env, NODE_ENV: 'test' },
      stdio: 'inherit'
    });
    console.log('✓ Migrations completed');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    throw err;
  }
  
  // Step 3: Clear ALL existing data before tests start
  console.log('🧹 Clearing existing data...');
  await clearAllTables();
  console.log('✓ Database cleared');
  
  console.log('\n✅ Test database ready! (clean slate)\n');
};

// Create database if it doesn't exist
const createDatabaseIfNotExists = async () => {
  try {
    console.log('🔍 Checking database...');
    
    // Get config from environment or defaults
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 3306;
    const user = process.env.DB_USER || 'express_user';
    const password = process.env.DB_PASSWORD || 'express_password';
    const dbName = process.env.DB_NAME || 'boilerplate_express';
    
    // Connect without database selected
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password
    });
    
    // Create database if not exists
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    
    await connection.end();
    console.log(`✓ Database "${dbName}" ready`);
  } catch (err) {
    console.error('❌ Failed to create database:', err.message);
    throw err;
  }
};

// Clear all tables before tests start
const clearAllTables = async () => {
  try {
    // Get all tables in the database
    const result = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
    `);
    
    const tables = result.rows.map(row => row.table_name || row.TABLE_NAME);
    
    // Truncate each table (except SequelizeMeta)
    for (const table of tables) {
      if (table !== 'SequelizeMeta') {
        await query(`TRUNCATE TABLE \`${table}\``);
      }
    }
  } catch (err) {
    // If no tables exist yet, that's fine
    console.log('⚠️  No tables to clear (might be first run)');
  }
};

// Global setup for Jest - runs once before all test files
export default async () => {
  await setupTestDatabase();
};
