export interface Reward {
  id: number;
  name: string;
  description: string;
  green_coins_required: number;
  image_url: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserReward {
  id: number;
  user_id: number;
  reward_id: number;
  status: 'pending' | 'redeemed' | 'delivered';
  redeemed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}