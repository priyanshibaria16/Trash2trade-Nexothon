import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  MessageSquare, 
  Navigation,
  CheckCircle,
  XCircle,
  Truck,
  Recycle
} from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { apiGet, apiPost } from '@/utils/api.utils';
import { useToast } from '@/hooks/use-toast';

// Set Mapbox access token (you should use your own token in production)
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

interface PickupDetails {
  id: number;
  citizenName: string;
  citizenPhone: string;
  citizenEmail: string;
  wasteType: string;
  quantity: number;
  address: string;
  preferredTime: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  notes: string;
  coordinates: [number, number];
  greenCoins: number;
}

const CollectorPickupDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [pickup, setPickup] = useState<PickupDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  if (!user || user.role !== 'collector') {
    return <div>Access denied</div>;
  }

  useEffect(() => {
    fetchPickupDetails();
  }, [id]);

  useEffect(() => {
    if (pickup && mapContainer.current) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [pickup]);

  const fetchPickupDetails = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from the backend
      // const response = await apiGet(`/api/collector/pickups/${id}`);
      // For now, we'll use mock data
      
      // Mock data - in a real app, this would come from the API
      const mockPickup: PickupDetails = {
        id: parseInt(id || '1'),
        citizenName: 'John Doe',
        citizenPhone: '+1 (555) 123-4567',
        citizenEmail: 'john.doe@example.com',
        wasteType: 'plastic',
        quantity: 5,
        address: '123 Green Street, EcoCity, EC 12345',
        preferredTime: '2024-01-15T10:00:00Z',
        status: 'accepted',
        notes: 'Please ring the doorbell twice. The recycling is in the garage.',
        coordinates: [-74.0060, 40.7128], // New York coordinates as example
        greenCoins: 15,
      };
      
      setPickup(mockPickup);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch pickup details. Please try again.',
        variant: 'destructive',
      });
      navigate('/collector/requests');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeMap = () => {
    if (!pickup || !mapContainer.current) return;

    // Remove existing map if it exists
    if (map.current) {
      map.current.remove();
    }

    // Create map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: pickup.coordinates,
      zoom: 14,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add marker
    if (marker.current) {
      marker.current.remove();
    }

    marker.current = new mapboxgl.Marker({ color: '#10b981' })
      .setLngLat(pickup.coordinates)
      .addTo(map.current);

    // Add popup to marker
    const popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML(
        `<div class="p-2">
          <h3 class="font-bold">${pickup.citizenName}</h3>
          <p class="text-sm">${pickup.address}</p>
          <p class="text-sm">Waste: ${pickup.wasteType} (${pickup.quantity} items)</p>
        </div>`
      );

    marker.current.setPopup(popup);
  };

  const handleStartPickup = async () => {
    try {
      // In a real app, this would make an API call
      // await apiPost(`/api/collector/pickups/${id}/start`, {});
      
      if (pickup) {
        setPickup({ ...pickup, status: 'in-progress' });
      }
      
      toast({
        title: 'Pickup Started',
        description: 'Pickup is now in progress.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to start pickup. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCompletePickup = async () => {
    try {
      // In a real app, this would make an API call
      // await apiPost(`/api/collector/pickups/${id}/complete`, {});
      
      if (pickup) {
        setPickup({ ...pickup, status: 'completed' });
      }
      
      toast({
        title: 'Pickup Completed',
        description: 'Pickup has been marked as completed.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete pickup. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancelPickup = async () => {
    try {
      // In a real app, this would make an API call
      // await apiPost(`/api/collector/pickups/${id}/cancel`, {});
      
      if (pickup) {
        setPickup({ ...pickup, status: 'cancelled' });
      }
      
      toast({
        title: 'Pickup Cancelled',
        description: 'Pickup has been cancelled.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel pickup. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'accepted':
        return <Badge className="bg-blue-500">Accepted</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-500">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p>Loading pickup details...</p>
        </div>
      </div>
    );
  }

  if (!pickup) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p>Pickup not found.</p>
          <Button onClick={() => navigate('/collector/requests')} className="mt-4">
            Back to Requests
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/collector/requests')} className="mb-4">
          ← Back to Requests
        </Button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Pickup Details</h1>
            <p className="text-muted-foreground">
              View and manage this pickup request
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(pickup.status)}
            <Badge variant="secondary">{pickup.quantity} items</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Citizen Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Citizen Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{pickup.citizenName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{pickup.citizenPhone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{pickup.citizenEmail}</p>
              </div>
              <Button variant="outline" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Citizen
              </Button>
            </CardContent>
          </Card>

          {/* Pickup Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Recycle className="h-5 w-5 mr-2" />
                Pickup Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Waste Type</p>
                <p className="font-medium capitalize">{pickup.wasteType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-medium">{pickup.quantity} items</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Preferred Time</p>
                <p className="font-medium">{formatDate(pickup.preferredTime)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{pickup.address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="font-medium">{pickup.notes || 'No additional notes'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">GreenCoins</p>
                <p className="font-medium text-success">+{pickup.greenCoins} GC</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pickup.status === 'accepted' && (
                <Button onClick={handleStartPickup} className="w-full">
                  <Navigation className="h-4 w-4 mr-2" />
                  Start Pickup
                </Button>
              )}
              {pickup.status === 'in-progress' && (
                <Button onClick={handleCompletePickup} className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Completed
                </Button>
              )}
              {(pickup.status === 'accepted' || pickup.status === 'in-progress') && (
                <Button variant="outline" onClick={handleCancelPickup} className="w-full">
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Pickup
                </Button>
              )}
              <Button variant="outline" className="w-full">
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Pickup Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={mapContainer} 
                className="w-full h-96 rounded-lg overflow-hidden"
                style={{ height: '500px' }}
              />
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{pickup.address}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CollectorPickupDetails;