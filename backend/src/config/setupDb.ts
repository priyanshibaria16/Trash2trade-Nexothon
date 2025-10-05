import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Setup database and tables
 */
const setupDatabase = async (): Promise<void> => {
  // Connect to PostgreSQL without specifying a database
  const adminClient = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  try {
    // Connect to PostgreSQL server
    await adminClient.connect();
    console.log('Connected to PostgreSQL server');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'trash2trade';
    
    try {
      await adminClient.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database '${dbName}' created successfully`);
    } catch (error: any) {
      if (error.code === '42P04') {
        console.log(`Database '${dbName}' already exists`);
      } else {
        throw error;
      }
    }

    // Close admin connection
    await adminClient.end();

    // Connect to the specific database
    const dbClient = new Client({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: dbName,
      password: process.env.DB_PASSWORD || 'postgres',
      port: parseInt(process.env.DB_PORT || '5432'),
    });

    await dbClient.connect();
    console.log(`Connected to database '${dbName}'`);

    // Create users table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('citizen', 'collector', 'ngo')),
        green_coins INTEGER DEFAULT 0,
        eco_score INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Users table created successfully');

    // Create indexes
    await dbClient.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    `);

    console.log('Indexes created successfully');

    await dbClient.end();
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    try {
      await adminClient.end();
    } catch (e) {
      // Ignore errors when closing connection
    }
  }
};

// Run the setup
setupDatabase();