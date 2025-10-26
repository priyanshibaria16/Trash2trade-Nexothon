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
  Route
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
  const [selectedPickups, setSelectedPickups] = useState<number[]>([]);

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
      // Refresh data every 30 seconds
      const interval = setInterval(fetchPickups, 30000);
      return () => clearInterval(interval);
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

  // Toggle selection of a pickup
  const togglePickupSelection = (pickupId: number) => {
    setSelectedPickups(prev => 
      prev.includes(pickupId) 
        ? prev.filter(id => id !== pickupId) 
        : [...prev, pickupId]
    );
  };

  // Select all pickups
  const selectAllPickups = () => {
    const activePickupIds = activePickups.map(p => p.id);
    setSelectedPickups(activePickupIds);
  };

  // Clear all selections
  const clearSelection = () => {
    setSelectedPickups([]);
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  // Simple greedy algorithm for route optimization (nearest neighbor)
  const optimizeRoute = (pickups: Pickup[]): Pickup[] => {
    if (pickups.length <= 1) return pickups;
    
    // Start with the first pickup
    const sortedPickups = [...pickups];
    const route: Pickup[] = [sortedPickups.shift()!];
    
    // Keep finding the nearest unvisited pickup
    while (sortedPickups.length > 0) {
      const current = route[route.length - 1];
      let nearestIndex = 0;
      let minDistance = Infinity;
      
      // Find the nearest pickup to the current one
      sortedPickups.forEach((pickup, index) => {
        if (current.latitude && current.longitude && pickup.latitude && pickup.longitude) {
          const distance = calculateDistance(
            current.latitude, 
            current.longitude, 
            pickup.latitude, 
            pickup.longitude
          );
          
          if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = index;
          }
        }
      });
      
      // Add the nearest pickup to the route
      route.push(sortedPickups.splice(nearestIndex, 1)[0]);
    }
    
    return route;
  };

  // Open Google Maps with optimized route
  const openOptimizedRoute = () => {
    if (selectedPickups.length === 0) return;
    
    // Get selected pickup objects
    const selectedPickupObjects = pickups.filter(p => 
      selectedPickups.includes(p.id) && 
      p.latitude && 
      p.longitude
    );
    
    if (selectedPickupObjects.length === 0) return;
    
    // Optimize the route
    const optimizedRoute = optimizeRoute(selectedPickupObjects);
    
    // Build Google Maps URL
    let url = 'https://www.google.com/maps/dir/?api=1';
    
    // Set origin (first pickup)
    const origin = optimizedRoute[0];
    url += `&origin=${origin.latitude},${origin.longitude}`;
    
    // Set destination (last pickup)
    const destination = optimizedRoute[optimizedRoute.length - 1];
    url += `&destination=${destination.latitude},${destination.longitude}`;
    
    // Add waypoints (middle pickups)
    if (optimizedRoute.length > 2) {
      const waypoints = optimizedRoute
        .slice(1, optimizedRoute.length - 1)
        .map(p => `${p.latitude},${p.longitude}`)
        .join('|');
      url += `&waypoints=${waypoints}`;
    }
    
    // Open in new tab
    window.open(url, '_blank');
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
        <div className="space-y-6">
          {/* Route Optimization Controls */}
          {activePickups.length > 1 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center">
                    <span className="mr-2 font-medium">Select pickups:</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={selectAllPickups}
                      className="mr-2"
                    >
                      Select All
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearSelection}
                    >
                      Clear
                    </Button>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="mr-2 font-medium">
                      {selectedPickups.length} selected
                    </span>
                    <Button 
                      onClick={openOptimizedRoute}
                      disabled={selectedPickups.length < 2}
                      className="flex items-center"
                    >
                      <Route className="h-4 w-4 mr-2" />
                      Start Route in Google Maps
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Pickup List */}
            <div className="space-y-6">
              {activePickups.map((pickup) => (
                <Card key={pickup.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        {activePickups.length > 1 && (
                          <input
                            type="checkbox"
                            checked={selectedPickups.includes(pickup.id)}
                            onChange={() => togglePickupSelection(pickup.id)}
                            className="h-4 w-4 mr-3 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        )}
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <Recycle className="h-5 w-5 text-primary" />
                            <span className="capitalize">{pickup.waste_type} Pickup</span>
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {pickup.quantity} items/bags
                          </p>
                        </div>
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
                    center={[20.5937, 78.9629]} // India approx center
                    zoom={5}
                    scrollWheelZoom
                    style={{ height: '100%' }}
                    className="rounded-lg"
                  >
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                    />
                    {activePickups
                      .map((pickup) => ({
                        ...pickup,
                        latNum: Number(pickup.latitude),
                        lonNum: Number(pickup.longitude),
                      }))
                      .filter(p => Number.isFinite(p.latNum) && Number.isFinite(p.lonNum) && !(Math.abs(p.latNum) < 0.0001 && Math.abs(p.lonNum) < 0.0001))
                      .map((pickup) => (
                        <Marker 
                          key={pickup.id} 
                          position={[pickup.latNum, pickup.lonNum]}
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
                    <FitToMarkers points={activePickups
                      .map((p) => ({ lat: Number(p.latitude), lon: Number(p.longitude) }))
                      .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lon))
                    } />
                  </MapContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function FitToMarkers({ points }: { points: { lat: number; lon: number }[] }) {
  const map = useMap();
  React.useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(p => L.latLng(p.lat, p.lon)));
      map.fitBounds(bounds.pad(0.2), { animate: true });
    } else {
      map.setView([20.5937, 78.9629], 5);
    }
  }, [points, map]);
  return null;
}

export default CollectorActivePickups;