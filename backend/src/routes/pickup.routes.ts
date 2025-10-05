import { Router } from 'express';
import {
  createPickupRequest,
  getUserPickups,
  getCollectorPickups,
  getAvailablePickups,
  getPickup,
  updatePickupStatus,
  deletePickupRequest,
  getUserStats
} from '../controllers/pickup.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Citizen routes
router.post('/', authenticate, createPickupRequest); // Create pickup request
router.get('/my', authenticate, getUserPickups); // Get user's pickups
router.delete('/:id', authenticate, deletePickupRequest); // Delete pickup (citizen only)

// Collector routes
router.get('/collector', authenticate, getCollectorPickups); // Get collector's pickups
router.get('/available', authenticate, getAvailablePickups); // Get available pickups
router.get('/:id', authenticate, getPickup); // Get specific pickup
router.put('/:id/status', authenticate, updatePickupStatus); // Update pickup status

// General routes
router.get('/stats', authenticate, getUserStats); // Get user statistics

export default router;