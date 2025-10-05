import pool from '../config/db';
import { User, UserRegistration, UserWithoutPassword } from './User';
import { hashPassword } from '../utils/auth.utils';

/**
 * Find a user by email
 * @param email User's email
 * @returns User object or null if not found
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];
  
  const result = await pool.query(query, values);
  return result.rows.length ? result.rows[0] : null;
};

/**
 * Create a new user
 * @param userData User registration data
 * @returns Created user object without password
 */
export const createUser = async (userData: UserRegistration): Promise<UserWithoutPassword> => {
  const { name, email, password, role } = userData;
  
  // Hash the password
  const hashedPassword = await hashPassword(password);
  
  const query = `
    INSERT INTO users (name, email, password, role, green_coins, eco_score)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, name, email, role, green_coins, eco_score, created_at, updated_at
  `;
  
  const values = [name, email, hashedPassword, role, 0, 0];
  
  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * Find a user by ID
 * @param id User's ID
 * @returns User object without password or null if not found
 */
export const findUserById = async (id: number): Promise<UserWithoutPassword | null> => {
  const query = 'SELECT id, name, email, role, green_coins, eco_score, created_at, updated_at FROM users WHERE id = $1';
  const values = [id];
  
  const result = await pool.query(query, values);
  return result.rows.length ? result.rows[0] : null;
};