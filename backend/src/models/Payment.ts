export interface Payment {
  id: number;
  user_id: number;
  amount: number;
  currency: string;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentCreation {
  user_id: number;
  amount: number;
  currency: string;
  payment_method: string;
}