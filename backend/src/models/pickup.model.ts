import pool from '../config/db';
import { Pickup, PickupCreation, PickupUpdate } from './Pickup';

/**
 * Create a new pickup request
 * @param pickupData Pickup creation data
 * @returns Created pickup object
 */
export const createPickup = async (pickupData: PickupCreation): Promise<Pickup> => {
  const {
    user_id,
    waste_type,
    quantity,
    address,
    notes,
    preferred_date,
    preferred_time,
    latitude,
    longitude
  } = pickupData;

  const query = `
    INSERT INTO pickups (
      user_id, waste_type, quantity, address, notes, 
      preferred_date, preferred_time, latitude, longitude
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;

  const values = [
    user_id,
    waste_type,
    quantity,
    address,
    notes,
    preferred_date,
    preferred_time,
    latitude,
    longitude
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * Get all pickups for a user with user information
 * @param userId User ID
 * @returns Array of pickups with user details
 */
export const getPickupsByUserId = async (userId: number): Promise<any[]> => {
  const query = `
    SELECT 
      p.*, 
      u.name as user_name,
      u.email as user_email
    FROM pickups p
    JOIN users u ON p.user_id = u.id
    WHERE p.user_id = $1 
    ORDER BY p.created_at DESC
  `;
  const values = [userId];

  const result = await pool.query(query, values);
  return result.rows;
};

/**
 * Get all pickups for a collector with user information
 * @param collectorId Collector ID
 * @returns Array of pickups with user details
 */
export const getPickupsByCollectorId = async (collectorId: number): Promise<any[]> => {
  const query = `
    SELECT 
      p.*, 
      u.name as user_name,
      u.email as user_email
    FROM pickups p
    JOIN users u ON p.user_id = u.id
    WHERE p.collector_id = $1 
    ORDER BY p.created_at DESC
  `;
  const values = [collectorId];

  const result = await pool.query(query, values);
  return result.rows;
};

/**
 * Get all pending pickups (for collectors to view) with user information
 * @returns Array of pending pickups with user details
 */
export const getPendingPickups = async (): Promise<any[]> => {
  const query = `
    SELECT 
      p.*, 
      u.name as user_name,
      u.email as user_email
    FROM pickups p
    JOIN users u ON p.user_id = u.id
    WHERE p.status = 'pending' 
    ORDER BY p.created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

/**
 * Get pickup by ID with user information
 * @param id Pickup ID
 * @returns Pickup object with user details or null if not found
 */
export const getPickupById = async (id: number): Promise<any | null> => {
  const query = `
    SELECT 
      p.*, 
      u.name as user_name,
      u.email as user_email
    FROM pickups p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = $1
  `;
  const values = [id];

  const result = await pool.query(query, values);
  return result.rows.length ? result.rows[0] : null;
};

/**
 * Update pickup
 * @param id Pickup ID
 * @param updateData Pickup update data
 * @returns Updated pickup object
 */
export const updatePickup = async (id: number, updateData: PickupUpdate): Promise<Pickup> => {
  // Build dynamic query based on provided fields
  const fields = Object.keys(updateData);
  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
  const values = [...Object.values(updateData), id];
  
  const query = `
    UPDATE pickups 
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${values.length}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * Delete pickup
 * @param id Pickup ID
 * @returns Boolean indicating success
 */
export const deletePickup = async (id: number): Promise<boolean> => {
  const query = 'DELETE FROM pickups WHERE id = $1';
  const values = [id];

  const result = await pool.query(query, values);
  return result.rowCount !== null && result.rowCount > 0;
};

/**
 * Get pickup statistics for a user
 * @param userId User ID
 * @returns Statistics object
 */
export const getUserPickupStats = async (userId: number): Promise<any> => {
  const query = `
    SELECT 
      COUNT(*) as total_pickups,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_pickups,
      SUM(CASE WHEN status = 'completed' THEN green_coins_earned ELSE 0 END) as total_green_coins
    FROM pickups 
    WHERE user_id = $1
  `;
  const values = [userId];

  const result = await pool.query(query, values);
  return result.rows[0];
};