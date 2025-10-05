import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'citizen' | 'collector' | 'ngo';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  greenCoins?: number;
  ecoScore?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user and token
    const storedUser = localStorage.getItem('trash2trade_user');
    const token = localStorage.getItem('trash2trade_token');
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        // If parsing fails, remove invalid data
        localStorage.removeItem('trash2trade_user');
        localStorage.removeItem('trash2trade_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Make API call to backend
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Transform user data to match frontend interface
        const transformedUser: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          greenCoins: data.user.green_coins,
          ecoScore: data.user.eco_score,
          createdAt: data.user.created_at,
          updatedAt: data.user.updated_at,
        };
        
        setUser(transformedUser);
        localStorage.setItem('trash2trade_user', JSON.stringify(transformedUser));
        localStorage.setItem('trash2trade_token', data.token);
        setIsLoading(false);
        return true;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Make API call to backend
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Transform user data to match frontend interface
        const transformedUser: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          greenCoins: data.user.green_coins,
          ecoScore: data.user.eco_score,
          createdAt: data.user.created_at,
          updatedAt: data.user.updated_at,
        };
        
        setUser(transformedUser);
        localStorage.setItem('trash2trade_user', JSON.stringify(transformedUser));
        localStorage.setItem('trash2trade_token', data.token);
        setIsLoading(false);
        return true;
      } else {
        throw new Error(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trash2trade_user');
    localStorage.removeItem('trash2trade_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};