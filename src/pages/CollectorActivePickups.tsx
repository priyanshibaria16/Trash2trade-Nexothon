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
  User
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { apiGet, apiPost } from '@/utils/api.utils';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Pickup {
  id: number;
  user_id: number;
  waste_type: string;
  quantity: number;
  address: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  collector_id: number | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  user_name: string;
  user_email: string;
}

const CollectorActivePickups = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const response = await apiGet('/api/pickups/collector');
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

  const handleStartPickup = async (pickupId: number) => {
    setActionLoading(pickupId);
    try {
      await apiPost(`/api/pickups/${pickupId}/status`, { status: 'in-progress' });
      
      // Update local state
      setPickups(prevPickups => 
        prevPickups.map(pickup => 
          pickup.id === pickupId ? { ...pickup, status: 'in-progress' } : pickup
        )
      );
    } catch (error: any) {
      console.error('Error starting pickup:', error);
    } finally {
      setActionLoading(pickupId);
    }
  };

  const handleCompletePickup = async (pickupId: number) => {
    setActionLoading(pickupId);
    try {
      await apiPost(`/api/pickups/${pickupId}/status`, { status: 'completed' });
      
      // Update local state
      setPickups(prevPickups => 
        prevPickups.map(pickup => 
          pickup.id === pickupId ? { ...pickup, status: 'completed' } : pickup
        )
      );
    } catch (error: any) {
      console.error('Error completing pickup:', error);
    } finally {
      setActionLoading(pickupId);
    }
  };

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

  const activePickups = pickups.filter(pickup => 
    pickup.status === 'accepted' || pickup.status === 'in-progress'
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Active Pickups</h1>
        <p className="text-muted-foreground">
          Manage your current waste collection requests
        </p>
      </div>

      {activePickups.length === 0 ? (
        <Card className="text-center py-12">
          <Recycle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No active pickups</h3>
          <p className="text-muted-foreground mb-6">
            You don't have any active pickups at the moment.
          </p>
          <Button asChild>
            <Link to="/collector/requests">View Available Requests</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pickup List */}
          <div className="space-y-6">
            {activePickups.map((pickup) => (
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
                        pickup.status === 'in-progress' ? 'secondary' : 
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
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{pickup.user_name}</span>
                    </div>
                    
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
                    
                    <div className="flex space-x-3 pt-4">
                      {pickup.status === 'accepted' && (
                        <Button 
                          size="sm"
                          onClick={() => handleStartPickup(pickup.id)}
                          disabled={actionLoading === pickup.id}
                        >
                          {actionLoading === pickup.id ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Start Pickup
                            </>
                          )}
                        </Button>
                      )}
                      
                      {pickup.status === 'in-progress' && (
                        <Button 
                          size="sm"
                          onClick={() => handleCompletePickup(pickup.id)}
                          disabled={actionLoading === pickup.id}
                        >
                          {actionLoading === pickup.id ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Complete Pickup
                            </>
                          )}
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
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

          {/* Map View */}
          <div className="h-full">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Map View</CardTitle>
              </CardHeader>
              <CardContent className="h-full p-0">
                <MapContainer 
                  style={{ height: '100%' }}
                  className="rounded-lg"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {activePickups
                    .filter(pickup => pickup.latitude && pickup.longitude)
                    .map((pickup) => (
                      <Marker 
                        key={pickup.id} 
                        position={[pickup.latitude!, pickup.longitude!]}
                      >
                        <Popup>
                          <div className="text-sm">
                            <div className="font-medium capitalize">{pickup.waste_type} Pickup</div>
                            <div className="text-muted-foreground">{pickup.address}</div>
                            <div className="mt-1">
                              <Badge 
                                variant={
                                  pickup.status === 'completed' ? 'default' : 
                                  pickup.status === 'cancelled' ? 'destructive' : 
                                  pickup.status === 'in-progress' ? 'secondary' : 
                                  'outline'
                                }
                              >
                                {pickup.status}
                              </Badge>
                            </div>
                            <Button 
                              size="sm" 
                              className="mt-2 w-full"
                              asChild
                            >
                              <Link to={`/collector/pickup/${pickup.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                </MapContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectorActivePickups;