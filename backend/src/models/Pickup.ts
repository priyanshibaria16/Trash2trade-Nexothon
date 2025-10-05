export interface Pickup {
  id: number;
  user_id: number;
  collector_id: number | null;
  waste_type: 'plastic' | 'e-waste' | 'paper' | 'metal';
  quantity: number;
  address: string;
  notes: string | null;
  preferred_date: string;
  preferred_time: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  scheduled_date: string | null;
  completed_date: string | null;
  green_coins_earned: number | null;
  latitude: number | null;
  longitude: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface PickupCreation {
  user_id: number;
  waste_type: 'plastic' | 'e-waste' | 'paper' | 'metal';
  quantity: number;
  address: string;
  notes: string | null;
  preferred_date: string;
  preferred_time: string;
  latitude: number | null;
  longitude: number | null;
}

export interface PickupUpdate {
  collector_id?: number | null;
  status?: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  scheduled_date?: string | null;
  completed_date?: string | null;
  green_coins_earned?: number | null;
}