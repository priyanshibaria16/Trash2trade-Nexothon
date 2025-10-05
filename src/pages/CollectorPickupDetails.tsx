import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  ArrowLeft
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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
  notes: string | null;
  preferred_date: string;
  preferred_time: string;
  status: string;
  collector_id: number | null;
  scheduled_date: string | null;
  completed_date: string | null;
  green_coins_earned: number | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  user_name: string;
  user_email: string;
}

const CollectorPickupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pickup, setPickup] = useState<Pickup | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchPickup = async () => {
      try {
        const response = await apiGet(`/api/pickups/${id}`);
        setPickup(response.pickup);
      } catch (error) {
        console.error('Error fetching pickup:', error);
        navigate('/collector/active-pickups');
      } finally {
        setLoading(false);
      }
    };

    if (id && user) {
      fetchPickup();
    }
  }, [id, user]);

  const handleStartPickup = async () => {
    if (!pickup) return;
    
    setActionLoading('start');
    try {
      await apiPost(`/api/pickups/${pickup.id}/status`, { status: 'in-progress' });
      
      // Update local state
      setPickup({ ...pickup, status: 'in-progress' });
    } catch (error: any) {
      console.error('Error starting pickup:', error);
    } finally {
      setActionLoading('start');
    }
  };

  const handleCompletePickup = async () => {
    if (!pickup) return;
    
    setActionLoading('complete');
    try {
      await apiPost(`/api/pickups/${pickup.id}/status`, { status: 'completed' });
      
      // Update local state
      setPickup({ ...pickup, status: 'completed' });
    } catch (error: any) {
      console.error('Error completing pickup:', error);
    } finally {
      setActionLoading('complete');
    }
  };

  const handleCancelPickup = async () => {
    if (!pickup) return;
    
    setActionLoading('cancel');
    try {
      await apiPost(`/api/pickups/${pickup.id}/status`, { status: 'cancelled' });
      
      // Update local state
      setPickup({ ...pickup, status: 'cancelled' });
    } catch (error: any) {
      console.error('Error cancelling pickup:', error);
    } finally {
      setActionLoading('cancel');
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

  if (!pickup) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Pickup not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/collector/active-pickups">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Active Pickups
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pickup Details */}
        <div className="space-y-6">
          <Card>
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
                <div>
                  <h3 className="text-sm font-medium mb-2">Citizen Details</h3>
                  <div className="flex items-center text-sm p-3 border rounded-lg">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{pickup.user_name}</div>
                      <div className="text-muted-foreground">{pickup.user_email}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Pickup Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{pickup.address}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        Preferred: {new Date(pickup.preferred_date).toLocaleDateString()} at {pickup.preferred_time}
                      </span>
                    </div>
                    
                    {pickup.scheduled_date && (
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          Scheduled: {new Date(pickup.scheduled_date).toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    {pickup.notes && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Notes:</p>
                        <p className="text-muted-foreground">{pickup.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {pickup.status === 'completed' && pickup.green_coins_earned && (
                  <div className="p-3 bg-success/10 rounded-lg">
                    <div className="flex items-center text-success">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Earned {pickup.green_coins_earned} GreenCoins</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pickup.status === 'accepted' && (
                  <Button 
                    className="w-full"
                    onClick={handleStartPickup}
                    disabled={actionLoading === 'start'}
                  >
                    {actionLoading === 'start' ? (
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
                    className="w-full"
                    onClick={handleCompletePickup}
                    disabled={actionLoading === 'complete'}
                  >
                    {actionLoading === 'complete' ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Pickup
                      </>
                    )}
                  </Button>
                )}
                
                {(pickup.status === 'accepted' || pickup.status === 'in-progress') && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleCancelPickup}
                    disabled={actionLoading === 'cancel'}
                  >
                    {actionLoading === 'cancel' ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Pickup
                      </>
                    )}
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  asChild
                >
                  <Link to="/collector/active-pickups">
                    Back to Active Pickups
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map View */}
        <div className="h-full">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="h-full p-0">
              {pickup.latitude && pickup.longitude ? (
                <div style={{ height: '400px', border: '1px solid #ccc', borderRadius: '8px' }} className="flex items-center justify-center">
                  <div className="text-center p-4">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Pickup Location</h3>
                    <p className="text-muted-foreground mb-4">{pickup.address}</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Latitude: {pickup.latitude.toFixed(6)}</p>
                      <p>Longitude: {pickup.longitude.toFixed(6)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Location not available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CollectorPickupDetails;