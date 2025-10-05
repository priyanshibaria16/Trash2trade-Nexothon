import { Router } from 'express';
import { getRewards, redeemUserReward, getUserRewardHistory } from '../controllers/reward.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getRewards); // Get all active rewards

// Protected routes
router.post('/redeem', authenticate, redeemUserReward); // Redeem a reward
router.get('/my', authenticate, getUserRewardHistory); // Get user's reward history

export default router;