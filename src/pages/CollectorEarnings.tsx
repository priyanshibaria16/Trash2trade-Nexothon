import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Filter,
  Download,
  CreditCard,
  Wallet,
  PiggyBank
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface EarningRecord {
  id: number;
  date: string;
  amount: number;
  pickupId: number;
  wasteType: string;
  citizenName: string;
  status: 'completed' | 'pending' | 'processing';
}

interface EarningSummary {
  totalEarnings: number;
  thisMonth: number;
  thisWeek: number;
  completionRate: number;
  averagePerPickup: number;
}

const CollectorEarnings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [earnings, setEarnings] = useState<EarningRecord[]>([]);
  const [summary, setSummary] = useState<EarningSummary>({
    totalEarnings: 1250,
    thisMonth: 320,
    thisWeek: 85,
    completionRate: 96,
    averagePerPickup: 29.76,
  });
  const [timeFilter, setTimeFilter] = useState('month');
  const [statusFilter, setStatusFilter] = useState('all');

  if (!user || user.role !== 'collector') {
    return <div>Access denied</div>;
  }

  // Mock data for earnings chart
  const earningsData = [
    { date: 'Jan', earnings: 400 },
    { date: 'Feb', earnings: 300 },
    { date: 'Mar', earnings: 200 },
    { date: 'Apr', earnings: 278 },
    { date: 'May', earnings: 189 },
    { date: 'Jun', earnings: 239 },
  ];

  // Mock data for recent earnings
  const recentEarnings: EarningRecord[] = [
    {
      id: 1,
      date: '2024-01-15',
      amount: 25,
      pickupId: 101,
      wasteType: 'plastic',
      citizenName: 'John Doe',
      status: 'completed',
    },
    {
      id: 2,
      date: '2024-01-14',
      amount: 35,
      pickupId: 98,
      wasteType: 'e-waste',
      citizenName: 'Jane Smith',
      status: 'completed',
    },
    {
      id: 3,
      date: '2024-01-14',
      amount: 15,
      pickupId: 97,
      wasteType: 'paper',
      citizenName: 'Robert Johnson',
      status: 'completed',
    },
    {
      id: 4,
      date: '2024-01-13',
      amount: 45,
      pickupId: 95,
      wasteType: 'mixed',
      citizenName: 'Emily Davis',
      status: 'completed',
    },
    {
      id: 5,
      date: '2024-01-12',
      amount: 30,
      pickupId: 92,
      wasteType: 'plastic',
      citizenName: 'Michael Wilson',
      status: 'completed',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-500">Processing</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleWithdraw = () => {
    toast({
      title: 'Withdrawal Requested',
      description: 'Your withdrawal request has been submitted. Funds will be transferred within 3-5 business days.',
    });
  };

  const handleExport = () => {
    toast({
      title: 'Export Started',
      description: 'Earnings report is being generated. You will receive a download link shortly.',
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Earnings</h1>
            <p className="text-muted-foreground">
              Track your income and payment history
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button onClick={handleWithdraw}>
              <CreditCard className="h-4 w-4 mr-2" />
              Withdraw Funds
            </Button>
          </div>
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Wallet className="h-8 w-8 text-primary" />
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold">${summary.totalEarnings.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold">${summary.thisMonth.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold">${summary.thisWeek.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold">{summary.completionRate}%</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg per Pickup</p>
              <p className="text-2xl font-bold">${summary.averagePerPickup.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Earnings Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="earnings" fill="#10b981" name="Earnings ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Earnings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Recent Earnings
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  className="border rounded-md px-2 py-1 text-sm"
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEarnings.map((earning) => (
                <div key={earning.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Pickup #{earning.pickupId}</div>
                    <div className="text-sm text-muted-foreground">
                      {earning.citizenName} • {earning.wasteType}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(earning.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${earning.amount.toFixed(2)}</div>
                    {getStatusBadge(earning.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Bank Transfer</div>
                  <div className="text-sm text-muted-foreground">**** **** **** 1234</div>
                </div>
                <Badge>Primary</Badge>
              </div>
              <Button size="sm" variant="outline" className="mt-3 w-full">
                Manage
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">PayPal</div>
                  <div className="text-sm text-muted-foreground">john.doe@example.com</div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="mt-3 w-full">
                Manage
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg border-dashed flex flex-col items-center justify-center">
              <PiggyBank className="h-8 w-8 text-muted-foreground mb-2" />
              <div className="font-medium">Add Payment Method</div>
              <Button size="sm" variant="outline" className="mt-2">
                Add New
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollectorEarnings;