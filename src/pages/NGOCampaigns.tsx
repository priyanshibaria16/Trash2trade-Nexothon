import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play,
  Pause,
  Edit,
  BarChart3,
  Users,
  Leaf,
  Calendar,
  Plus,
  Eye
} from 'lucide-react';

const NGOCampaigns = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: 'EcoCity Cleanup Initiative',
      description: 'Community-wide plastic waste collection drive',
      status: 'active',
      startDate: '2025-09-01',
      endDate: '2025-12-31',
      targetWaste: 5000,
      collectedWaste: 3250,
      targetCitizens: 1000,
      engagedCitizens: 780,
      budget: 10000,
      spent: 6500,
    },
    {
      id: 2,
      title: 'E-Waste Collection Drive',
      description: 'Special campaign for electronic waste recycling',
      status: 'planned',
      startDate: '2025-11-01',
      endDate: '2026-01-31',
      targetWaste: 2000,
      collectedWaste: 0,
      targetCitizens: 500,
      engagedCitizens: 0,
      budget: 5000,
      spent: 0,
    },
    {
      id: 3,
      title: 'School Recycling Program',
      description: 'Educational initiative in local schools',
      status: 'completed',
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      targetWaste: 3000,
      collectedWaste: 3150,
      targetCitizens: 1500,
      engagedCitizens: 1620,
      budget: 7500,
      spent: 7200,
    },
  ]);

  if (!user || user.role !== 'ngo') {
    return <div>Access denied</div>;
  }

  const toggleCampaignStatus = (id: number) => {
    setCampaigns(campaigns.map(campaign => {
      if (campaign.id === id) {
        return {
          ...campaign,
          status: campaign.status === 'active' ? 'paused' : 'active'
        };
      }
      return campaign;
    }));
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/ngo')} className="mb-4">
          ← Back to Dashboard
        </Button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Campaign Management</h1>
            <p className="text-muted-foreground">
              Manage your recycling campaigns and track their progress.
            </p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => navigate('/ngo/sponsor')}>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-3">
                    <span>{campaign.title}</span>
                    <Badge 
                      variant={
                        campaign.status === 'active' ? 'default' : 
                        campaign.status === 'completed' ? 'secondary' : 
                        'outline'
                      }
                    >
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{campaign.description}</p>
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/ngo/campaigns/${campaign.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  {campaign.status !== 'completed' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleCampaignStatus(campaign.id)}
                    >
                      {campaign.status === 'active' ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Waste Collection Progress</span>
                    <span>{campaign.collectedWaste}/{campaign.targetWaste}kg</span>
                  </div>
                  <Progress 
                    value={(campaign.collectedWaste / campaign.targetWaste) * 100} 
                    className="h-2 mb-4" 
                  />
                  
                  <div className="flex justify-between text-sm mb-2">
                    <span>Citizen Engagement</span>
                    <span>{campaign.engagedCitizens}/{campaign.targetCitizens}</span>
                  </div>
                  <Progress 
                    value={(campaign.engagedCitizens / campaign.targetCitizens) * 100} 
                    className="h-2 mb-4" 
                  />
                  
                  <div className="flex justify-between text-sm mb-2">
                    <span>Budget Utilization</span>
                    <span>${campaign.spent}/${campaign.budget}</span>
                  </div>
                  <Progress 
                    value={(campaign.spent / campaign.budget) * 100} 
                    className="h-2" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-medium">
                          {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-success/5 rounded-lg">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-success mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Citizens</p>
                        <p className="font-medium">{campaign.engagedCitizens}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-warning/5 rounded-lg">
                    <div className="flex items-center">
                      <Leaf className="h-5 w-5 text-warning mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Waste</p>
                        <p className="font-medium">{campaign.collectedWaste}kg</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-500/5 rounded-lg">
                    <div className="flex items-center">
                      <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Completion</p>
                        <p className="font-medium">
                          {Math.round((campaign.collectedWaste / campaign.targetWaste) * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NGOCampaigns;