import { Request, Response } from 'express';
import { findUserByEmail, createUser, findUserById } from '../models/user.model';
import { comparePasswords, generateToken } from '../utils/auth.utils';
import { UserRegistration, UserWithoutPassword } from '../models/User';

/**
 * User login
 * @param req Request object
 * @param res Response object
 * @returns JWT token and user data
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({ 
        message: 'Email, password, and role are required' 
      });
    }

    // Find user by email
    const user = await findUserByEmail(email);
    
    // Check if user exists and role matches
    if (!user || user.role !== role) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Compare passwords
    const isPasswordValid = await comparePasswords(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Create user object without password
    const userWithoutPassword: UserWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      green_coins: user.green_coins,
      eco_score: user.eco_score,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    // Generate JWT token
    const token = generateToken(userWithoutPassword);

    // Return token and user data
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

/**
 * User registration
 * @param req Request object
 * @param res Response object
 * @returns JWT token and user data
 */
export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password, role }: UserRegistration = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        message: 'Name, email, password, and role are required' 
      });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    
    if (existingUser) {
      return res.status(409).json({ 
        message: 'User with this email already exists' 
      });
    }

    // Create new user
    const newUser = await createUser({ name, email, password, role });

    // Generate JWT token
    const token = generateToken(newUser);

    // Return token and user data
    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

/**
 * Get current user profile
 * @param req Request object
 * @param res Response object
 * @returns User data
 */
export const getProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Get user ID from request (set by auth middleware)
    const userId = (req as any).user.id;

    // Find user by ID
    const user = await findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // Return user data
    return res.status(200).json({
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};