import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Recycle, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader, 
  Calendar,
  User,
  Plus
} from 'lucide-react';
import { apiGet, apiPost } from '@/utils/api.utils';

interface Pickup {
  id: number;
  waste_type: string;
  quantity: number;
  address: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  collector_id: number | null;
  green_coins_earned: number | null;
  created_at: string;
}

const CitizenPickups = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const response = await apiGet('/api/pickups/my');
        setPickups(response.pickups || []);
      } catch (error) {
        console.error('Error fetching pickups:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPickups();
    }
  }, [user]);

  const handleCancelPickup = async (pickupId: number) => {
    setActionLoading(pickupId);
    try {
      await apiPost(`/api/pickups/${pickupId}/status`, { status: 'cancelled' });
      
      // Update local state
      setPickups(prevPickups => 
        prevPickups.map(pickup => 
          pickup.id === pickupId ? { ...pickup, status: 'cancelled' } : pickup
        )
      );
    } catch (error: any) {
      console.error('Error cancelling pickup:', error);
    } finally {
      setActionLoading(pickupId);
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Pickups</h1>
            <p className="text-muted-foreground">
              Track and manage your waste collection requests
            </p>
          </div>
          <Button asChild>
            <Link to="/citizen/book-pickup">
              <Plus className="h-4 w-4 mr-2" />
              Book New Pickup
            </Link>
          </Button>
        </div>
      </div>

      {pickups.length === 0 ? (
        <Card className="text-center py-12">
          <Recycle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No pickups yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't booked any waste pickups. Start by scheduling your first collection.
          </p>
          <Button asChild>
            <Link to="/citizen/book-pickup">Book Your First Pickup</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {pickups.map((pickup) => (
            <Card key={pickup.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Recycle className="h-5 w-5 text-primary" />
                      <span className="capitalize">{pickup.waste_type} Pickup</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {pickup.quantity} items/bags
                    </p>
                  </div>
                  <Badge 
                    variant={
                      pickup.status === 'completed' ? 'default' : 
                      pickup.status === 'cancelled' ? 'destructive' : 
                      pickup.status === 'accepted' ? 'secondary' : 
                      'outline'
                    }
                  >
                    {pickup.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{pickup.address}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {new Date(pickup.preferred_date).toLocaleDateString()} at {pickup.preferred_time}
                    </span>
                  </div>
                  
                  {pickup.collector_id && (
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Collector assigned</span>
                    </div>
                  )}
                  
                  {pickup.status === 'completed' && pickup.green_coins_earned && (
                    <div className="flex items-center text-sm text-success">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Earned {pickup.green_coins_earned} GreenCoins</span>
                    </div>
                  )}
                  
                  <div className="flex space-x-3 pt-4">
                    {pickup.status === 'pending' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCancelPickup(pickup.id)}
                        disabled={actionLoading === pickup.id}
                      >
                        {actionLoading === pickup.id ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel
                          </>
                        )}
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                    >
                      <Link to={`/citizen/pickups/${pickup.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitizenPickups;