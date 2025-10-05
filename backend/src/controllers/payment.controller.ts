import { Request, Response } from 'express';
import { createPayment, getPaymentsByUserId, getPaymentById, updatePaymentStatus } from '../models/payment.model';

/**
 * Create a new payment
 * @param req Request object
 * @param res Response object
 * @returns Created payment
 */
export const createPaymentRequest = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as any).user.id;
    const { amount, currency, paymentMethod } = req.body;

    // Validate required fields
    if (!amount || !paymentMethod) {
      return res.status(400).json({
        message: 'Amount and payment method are required'
      });
    }

    // Create payment record
    const payment = await createPayment({
      user_id: userId,
      amount,
      currency: currency || 'INR',
      payment_method: paymentMethod
    });

    // In a real application, you would integrate with a payment gateway here
    // For now, we'll simulate a successful payment

    // Update payment status to completed
    const updatedPayment = await updatePaymentStatus(payment.id, 'completed', `txn_${Date.now()}`);

    return res.status(201).json({
      message: 'Payment processed successfully',
      payment: updatedPayment
    });
  } catch (error) {
    console.error('Create payment error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/**
 * Get user's payment history
 * @param req Request object
 * @param res Response object
 * @returns Array of payments
 */
export const getUserPayments = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as any).user.id;
    
    const payments = await getPaymentsByUserId(userId);
    
    return res.status(200).json({
      payments
    });
  } catch (error) {
    console.error('Get user payments error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/**
 * Get payment by ID
 * @param req Request object
 * @param res Response object
 * @returns Payment object
 */
export const getPayment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const paymentId = parseInt(id);
    
    if (isNaN(paymentId)) {
      return res.status(400).json({
        message: 'Invalid payment ID'
      });
    }
    
    const payment = await getPaymentById(paymentId);
    
    if (!payment) {
      return res.status(404).json({
        message: 'Payment not found'
      });
    }
    
    // Check if user has permission to view this payment
    const userId = (req as any).user.id;
    
    if (payment.user_id !== userId) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }
    
    return res.status(200).json({
      payment
    });
  } catch (error) {
    console.error('Get payment error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};