import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Leaf, 
  Users, 
  Globe, 
  TrendingUp, 
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { mockImpactData, wasteTypes } from '@/data/mockData';

const NGOImpactTracker = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('monthly');
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  if (!user || user.role !== 'ngo') {
    return <div>Access denied</div>;
  }

  // Mock data for campaigns
  const campaigns = [
    { id: 'all', name: 'All Campaigns' },
    { id: 'eco-city', name: 'EcoCity Initiative' },
    { id: 'e-waste', name: 'E-Waste Collection Drive' },
    { id: 'school-program', name: 'School Recycling Program' },
  ];

  // Mock data for waste composition
  const wasteComposition = [
    { name: 'Plastic', value: 45, color: '#ef4444' },
    { name: 'Paper', value: 25, color: '#f59e0b' },
    { name: 'Metal', value: 15, color: '#6b7280' },
    { name: 'E-Waste', value: 10, color: '#8b5cf6' },
    { name: 'Other', value: 5, color: '#10b981' },
  ];

  // Mock data for collector performance
  const collectorPerformance = [
    { name: 'Maria Garcia', pickups: 42, waste: 850, co2: 420 },
    { name: 'John Smith', pickups: 38, waste: 720, co2: 360 },
    { name: 'Priya Patel', pickups: 35, waste: 680, co2: 340 },
    { name: 'Robert Johnson', pickups: 32, waste: 620, co2: 310 },
    { name: 'Sarah Wilson', pickups: 28, waste: 540, co2: 270 },
  ];

  // Mock data for citizen engagement
  const citizenEngagement = [
    { month: 'Jan', newUsers: 45, activeUsers: 120 },
    { month: 'Feb', newUsers: 52, activeUsers: 135 },
    { month: 'Mar', newUsers: 48, activeUsers: 142 },
    { month: 'Apr', newUsers: 61, activeUsers: 158 },
    { month: 'May', newUsers: 55, activeUsers: 165 },
    { month: 'Jun', newUsers: 67, activeUsers: 178 },
  ];

  const handleExport = () => {
    // In a real app, this would export the data to a file
    alert('Export functionality would be implemented here');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/ngo')} className="mb-4">
          ← Back to Dashboard
        </Button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Impact Tracker</h1>
            <p className="text-muted-foreground">
              Monitor and analyze the environmental impact of your campaigns.
            </p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by:</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Time Range:</span>
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="border rounded-md px-2 py-1 text-sm"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Campaign:</span>
                <select 
                  value={selectedCampaign} 
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  className="border rounded-md px-2 py-1 text-sm"
                >
                  {campaigns.map(campaign => (
                    <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Waste Recycled</p>
                <p className="text-2xl font-bold">2,500 kg</p>
                <p className="text-xs text-success flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  12% from last month
                </p>
              </div>
              <Leaf className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Citizens Engaged</p>
                <p className="text-2xl font-bold">1,240</p>
                <p className="text-xs text-success flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  8% from last month
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                <p className="text-2xl font-bold">1,200 kg</p>
                <p className="text-xs text-success flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  15% from last month
                </p>
              </div>
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pickups Completed</p>
                <p className="text-2xl font-bold">342</p>
                <p className="text-xs text-success flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  10% from last month
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Waste Collection Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Waste Collection Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockImpactData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="recycled" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Waste Recycled (kg)"
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="co2" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="CO₂ Saved (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Waste Composition */}
        <Card>
          <CardHeader>
            <CardTitle>Waste Composition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wasteComposition}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {wasteComposition.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}kg`, 'Weight']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Citizen Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Citizen Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={citizenEngagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="newUsers" fill="#8b5cf6" name="New Users" />
                  <Bar dataKey="activeUsers" fill="#0ea5e9" name="Active Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Collector Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Collectors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={collectorPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pickups" fill="#10b981" name="Pickups" />
                  <Bar dataKey="waste" fill="#f59e0b" name="Waste (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Insights & Recommendations</CardTitle>
          </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-primary/5 rounded-lg">
              <h3 className="font-medium mb-2">Peak Activity</h3>
              <p className="text-sm text-muted-foreground">
                Collection activity peaks on weekends. Consider scheduling more pickups during these times.
              </p>
            </div>
            
            <div className="p-4 bg-success/5 rounded-lg">
              <h3 className="font-medium mb-2">Top Performing</h3>
              <p className="text-sm text-muted-foreground">
                The EcoCity Initiative has exceeded its targets by 25%. Consider expanding this program.
              </p>
            </div>
            
            <div className="p-4 bg-warning/5 rounded-lg">
              <h3 className="font-medium mb-2">Opportunity</h3>
              <p className="text-sm text-muted-foreground">
                E-waste collection is 30% below target. Launch a targeted awareness campaign.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NGOImpactTracker;