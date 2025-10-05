import { Request, Response } from 'express';
import { getActiveRewards, redeemReward, getUserRewards } from '../models/reward.model';
import { findUserById } from '../models/user.model';

/**
 * Get all active rewards
 * @param req Request object
 * @param res Response object
 * @returns Array of active rewards
 */
export const getRewards = async (req: Request, res: Response): Promise<Response> => {
  try {
    const rewards = await getActiveRewards();
    
    return res.status(200).json({
      rewards
    });
  } catch (error) {
    console.error('Get rewards error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/**
 * Redeem a reward
 * @param req Request object
 * @param res Response object
 * @returns User reward object
 */
export const redeemUserReward = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as any).user.id;
    const { rewardId } = req.body;
    
    if (!rewardId) {
      return res.status(400).json({
        message: 'Reward ID is required'
      });
    }
    
    // Redeem reward
    const userReward = await redeemReward(userId, rewardId);
    
    // Update user's green coins in the request object
    const updatedUser = await findUserById(userId);
    if (updatedUser) {
      (req as any).user.green_coins = updatedUser.green_coins;
    }
    
    return res.status(200).json({
      message: 'Reward redeemed successfully',
      userReward
    });
  } catch (error: any) {
    console.error('Redeem reward error:', error);
    
    if (error.message === 'Not enough GreenCoins') {
      return res.status(400).json({
        message: 'Not enough GreenCoins to redeem this reward'
      });
    }
    
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/**
 * Get user's rewards
 * @param req Request object
 * @param res Response object
 * @returns Array of user rewards
 */
export const getUserRewardHistory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as any).user.id;
    
    const rewards = await getUserRewards(userId);
    
    return res.status(200).json({
      rewards
    });
  } catch (error) {
    console.error('Get user rewards error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};