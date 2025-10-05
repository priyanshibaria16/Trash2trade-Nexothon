import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Gift, Trophy, Recycle, ShoppingCart, CreditCard } from 'lucide-react';
import { apiPost } from '@/utils/api.utils';

const CitizenRewards = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState('');

  if (!user || user.role !== 'citizen') {
    return <div>Access denied</div>;
  }

  // Mock rewards data - in a real app, this would come from an API
  const rewards = [
    {
      id: 1,
      title: 'Eco-Friendly Shopping Bag',
      description: 'Reusable bag made from recycled materials',
      greenCoins: 50,
      image: '/placeholder.svg',
    },
    {
      id: 2,
      title: 'Plant a Tree',
      description: 'Contribute to reforestation efforts',
      greenCoins: 100,
      image: '/placeholder.svg',
    },
    {
      id: 3,
      title: 'Recycled Notebook Set',
      description: 'Set of 3 notebooks made from recycled paper',
      greenCoins: 75,
      image: '/placeholder.svg',
    },
    {
      id: 4,
      title: 'Public Transportation Pass',
      description: 'One-month pass for eco-friendly commuting',
      greenCoins: 200,
      image: '/placeholder.svg',
    },
  ];

  const handleRedeem = async (rewardId: number, greenCoins: number) => {
    if ((user.greenCoins || 0) < greenCoins) {
      toast({
        title: 'Insufficient GreenCoins',
        description: `You need ${greenCoins} GreenCoins to redeem this reward.`,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Make API call to redeem reward
      const response = await apiPost('/api/rewards/redeem', { rewardId });
      
      toast({
        title: 'Reward Redeemed!',
        description: 'Your reward has been successfully redeemed. Check your email for details.',
      });
      
      // In a real app, we would update the user's GreenCoins balance
      // For now, we'll just navigate back to the dashboard
      navigate('/citizen');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to redeem reward. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCashRedemption = async () => {
    const amount = parseInt(redeemAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount of GreenCoins to redeem.',
        variant: 'destructive',
      });
      return;
    }

    if ((user.greenCoins || 0) < amount) {
      toast({
        title: 'Insufficient GreenCoins',
        description: `You only have ${user.greenCoins} GreenCoins available.`,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Make API call to redeem for cash
      const response = await apiPost('/api/rewards/redeem-cash', { amount });
      
      toast({
        title: 'Cash Redemption Requested!',
        description: `Request to redeem ${amount} GreenCoins for cash has been submitted.`,
      });
      
      // Reset form
      setRedeemAmount('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to process cash redemption. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              <h2 className="text-lg font-semibold">Your GreenCoins Balance</h2>
              <p className="text-3xl font-bold text-success">{user.greenCoins || 0} GC</p>
            </div>
            <div className="p-3 bg-success/10 rounded-full">
              <Gift className="h-8 w-8 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cash Redemption */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Redeem for Cash
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-muted-foreground mb-4">
                Convert your GreenCoins to cash at a rate of 10 GC = $1
              </p>
              <div className="text-sm">
                <p className="font-medium">Redemption Rate</p>
                <p>10 GreenCoins = $1</p>
              </div>
            </div>
            <div>
              <Label htmlFor="redeemAmount">Amount to Redeem (GC)</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  id="redeemAmount"
                  type="number"
                  min="10"
                  step="10"
                  value={redeemAmount}
                  onChange={(e) => setRedeemAmount(e.target.value)}
                  placeholder="Enter amount"
                />
                <Button 
                  onClick={handleCashRedemption} 
                  disabled={isLoading || !redeemAmount}
                >
                  {isLoading ? 'Processing...' : 'Redeem'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reward Catalog */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Available Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <Card key={reward.id} className="flex flex-col">
              <div className="p-4 flex-1">
                <div className="bg-muted rounded-lg h-32 flex items-center justify-center mb-4">
                  <img 
                    src={reward.image} 
                    alt={reward.title} 
                    className="max-h-24 object-contain"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-1">{reward.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                <Badge variant="secondary">{reward.greenCoins} GC</Badge>
              </div>
              <div className="p-4 pt-0">
                <Button 
                  className="w-full"
                  onClick={() => handleRedeem(reward.id, reward.greenCoins)}
                  disabled={isLoading || (user.greenCoins || 0) < reward.greenCoins}
                >
                  Redeem
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How GreenCoins Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-primary/10 rounded-full mt-1">
                <Recycle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Earn</h3>
                <p className="text-sm text-muted-foreground">
                  Earn GreenCoins for every successful waste pickup
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-success/10 rounded-full mt-1">
                <Trophy className="h-4 w-4 text-success" />
              </div>
              <div>
                <h3 className="font-medium">Accumulate</h3>
                <p className="text-sm text-muted-foreground">
                  Build up your GreenCoins balance over time
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-warning/10 rounded-full mt-1">
                <ShoppingCart className="h-4 w-4 text-warning" />
              </div>
              <div>
                <h3 className="font-medium">Redeem</h3>
                <p className="text-sm text-muted-foreground">
                  Exchange GreenCoins for rewards or cash
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CitizenRewards;