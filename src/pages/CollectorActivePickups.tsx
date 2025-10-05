import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Clock, 
  Search,
  Filter,
  Navigation,
  CheckCircle,
  XCircle,
  Truck,
  Recycle
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { apiGet, apiPost } from '@/utils/api.utils';
import { useToast } from '@/hooks/use-toast';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ActivePickup {
  id: number;
  citizenName: string;
  wasteType: string;
  quantity: number;
  address: string;
  scheduledTime: string;
  coordinates: [number, number];
  status: 'in-progress' | 'on-the-way';
  notes: string;
}

const CollectorActivePickups = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pickups, setPickups] = useState<ActivePickup[]>([]);
  const [filteredPickups, setFilteredPickups] = useState<ActivePickup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPickup, setSelectedPickup] = useState<ActivePickup | null>(null);

  if (!user || user.role !== 'collector') {
    return <div>Access denied</div>;
  }

  useEffect(() => {
    fetchActivePickups();
  }, []);

  useEffect(() => {
    filterPickups();
  }, [pickups, searchTerm, statusFilter]);

  const fetchActivePickups = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from the backend
      // const response = await apiGet('/api/collector/active-pickups');
      // For now, we'll use mock data
      
      // Mock data - in a real app, this would come from the API
      const mockPickups: ActivePickup[] = [
        {
          id: 1,
          citizenName: 'John Doe',
          wasteType: 'plastic',
          quantity: 5,
          address: '123 Green Street, EcoCity',
          scheduledTime: '2024-01-15T10:00:00Z',
          coordinates: [-74.0060, 40.7128],
          status: 'on-the-way',
          notes: 'Please ring the doorbell twice. The recycling is in the garage.',
        },
        {
          id: 2,
          citizenName: 'Jane Smith',
          wasteType: 'e-waste',
          quantity: 2,
          address: '456 Earth Avenue, EcoCity',
          scheduledTime: '2024-01-15T11:30:00Z',
          coordinates: [-74.0050, 40.7138],
          status: 'in-progress',
          notes: 'Fragile items. Handle with care.',
        },
        {
          id: 3,
          citizenName: 'Robert Johnson',
          wasteType: 'paper',
          quantity: 10,
          address: '789 Recycle Road, EcoCity',
          scheduledTime: '2024-01-15T14:00:00Z',
          coordinates: [-74.0040, 40.7148],
          status: 'on-the-way',
          notes: 'Large quantity. May need help carrying.',
        },
      ];
      
      setPickups(mockPickups);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch active pickups. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterPickups = () => {
    let result = [...pickups];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(pickup => 
        pickup.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pickup.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pickup.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(pickup => pickup.status === statusFilter);
    }
    
    setFilteredPickups(result);
  };

  const handleCompletePickup = async (pickupId: number) => {
    try {
      // In a real app, this would make an API call
      // await apiPost(`/api/collector/pickups/${pickupId}/complete`, {});
      
      // Update local state
      setPickups(prev => prev.map(pickup => 
        pickup.id === pickupId 
          ? { ...pickup, status: 'completed' } 
          : pickup
      ).filter(pickup => pickup.status !== 'completed'));
      
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

  const handleCancelPickup = async (pickupId: number) => {
    try {
      // In a real app, this would make an API call
      // await apiPost(`/api/collector/pickups/${pickupId}/cancel`, {});
      
      // Update local state
      setPickups(prev => prev.filter(pickup => pickup.id !== pickupId));
      
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
      case 'on-the-way':
        return <Badge className="bg-blue-500">On the Way</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-500">In Progress</Badge>;
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Active Pickups</h1>
            <p className="text-muted-foreground">
              Manage your current pickup routes and deliveries
            </p>
          </div>
          <Button onClick={() => navigate('/collector/requests')}>
            <Recycle className="h-4 w-4 mr-2" />
            Find More Pickups
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by citizen name, waste type or address..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  className="border rounded-md px-3 py-2 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="on-the-way">On the Way</option>
                  <option value="in-progress">In Progress</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Pickup List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
              <p>Loading active pickups...</p>
            </div>
          ) : filteredPickups.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No active pickups</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No pickups match your search criteria.' 
                    : 'You don\'t have any active pickups right now.'}
                </p>
                <Button onClick={() => navigate('/collector/requests')}>
                  Find Pickups
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredPickups.map((pickup) => (
              <Card 
                key={pickup.id} 
                className={`cursor-pointer transition-colors ${selectedPickup?.id === pickup.id ? 'border-primary' : ''}`}
                onClick={() => setSelectedPickup(pickup)}
              >
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary/10 rounded-full mt-0.5">
                          <Truck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-medium capitalize">{pickup.wasteType}</h3>
                            {getStatusBadge(pickup.status)}
                            <Badge variant="secondary">{pickup.quantity} items</Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <User className="h-4 w-4 mr-1" />
                            {pickup.citizenName}
                          </div>
                          <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-4">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {pickup.address.split(',')[0]}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatDate(pickup.scheduledTime)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {pickup.status === 'on-the-way' && (
                        <Button size="sm" onClick={(e) => {
                          e.stopPropagation();
                          handleCompletePickup(pickup.id);
                        }}>
                          Arrived
                        </Button>
                      )}
                      {pickup.status === 'in-progress' && (
                        <Button size="sm" onClick={(e) => {
                          e.stopPropagation();
                          handleCompletePickup(pickup.id);
                        }}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/collector/pickup/${pickup.id}`);
                        }}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Right Column - Map */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Navigation className="h-5 w-5 mr-2" />
                Pickup Route
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-96 rounded-lg overflow-hidden">
                <MapContainer 
                  style={{ height: '500px' }}
                  className="rounded-lg"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filteredPickups.map((pickup) => (
                    <Marker 
                      key={pickup.id} 
                      position={[pickup.coordinates[1], pickup.coordinates[0]]}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold">{pickup.citizenName}</h3>
                          <p className="text-sm">{pickup.address}</p>
                          <p className="text-sm">Waste: {pickup.wasteType} ({pickup.quantity} items)</p>
                          <p className="text-sm">Status: {pickup.status}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Click on a pickup in the list to view details on the map</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CollectorActivePickups;