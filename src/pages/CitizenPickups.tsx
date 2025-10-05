import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Recycle, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search,
  Filter,
  Calendar,
  Truck
} from 'lucide-react';
import { apiGet } from '@/utils/api.utils';
import { useToast } from '@/hooks/use-toast';

interface Pickup {
  id: number;
  wasteType: string;
  quantity: number;
  address: string;
  preferredTime: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  collectorName?: string;
  scheduledDate?: string;
  completedDate?: string;
  greenCoinsEarned?: number;
}

const CitizenPickups = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [filteredPickups, setFilteredPickups] = useState<Pickup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  if (!user || user.role !== 'citizen') {
    return <div>Access denied</div>;
  }

  useEffect(() => {
    fetchPickups();
  }, []);

  useEffect(() => {
    filterPickups();
  }, [pickups, searchTerm, statusFilter]);

  const fetchPickups = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from the backend
      // const response = await apiGet('/api/pickups');
      // For now, we'll use mock data
      
      // Mock data - in a real app, this would come from the API
      const mockPickups: Pickup[] = [
        {
          id: 1,
          wasteType: 'plastic',
          quantity: 5,
          address: '123 Green Street, EcoCity',
          preferredTime: '2024-01-15T10:00:00Z',
          status: 'pending',
        },
        {
          id: 2,
          wasteType: 'e-waste',
          quantity: 2,
          address: '456 Earth Avenue, EcoCity',
          preferredTime: '2024-01-16T14:00:00Z',
          status: 'accepted',
          collectorName: 'Maria Garcia',
          scheduledDate: '2024-01-16T14:00:00Z',
        },
        {
          id: 3,
          wasteType: 'paper',
          quantity: 10,
          address: '789 Recycle Road, EcoCity',
          preferredTime: '2024-01-14T09:00:00Z',
          status: 'completed',
          collectorName: 'Maria Garcia',
          completedDate: '2024-01-14T09:30:00Z',
          greenCoinsEarned: 25,
        },
        {
          id: 4,
          wasteType: 'metal',
          quantity: 3,
          address: '321 Sustainability Blvd, EcoCity',
          preferredTime: '2024-01-18T11:00:00Z',
          status: 'in-progress',
          collectorName: 'John Smith',
        },
      ];
      
      setPickups(mockPickups);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch pickups. Please try again.',
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Pickups</h1>
            <p className="text-muted-foreground">
              View and manage your waste collection requests
            </p>
          </div>
          <Button onClick={() => navigate('/citizen/book-pickup')}>
            <Recycle className="h-4 w-4 mr-2" />
            Book New Pickup
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by waste type or address..."
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
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pickups List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
            <p>Loading pickups...</p>
          </div>
        ) : filteredPickups.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Recycle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No pickups found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No pickups match your search criteria.' 
                  : 'You haven\'t booked any pickups yet.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={() => navigate('/citizen/book-pickup')}>
                  Book Your First Pickup
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredPickups.map((pickup) => (
            <Card key={pickup.id}>
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 rounded-full mt-0.5">
                        <Recycle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-medium capitalize">{pickup.wasteType}</h3>
                          {getStatusBadge(pickup.status)}
                        </div>
                        <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-4">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {pickup.address.split(',')[0]}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(pickup.preferredTime)}
                          </div>
                          {pickup.collectorName && (
                            <div className="flex items-center">
                              <Truck className="h-4 w-4 mr-1" />
                              {pickup.collectorName}
                            </div>
                          )}
                        </div>
                        {pickup.greenCoinsEarned && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                              +{pickup.greenCoinsEarned} GreenCoins earned
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {pickup.status === 'pending' && (
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    )}
                    {pickup.status === 'pending' && (
                      <Button variant="destructive" size="sm">
                        Cancel
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CitizenPickups;