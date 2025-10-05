import { Request, Response } from 'express';
import {
  createPickup,
  getPickupsByUserId,
  getPickupsByCollectorId,
  getPendingPickups,
  getPickupById,
  updatePickup,
  deletePickup,
  getUserPickupStats
} from '../models/pickup.model';

/**
 * Create a new pickup request
 * @param req Request object
 * @param res Response object
 * @returns Created pickup
 */
export const createPickupRequest = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as any).user.id;
    const pickupData = req.body;

    // Validate required fields
    if (!pickupData.waste_type || !pickupData.quantity || !pickupData.address || 
        !pickupData.preferred_date || !pickupData.preferred_time) {
      return res.status(400).json({
        message: 'Waste type, quantity, address, preferred date, and preferred time are required'
      });
    }

    // Create pickup
    const newPickup = await createPickup({
      user_id: userId,
      waste_type: pickupData.waste_type,
      quantity: pickupData.quantity,
      address: pickupData.address,
      notes: pickupData.notes || null,
      preferred_date: pickupData.preferred_date,
      preferred_time: pickupData.preferred_time,
      latitude: pickupData.latitude || null,
      longitude: pickupData.longitude || null
    });

    return res.status(201).json({
      message: 'Pickup request created successfully',
      pickup: newPickup
    });
  } catch (error) {
    console.error('Create pickup error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/**
 * Get all pickups for the current user
 * @param req Request object
 * @param res Response object
 * @returns Array of pickups
 */
export const getUserPickups = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as any).user.id;
    
    const pickups = await getPickupsByUserId(userId);
    
    return res.status(200).json({
      pickups
    });
  } catch (error) {
    console.error('Get user pickups error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/**
 * Get all pickups for the current collector
 * @param req Request object
 * @param res Response object
 * @returns Array of pickups
 */
export const getCollectorPickups = async (req: Request, res: Response): Promise<Response> => {
  try {
    const collectorId = (req as any).user.id;
    
    const pickups = await getPickupsByCollectorId(collectorId);
    
    return res.status(200).json({
      pickups
    });
  } catch (error) {
    console.error('Get collector pickups error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/**
 * Get all pending pickups (for collectors)
 * @param req Request object
 * @param res Response object
 * @returns Array of pending pickups
 */
export const getAvailablePickups = async (req: Request, res: Response): Promise<Response> => {
  try {
    const pickups = await getPendingPickups();
    
    return res.status(200).json({
      pickups
    });
  } catch (error) {
    console.error('Get pending pickups error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/**
 * Get pickup by ID
 * @param req Request object
 * @param res Response object
 * @returns Pickup object
 */
export const getPickup = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const pickupId = parseInt(id);
    
    if (isNaN(pickupId)) {
      return res.status(400).json({
        message: 'Invalid pickup ID'
      });
    }
    
    const pickup = await getPickupById(pickupId);
    
    if (!pickup) {
      return res.status(404).json({
        message: 'Pickup not found'
      });
    }
    
    // Check if user has permission to view this pickup
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;
    
    if (userRole === 'citizen' && pickup.user_id !== userId) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }
    
    if (userRole === 'collector' && pickup.collector_id !== userId && pickup.collector_id !== null) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }
    
    return res.status(200).json({
      pickup
    });
  } catch (error) {
    console.error('Get pickup error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/**
 * Update pickup status
 * @param req Request object
 * @param res Response object
 * @returns Updated pickup
 */
export const updatePickupStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const pickupId = parseInt(id);
    const { status, collector_id } = req.body;
    
    if (isNaN(pickupId)) {
      return res.status(400).json({
        message: 'Invalid pickup ID'
      });
    }
    
    // Validate status
    const validStatuses = ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status'
      });
    }
    
    // Get current pickup
    const currentPickup = await getPickupById(pickupId);
    if (!currentPickup) {
      return res.status(404).json({
        message: 'Pickup not found'
      });
    }
    
    // Check permissions
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;
    
    // Citizens can only cancel their own pickups
    if (userRole === 'citizen') {
      if (currentPickup.user_id !== userId) {
        return res.status(403).json({
          message: 'Access denied'
        });
      }
      
      if (status && status !== 'cancelled') {
        return res.status(403).json({
          message: 'Citizens can only cancel pickups'
        });
      }
    }
    
    // Collectors can accept, start, complete, or cancel pickups
    if (userRole === 'collector') {
      // If pickup is not assigned to this collector, they can only accept it
      if (currentPickup.collector_id === null && status === 'accepted') {
        // Assign collector to pickup
        const updatedPickup = await updatePickup(pickupId, {
          collector_id: userId,
          status
        });
        
        return res.status(200).json({
          message: 'Pickup accepted successfully',
          pickup: updatedPickup
        });
      }
      
      if (currentPickup.collector_id !== userId) {
        return res.status(403).json({
          message: 'Access denied'
        });
      }
    }
    
    // Update pickup
    const updateData: any = {};
    if (status) updateData.status = status;
    if (collector_id) updateData.collector_id = collector_id;
    
    // Add timestamps for specific status changes
    const now = new Date().toISOString();
    if (status === 'accepted') {
      updateData.scheduled_date = now;
    } else if (status === 'completed') {
      updateData.completed_date = now;
      updateData.green_coins_earned = 10 * currentPickup.quantity; // 10 coins per item
    }
    
    const updatedPickup = await updatePickup(pickupId, updateData);
    
    return res.status(200).json({
      message: 'Pickup updated successfully',
      pickup: updatedPickup
    });
  } catch (error) {
    console.error('Update pickup error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/**
 * Delete pickup
 * @param req Request object
 * @param res Response object
 * @returns Success message
 */
export const deletePickupRequest = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const pickupId = parseInt(id);
    
    if (isNaN(pickupId)) {
      return res.status(400).json({
        message: 'Invalid pickup ID'
      });
    }
    
    // Get current pickup
    const currentPickup = await getPickupById(pickupId);
    if (!currentPickup) {
      return res.status(404).json({
        message: 'Pickup not found'
      });
    }
    
    // Check if user has permission to delete this pickup
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;
    
    if (userRole === 'citizen' && currentPickup.user_id !== userId) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }
    
    // Only allow deletion of pending pickups
    if (currentPickup.status !== 'pending') {
      return res.status(400).json({
        message: 'Only pending pickups can be deleted'
      });
    }
    
    // Delete pickup
    await deletePickup(pickupId);
    
    return res.status(200).json({
      message: 'Pickup deleted successfully'
    });
  } catch (error) {
    console.error('Delete pickup error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/**
 * Get user pickup statistics
 * @param req Request object
 * @param res Response object
 * @returns Statistics object
 */
export const getUserStats = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as any).user.id;
    
    const stats = await getUserPickupStats(userId);
    
    return res.status(200).json({
      stats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};