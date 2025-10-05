import { Client } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Seed database with sample data
 */
const seedData = async (): Promise<void> => {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'trash2trade',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  try {
    await client.connect();
    console.log('Connected to database for seeding');

    // Insert sample users
    const saltRounds = 10;
    const citizenPassword = await bcrypt.hash('password123', saltRounds);
    const collectorPassword = await bcrypt.hash('password123', saltRounds);
    const ngoPassword = await bcrypt.hash('password123', saltRounds);

    // Insert users
    await client.query(`
      INSERT INTO users (name, email, password, role, green_coins, eco_score) VALUES
      ('John Citizen', 'john@example.com', $1, 'citizen', 50, 100),
      ('Jane Collector', 'jane@example.com', $2, 'collector', 0, 0),
      ('Green NGO', 'ngo@example.com', $3, 'ngo', 0, 0)
      ON CONFLICT (email) DO NOTHING
    `, [citizenPassword, collectorPassword, ngoPassword]);

    console.log('Sample users inserted');

    // Get user IDs
    const citizenResult = await client.query('SELECT id FROM users WHERE email = $1', ['john@example.com']);
    const collectorResult = await client.query('SELECT id FROM users WHERE email = $1', ['jane@example.com']);
    
    const citizenId = citizenResult.rows[0]?.id;
    const collectorId = collectorResult.rows[0]?.id;

    // Insert sample pickups
    if (citizenId) {
      await client.query(`
        INSERT INTO pickups (
          user_id, collector_id, waste_type, quantity, address, notes, 
          preferred_date, preferred_time, status, latitude, longitude
        ) VALUES
        ($1, $2, 'plastic', 5, '123 Main St, City', 'Fragile items', '2025-10-10', '10:00:00', 'accepted', 40.7128, -74.0060),
        ($1, $2, 'paper', 10, '456 Oak Ave, City', 'Near the big tree', '2025-10-12', '14:00:00', 'in-progress', 40.7589, -73.9851),
        ($1, NULL, 'e-waste', 3, '789 Pine Rd, City', 'Old electronics', '2025-10-15', '09:00:00', 'pending', 40.7505, -73.9934)
        ON CONFLICT DO NOTHING
      `, [citizenId, collectorId]);

      console.log('Sample pickups inserted');
    }

    await client.end();
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    try {
      await client.end();
    } catch (e) {
      // Ignore errors when closing connection
    }
  }
};

// Run the seeding
seedData();