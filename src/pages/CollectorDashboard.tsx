import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  DollarSign, 
  MapPin, 
  Clock,
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Route,
  Award
} from 'lucide-react';
import { mockPickups, mockCollectorStats } from '@/data/mockData';

const CollectorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user || user.role !== 'collector') {
    return <div>Access denied</div>;
  }

  // Filter available pickup requests (not assigned to anyone or assigned to this collector)
  const availablePickups = mockPickups.filter(pickup => 
    pickup.status === 'pending' || (pickup.collectorId === user.id.toString() && pickup.status !== 'completed')
  );
  
  const myActivePickups = mockPickups.filter(pickup => 
    pickup.collectorId === user.id.toString() && pickup.status === 'accepted'
  );

  const stats = [
    {
      title: 'Today\'s Earnings',
      value: '$85',
      change: '+$12 vs yesterday',
      icon: DollarSign,
      color: 'text-success',
    },
    {
      title: 'Active Pickups',
      value: myActivePickups.length,
      change: '2 in progress',
      icon: Truck,
      color: 'text-primary',
    },
    {
      title: 'Rating',
      value: mockCollectorStats.rating,
      change: 'Based on 45 reviews',
      icon: Star,
      color: 'text-warning',
    },
    {
      title: 'Completion Rate',
      value: `${mockCollectorStats.completionRate}%`,
      change: 'This month',
      icon: Award,
      color: 'text-purple-600',
    },
  ];

  const quickActions = [
    {
      title: 'View Requests',
      description: 'Browse available pickups',
      icon: AlertCircle,
      to: '/collector/requests',
      color: 'bg-primary text-primary-foreground',
    },
    {
      title: 'Active Route',
      description: 'Navigate to pickups',
      icon: Route,
      to: '/collector/active',
      color: 'bg-success text-success-foreground',
    },
    {
      title: 'View Earnings',
      description: 'Track your income',
      icon: TrendingUp,
      to: '/collector/earnings',
      color: 'bg-warning text-white',
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome, {user.name}! 🚛
        </h1>
        <p className="text-muted-foreground">
          Ready to collect some waste and earn rewards? Let's make an impact today!
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

          {/* Available Pickup Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Available Pickup Requests
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/collector/requests">View All</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availablePickups.slice(0, 3).map((pickup) => (
                  <div 
                    key={pickup.id} 
                    className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/collector/pickup/${pickup.id}`)}
                  >
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Truck className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium capitalize">{pickup.wasteType}</p>
                        <Badge variant="secondary" className="text-xs">
                          {pickup.quantity}kg
                        </Badge>
                        <Badge 
                          variant={pickup.status === 'pending' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {pickup.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {pickup.address.split(',')[0]}
                        <Clock className="h-3 w-3 ml-3 mr-1" />
                        {new Date(pickup.preferredTime).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-success">
                        Est. ${pickup.quantity * 2}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        +{pickup.quantity * 5} GC
                      </p>
                    </div>
                  </div>
                ))}
                
                {availablePickups.length === 0 && (
                  <div className="text-center py-8">
                    <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No available pickups right now</p>
                    <p className="text-sm text-muted-foreground">
                      Check back later for new opportunities
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Performance Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-warning" />
                <span>Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Pickups</span>
                  <span className="font-medium">{mockCollectorStats.totalPickups}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Earnings</span>
                  <span className="font-medium text-success">
                    ${mockCollectorStats.totalEarnings}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">GreenCoins Earned</span>
                  <span className="font-medium text-primary">
                    {mockCollectorStats.greenCoinsEarned} GC
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-warning fill-current" />
                    <span className="font-medium">{mockCollectorStats.rating}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Pickups */}
          <Card>
            <CardHeader>
              <CardTitle>My Active Pickups</CardTitle>
            </CardHeader>
            <CardContent>
              {myActivePickups.length > 0 ? (
                <div className="space-y-3">
                  {myActivePickups.map((pickup) => (
                    <div 
                      key={pickup.id} 
                      className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/collector/pickup/${pickup.id}`)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{pickup.wasteType}</span>
                        <Badge variant="default">In Progress</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {pickup.address.split(',')[0]}
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          Scheduled: {new Date(pickup.scheduledDate || pickup.preferredTime).toLocaleString()}
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-3" asChild>
                        <Link to={`/collector/pickup/${pickup.id}`}>View Details</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-sm">No active pickups</p>
                  <Button size="sm" className="mt-2" asChild>
                    <Link to="/collector/requests">Find Pickups</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CollectorDashboard;