export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'citizen' | 'collector' | 'ngo';
  green_coins: number;
  eco_score: number;
  created_at: Date;
  updated_at: Date;
}

export interface UserWithoutPassword {
  id: number;
  name: string;
  email: string;
  role: 'citizen' | 'collector' | 'ngo';
  green_coins: number;
  eco_score: number;
  created_at: Date;
  updated_at: Date;
}

export interface UserRegistration {
  name: string;
  email: string;
  password: string;
  role: 'citizen' | 'collector' | 'ngo';
}