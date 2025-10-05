import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Gift, Coins, Loader, CheckCircle } from 'lucide-react';
import { apiGet, apiPost } from '@/utils/api.utils';

interface Reward {
  id: number;
  name: string;
  description: string;
  green_coins_required: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

interface UserReward {
  id: number;
  user_id: number;
  reward_id: number;
  status: string;
  redeemed_at: string | null;
  created_at: string;
  name: string;
  description: string;
  green_coins_required: number;
  image_url: string | null;
}

const CitizenRewards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userRewards, setUserRewards] = useState<UserReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<number | null>(null);
  const [cashAmount, setCashAmount] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all rewards
        const rewardsResponse = await apiGet('/api/rewards');
        setRewards(rewardsResponse.rewards || []);
        
        // Fetch user's reward history
        const userRewardsResponse = await apiGet('/api/rewards/my');
        setUserRewards(userRewardsResponse.rewards || []);
      } catch (error) {
        console.error('Error fetching rewards:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleRedeemReward = async (rewardId: number) => {
    setRedeeming(rewardId);
    try {
      const response = await apiPost('/api/rewards/redeem', { rewardId });
      
      toast({
        title: 'Reward Redeemed!',
        description: 'Your reward has been successfully redeemed.',
      });
      
      // Update user's reward history
      const userRewardsResponse = await apiGet('/api/rewards/my');
      setUserRewards(userRewardsResponse.rewards || []);
      
      // Update user's green coins in context
      if (user) {
        const updatedUser = { ...user };
        // Note: In a real app, we would update the user context with the new green coin balance
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to redeem reward. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRedeeming(rewardId);
    }
  };

  const handleRedeemCash = async () => {
    if (!cashAmount || parseFloat(cashAmount) <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid amount.',
        variant: 'destructive',
      });
      return;
    }

    const amount = parseFloat(cashAmount);
    if (amount > (user?.greenCoins || 0)) {
      toast({
        title: 'Error',
        description: 'Not enough GreenCoins.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // In a real app, this would make an API call to redeem cash
      // await apiPost('/api/rewards/redeem-cash', { amount });
      
      toast({
        title: 'Cash Redemption Requested!',
        description: `Your request to redeem ${amount} GreenCoins for cash has been submitted.`,
      });
      
      setCashAmount('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to redeem cash. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!user || user.role !== 'citizen') {
    return <div>Access denied</div>;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Rewards Center</h1>
        <p className="text-muted-foreground">
          Redeem your GreenCoins for eco-friendly rewards
        </p>
      </div>

      {/* GreenCoins Balance */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Your GreenCoins Balance</p>
              <p className="text-3xl font-bold">{user.greenCoins || 0} GC</p>
            </div>
            <Coins className="h-12 w-12 text-primary" />
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Available Rewards */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="h-5 w-5 mr-2" />
                Available Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rewards.length === 0 ? (
                <div className="text-center py-8">
                  <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No rewards available at the moment.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {rewards.map((reward) => (
                    <Card key={reward.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium">{reward.name}</h3>
                          <Badge variant="secondary">{reward.green_coins_required} GC</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {reward.description}
                        </p>
                        <Button
                          className="w-full"
                          disabled={user.greenCoins < reward.green_coins_required || redeeming === reward.id}
                          onClick={() => handleRedeemReward(reward.id)}
                        >
                          {redeeming === reward.id ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (
                            'Redeem Now'
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Redeem Cash */}
          <Card>
            <CardHeader>
              <CardTitle>Redeem for Cash</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cashAmount">Amount (GreenCoins)</Label>
                  <Input
                    id="cashAmount"
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleRedeemCash}
                  disabled={!cashAmount || parseFloat(cashAmount) <= 0}
                >
                  Request Cash Redemption
                </Button>
                <p className="text-xs text-muted-foreground">
                  Note: 100 GreenCoins = ₹100 cashback (subject to terms)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Reward History */}
          <Card>
            <CardHeader>
              <CardTitle>Reward History</CardTitle>
            </CardHeader>
            <CardContent>
              {userRewards.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-sm">No rewards redeemed yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userRewards.slice(0, 5).map((userReward) => (
                    <div key={userReward.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">{userReward.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(userReward.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          userReward.status === 'redeemed' ? 'default' : 
                          userReward.status === 'delivered' ? 'secondary' : 
                          'outline'
                        }
                      >
                        {userReward.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CitizenRewards;