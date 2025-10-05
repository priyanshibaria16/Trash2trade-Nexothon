import { Request, Response } from 'express';
import { findUserByEmail, updateUserPassword } from '../models/user.model';
import { hashPassword } from '../utils/auth.utils';

/**
 * Request password reset
 * @param req Request object
 * @param res Response object
 * @returns Success message
 */
export const requestPasswordReset = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      });
    }

    // Check if user exists
    const user = await findUserByEmail(email);
    
    if (!user) {
      // We don't want to reveal if the email exists or not for security reasons
      // So we return success even if the user doesn't exist
      return res.status(200).json({
        message: 'If your email is registered, you will receive a password reset link shortly.'
      });
    }

    // In a real application, you would:
    // 1. Generate a secure reset token
    // 2. Save it to the database with an expiration time
    // 3. Send an email with the reset link
    
    // For this demo, we'll just return success
    return res.status(200).json({
      message: 'If your email is registered, you will receive a password reset link shortly.'
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/**
 * Reset password
 * @param req Request object
 * @param res Response object
 * @returns Success message
 */
export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token, password } = req.body;

    // Validate input
    if (!token || !password) {
      return res.status(400).json({
        message: 'Token and password are required'
      });
    }

    // In a real application, you would:
    // 1. Verify the token
    // 2. Check if the token is expired
    // 3. Find the user associated with the token
    
    // For this demo, we'll just simulate the process
    // In a real app, you would look up the user by the token
    
    // Hash the new password
    const hashedPassword = await hashPassword(password);
    
    // Update the user's password
    // In a real app, you would find the user by the token and update their password
    // For demo purposes, we'll return success
    
    return res.status(200).json({
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};