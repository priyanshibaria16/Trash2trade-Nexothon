import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  BarChart3, 
  Users, 
  Leaf,
  TrendingUp,
  Target,
  Award,
  Globe,
  Plus,
  Eye
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockNGOImpact, mockImpactData } from '@/data/mockData';

const NGODashboard = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'ngo') {
    return <div>Access denied</div>;
  }

  const stats = [
    {
      title: 'Pickups Sponsored',
      value: mockNGOImpact.pickupsSponsored,
      change: '+12 this month',
      icon: Heart,
      color: 'text-primary',
    },
    {
      title: 'Waste Recycled',
      value: `${mockNGOImpact.wasteRecycled}kg`,
      change: '+180kg this month',
      icon: Leaf,
      color: 'text-success',
    },
    {
      title: 'CO₂ Saved',
      value: `${mockNGOImpact.co2Saved}kg`,
      change: '+95kg this month',
      icon: Globe,
      color: 'text-blue-600',
    },
    {
      title: 'Total Investment',
      value: `$${mockNGOImpact.totalInvestment}`,
      change: '$500 this month',
      icon: Target,
      color: 'text-purple-600',
    },
  ];

  const quickActions = [
    {
      title: 'Sponsor Drive',
      description: 'Create new collection drive',
      icon: Plus,
      to: '/ngo/sponsor',
      color: 'bg-primary text-primary-foreground',
    },
    {
      title: 'View Impact',
      description: 'Detailed analytics',
      icon: Eye,
      to: '/ngo/impact',
      color: 'bg-success text-success-foreground',
    },
    {
      title: 'Reports',
      description: 'Generate CSR reports',
      icon: BarChart3,
      to: '/ngo/reports',
      color: 'bg-warning text-white',
    },
  ];

  const currentCampaigns = [
    {
      id: 1,
      title: 'Clean EcoCity Initiative',
      target: 500,
      collected: 325,
      budget: 2000,
      spent: 1300,
      status: 'active',
    },
    {
      id: 2,
      title: 'E-Waste Collection Drive',
      target: 200,
      collected: 180,
      budget: 1500,
      spent: 1350,
      status: 'active',
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome, {user.name}! 🌍
        </h1>
        <p className="text-muted-foreground">
          Track your environmental impact and manage sponsorship campaigns.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-success">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      asChild
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center text-center space-y-2"
                    >
                      <Link to={action.to}>
                        <div className={`p-2 rounded-full ${action.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">{action.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {action.description}
                          </div>
                        </div>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Impact Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Impact Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockImpactData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      dataKey="month" 
                      className="text-muted-foreground"
                    />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="recycled" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={2}
                      name="Waste Recycled (kg)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="co2" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="CO₂ Saved (kg)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Active Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Active Campaigns
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/ngo/campaigns">View All</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {currentCampaigns.map((campaign) => (
                  <div key={campaign.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{campaign.title}</h3>
                      <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Collection Progress</span>
                          <span>{campaign.collected}/{campaign.target}kg</span>
                        </div>
                        <Progress 
                          value={(campaign.collected / campaign.target) * 100} 
                          className="h-2 mb-3" 
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Budget Used</span>
                          <span>${campaign.spent}/${campaign.budget}</span>
                        </div>
                        <Progress 
                          value={(campaign.spent / campaign.budget) * 100} 
                          className="h-2 mb-3" 
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>
                        {Math.round((campaign.collected / campaign.target) * 100)}% complete
                      </span>
                      <span>
                        ${campaign.budget - campaign.spent} remaining
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* This Month's Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-warning" />
                <span>This Month</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm">Citizens Helped</span>
                  </div>
                  <span className="font-medium">234</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Leaf className="h-4 w-4 text-success" />
                    <span className="text-sm">Waste Diverted</span>
                  </div>
                  <span className="font-medium">1.2 tons</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Carbon Impact</span>
                  </div>
                  <span className="font-medium">-580kg CO₂</span>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">98%</p>
                    <p className="text-sm text-muted-foreground">Goal Achievement</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Milestones */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">3 tons waste recycled</p>
                    <p className="text-xs text-muted-foreground">Achievement in 2 weeks</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">1000 citizens impacted</p>
                    <p className="text-xs text-muted-foreground">Achievement in 1 month</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Carbon neutral milestone</p>
                    <p className="text-xs text-muted-foreground">Achievement in 3 months</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;