import pool from '../config/db';
import { Reward, UserReward } from './Reward';

/**
 * Get all active rewards
 * @returns Array of active rewards
 */
export const getActiveRewards = async (): Promise<Reward[]> => {
  const query = 'SELECT * FROM rewards WHERE is_active = true ORDER BY green_coins_required ASC';
  const result = await pool.query(query);
  return result.rows;
};

/**
 * Get reward by ID
 * @param id Reward ID
 * @returns Reward object or null if not found
 */
export const getRewardById = async (id: number): Promise<Reward | null> => {
  const query = 'SELECT * FROM rewards WHERE id = $1';
  const values = [id];

  const result = await pool.query(query, values);
  return result.rows.length ? result.rows[0] : null;
};

/**
 * Redeem a reward for a user
 * @param userId User ID
 * @param rewardId Reward ID
 * @returns UserReward object
 */
export const redeemReward = async (userId: number, rewardId: number): Promise<UserReward> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get user and reward data
    const userResult = await client.query('SELECT green_coins FROM users WHERE id = $1', [userId]);
    const rewardResult = await client.query('SELECT green_coins_required FROM rewards WHERE id = $1', [rewardId]);
    
    if (userResult.rows.length === 0 || rewardResult.rows.length === 0) {
      throw new Error('User or reward not found');
    }
    
    const user = userResult.rows[0];
    const reward = rewardResult.rows[0];
    
    // Check if user has enough green coins
    if (user.green_coins < reward.green_coins_required) {
      throw new Error('Not enough GreenCoins');
    }
    
    // Deduct green coins from user
    await client.query(
      'UPDATE users SET green_coins = green_coins - $1 WHERE id = $2',
      [reward.green_coins_required, userId]
    );
    
    // Create user reward record
    const userRewardQuery = `
      INSERT INTO user_rewards (user_id, reward_id, status)
      VALUES ($1, $2, 'pending')
      RETURNING *
    `;
    const userRewardValues = [userId, rewardId];
    const userRewardResult = await client.query(userRewardQuery, userRewardValues);
    
    await client.query('COMMIT');
    
    return userRewardResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Get user's rewards
 * @param userId User ID
 * @returns Array of user rewards with reward details
 */
export const getUserRewards = async (userId: number): Promise<any[]> => {
  const query = `
    SELECT ur.*, r.name, r.description, r.green_coins_required, r.image_url
    FROM user_rewards ur
    JOIN rewards r ON ur.reward_id = r.id
    WHERE ur.user_id = $1
    ORDER BY ur.created_at DESC
  `;
  const values = [userId];

  const result = await pool.query(query, values);
  return result.rows;
};