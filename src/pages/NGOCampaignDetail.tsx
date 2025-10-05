import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Leaf, 
  Users, 
  Globe, 
  Calendar,
  Play,
  Pause,
  Edit,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const NGOCampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'ngo') {
    return <div>Access denied</div>;
  }

  // Mock campaign data
  const campaign = {
    id: 1,
    title: 'EcoCity Cleanup Initiative',
    description: 'Community-wide plastic waste collection drive aimed at reducing plastic pollution in EcoCity neighborhoods.',
    status: 'active',
    startDate: '2025-09-01',
    endDate: '2025-12-31',
    targetWaste: 5000,
    collectedWaste: 3250,
    targetCitizens: 1000,
    engagedCitizens: 780,
    budget: 10000,
    spent: 6500,
  };

  // Mock data for charts
  const wasteCollectionData = [
    { date: '2025-09-01', amount: 150 },
    { date: '2025-09-08', amount: 320 },
    { date: '2025-09-15', amount: 480 },
    { date: '2025-09-22', amount: 620 },
    { date: '2025-09-29', amount: 780 },
    { date: '2025-10-06', amount: 950 },
  ];

  const citizenEngagementData = [
    { week: 'Week 1', citizens: 45 },
    { week: 'Week 2', citizens: 62 },
    { week: 'Week 3', citizens: 78 },
    { week: 'Week 4', citizens: 95 },
    { week: 'Week 5', citizens: 112 },
    { week: 'Week 6', citizens: 130 },
  ];

  const toggleCampaignStatus = () => {
    // In a real app, this would update the campaign status
    alert(`Campaign ${campaign.status === 'active' ? 'paused' : 'resumed'} successfully`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/ngo/campaigns')} className="mb-4">
          ← Back to Campaigns
        </Button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{campaign.title}</h1>
            <p className="text-muted-foreground">{campaign.description}</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={toggleCampaignStatus}>
              {campaign.status === 'active' ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Campaign
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Resume Campaign
                </>
              )}
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
          </div>
        </div>
      </div>

      {/* Campaign Status */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Badge 
                variant={
                  campaign.status === 'active' ? 'default' : 
                  campaign.status === 'completed' ? 'secondary' : 
                  'outline'
                }
              >
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </Badge>
              <div className="text-sm text-muted-foreground">
                {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
              </div>
            </div>
            <div className="text-sm">
              <span className="font-medium">{Math.round((campaign.collectedWaste / campaign.targetWaste) * 100)}%</span> complete
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Metrics */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-success" />
              <span>Waste Collection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-2xl font-bold mb-2">
              <span>{campaign.collectedWaste}kg</span>
              <span className="text-muted-foreground">/ {campaign.targetWaste}kg</span>
            </div>
            <Progress value={(campaign.collectedWaste / campaign.targetWaste) * 100} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{campaign.targetWaste - campaign.collectedWaste}kg remaining</span>
              <span>{Math.round((campaign.collectedWaste / campaign.targetWaste) * 100)}% complete</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Citizen Engagement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-2xl font-bold mb-2">
              <span>{campaign.engagedCitizens}</span>
              <span className="text-muted-foreground">/ {campaign.targetCitizens}</span>
            </div>
            <Progress value={(campaign.engagedCitizens / campaign.targetCitizens) * 100} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{campaign.targetCitizens - campaign.engagedCitizens} more needed</span>
              <span>{Math.round((campaign.engagedCitizens / campaign.targetCitizens) * 100)}% complete</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <span>Budget Utilization</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-2xl font-bold mb-2">
              <span>${campaign.spent}</span>
              <span className="text-muted-foreground">/ ${campaign.budget}</span>
            </div>
            <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>${campaign.budget - campaign.spent} remaining</span>
              <span>{Math.round((campaign.spent / campaign.budget) * 100)}% used</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Waste Collection Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Waste Collection Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wasteCollectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#10b981" name="Waste Collected (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Citizen Engagement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Citizen Engagement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={citizenEngagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="citizens" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                    name="Engaged Citizens"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Details */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Campaign Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">{campaign.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium">{new Date(campaign.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date</span>
                  <span className="font-medium">{new Date(campaign.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">4 months</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Targets & Goals</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Waste Target</span>
                  <span className="font-medium">{campaign.targetWaste}kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Citizen Target</span>
                  <span className="font-medium">{campaign.targetCitizens}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-medium">${campaign.budget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CO₂ Savings Goal</span>
                  <span className="font-medium">1,200kg</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NGOCampaignDetail;