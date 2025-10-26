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
  Loader, 
  Calendar,
  User
} from 'lucide-react';
import { apiGet, apiPost } from '@/utils/api.utils';

interface Pickup {
  id: number;
  user_id: number;
  waste_type: string;
  quantity: number;
  address: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  user_name: string;
  user_email: string;
}

const CollectorRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const response = await apiGet('/api/pickups/available');
        setPickups(response.pickups || []);
      } catch (error) {
        console.error('Error fetching pickups:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPickups();
      // Refresh data every 30 seconds
      const interval = setInterval(fetchPickups, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleAcceptPickup = async (pickupId: number) => {
    setActionLoading(pickupId);
    try {
      const response = await apiPost(`/api/pickups/${pickupId}/status`, { status: 'accepted' });
      
      // Update local state - remove the accepted pickup from the list
      setPickups(prevPickups => 
        prevPickups.filter(pickup => pickup.id !== pickupId)
      );

      // Navigate to active pickups to view it there
      navigate('/collector/active');
    } catch (error: any) {
      console.error('Error accepting pickup:', error);
    } finally {
      setActionLoading(null);
    }
  };

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
        <h1 className="text-3xl font-bold text-foreground mb-2">Available Requests</h1>
        <p className="text-muted-foreground">
          View and accept new waste collection requests in your area
        </p>
      </div>

      {pickups.length === 0 ? (
        <Card className="text-center py-12">
          <Recycle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No requests available</h3>
          <p className="text-muted-foreground mb-6">
            There are currently no new pickup requests in your area.
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pickups.map((pickup) => (
            <Card key={pickup.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Recycle className="h-5 w-5 text-primary" />
                      <span className="capitalize">{pickup.waste_type}</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {pickup.quantity} items/bags
                    </p>
                  </div>
                  <Badge variant="outline">{pickup.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{pickup.user_name}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{pickup.address.split(',')[0]}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {new Date(pickup.preferred_date).toLocaleDateString()} at {pickup.preferred_time}
                    </span>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button 
                      className="flex-1"
                      onClick={() => handleAcceptPickup(pickup.id)}
                      disabled={actionLoading === pickup.id}
                    >
                      {actionLoading === pickup.id ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      asChild
                    >
                      <Link to={`/collector/pickup/${pickup.id}`}>
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

export default CollectorRequests;
