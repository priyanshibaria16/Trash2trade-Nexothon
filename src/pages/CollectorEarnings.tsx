import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  IndianRupee, 
  TrendingUp, 
  Calendar, 
  Recycle, 
  CheckCircle,
  Loader
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiGet, apiPost } from '@/utils/api.utils';

interface Earning {
  id: number;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  transaction_id: string | null;
  created_at: string;
}

interface Pickup {
  id: number;
  waste_type: string;
  quantity: number;
  status: string;
  green_coins_earned: number | null;
  completed_date: string | null;
}

const CollectorEarnings = () => {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalPickups: 0,
    greenCoinsEarned: 0,
    completionRate: 0
  });
  const [withdrawalAmount, setWithdrawalAmount] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch earnings
        const earningsResponse = await apiGet('/api/payments');
        setEarnings(earningsResponse.payments || []);
        
        // Fetch pickups
        const pickupsResponse = await apiGet('/api/pickups/collector');
        setPickups(pickupsResponse.pickups || []);
        
        // Calculate stats
        const completedPickups = pickupsResponse.pickups?.filter((p: Pickup) => p.status === 'completed') || [];
        const totalEarnings = earningsResponse.payments?.reduce((sum: number, earning: Earning) => 
          earning.status === 'completed' ? sum + earning.amount : sum, 0) || 0;
        const greenCoinsEarned = completedPickups.reduce((sum: number, pickup: Pickup) => 
          sum + (pickup.green_coins_earned || 0), 0);
        const completionRate = pickupsResponse.pickups?.length ? 
          (completedPickups.length / pickupsResponse.pickups.length) * 100 : 0;
        
        setStats({
          totalEarnings,
          totalPickups: pickupsResponse.pickups?.length || 0,
          greenCoinsEarned,
          completionRate
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleWithdraw = async () => {
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      return;
    }

    const amount = parseFloat(withdrawalAmount);
    if (amount > stats.totalEarnings) {
      return;
    }

    try {
      // In a real app, this would make an API call to process withdrawal
      // await apiPost('/api/payments/withdraw', { amount });
      
      // Refresh data
      const earningsResponse = await apiGet('/api/payments');
      setEarnings(earningsResponse.payments || []);
      
      setWithdrawalAmount('');
    } catch (error: any) {
      console.error('Error processing withdrawal:', error);
    }
  };

  // Prepare data for charts
  const earningsData = earnings
    .filter(earning => earning.status === 'completed')
    .map(earning => ({
      date: new Date(earning.created_at).toLocaleDateString(),
      amount: earning.amount
    }))
    .slice(-7); // Last 7 earnings

  const pickupsData = pickups
    .filter(pickup => pickup.status === 'completed' && pickup.completed_date)
    .map(pickup => ({
      date: new Date(pickup.completed_date!).toLocaleDateString(),
      count: 1
    }))
    .reduce((acc: any[], curr) => {
      const existing = acc.find(item => item.date === curr.date);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push(curr);
      }
      return acc;
    }, [])
    .slice(-7); // Last 7 days

  if (!user || user.role !== 'collector') {
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Earnings Dashboard</h1>
        <p className="text-muted-foreground">
          Track your earnings and performance metrics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">₹{stats.totalEarnings.toFixed(2)}</p>
              </div>
              <IndianRupee className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pickups</p>
                <p className="text-2xl font-bold">{stats.totalPickups}</p>
              </div>
              <Recycle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">GreenCoins Earned</p>
                <p className="text-2xl font-bold">{stats.greenCoinsEarned}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{stats.completionRate.toFixed(1)}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Earnings Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Earnings Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {earningsData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No earnings data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pickups Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Recycle className="h-5 w-5 mr-2" />
                Completed Pickups
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pickupsData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={pickupsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No pickups data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Withdraw Funds */}
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <p className="text-2xl font-bold">₹{stats.totalEarnings.toFixed(2)}</p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="withdrawalAmount" className="text-sm font-medium">
                    Amount to Withdraw
                  </label>
                  <Input
                    id="withdrawalAmount"
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <Button 
                  className="w-full"
                  onClick={handleWithdraw}
                  disabled={!withdrawalAmount || parseFloat(withdrawalAmount) <= 0 || parseFloat(withdrawalAmount) > stats.totalEarnings}
                >
                  Request Withdrawal
                </Button>
                
                <p className="text-xs text-muted-foreground">
                  Note: Withdrawals are processed within 3-5 business days
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Earnings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              {earnings.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-sm">No earnings yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {earnings.slice(0, 5).map((earning) => (
                    <div key={earning.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">₹{earning.amount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(earning.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          earning.status === 'completed' ? 'default' : 
                          earning.status === 'pending' ? 'secondary' : 
                          'outline'
                        }
                      >
                        {earning.status}
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

export default CollectorEarnings;