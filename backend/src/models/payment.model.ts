import pool from '../config/db';
import { Payment, PaymentCreation } from './Payment';

/**
 * Create a new payment record
 * @param paymentData Payment creation data
 * @returns Created payment object
 */
export const createPayment = async (paymentData: PaymentCreation): Promise<Payment> => {
  const { user_id, amount, currency, payment_method } = paymentData;

  const query = `
    INSERT INTO payments (user_id, amount, currency, payment_method)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [user_id, amount, currency, payment_method];

  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * Get payment by ID
 * @param id Payment ID
 * @returns Payment object or null if not found
 */
export const getPaymentById = async (id: number): Promise<Payment | null> => {
  const query = 'SELECT * FROM payments WHERE id = $1';
  const values = [id];

  const result = await pool.query(query, values);
  return result.rows.length ? result.rows[0] : null;
};

/**
 * Get all payments for a user
 * @param userId User ID
 * @returns Array of payments
 */
export const getPaymentsByUserId = async (userId: number): Promise<Payment[]> => {
  const query = 'SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC';
  const values = [userId];

  const result = await pool.query(query, values);
  return result.rows;
};

/**
 * Update payment status
 * @param id Payment ID
 * @param status New status
 * @param transactionId Transaction ID (optional)
 * @returns Updated payment object
 */
export const updatePaymentStatus = async (
  id: number,
  status: 'pending' | 'completed' | 'failed' | 'refunded',
  transactionId?: string
): Promise<Payment> => {
  const query = `
    UPDATE payments 
    SET status = $1, transaction_id = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *
  `;

  const values = [status, transactionId || null, id];

  const result = await pool.query(query, values);
  return result.rows[0];
};