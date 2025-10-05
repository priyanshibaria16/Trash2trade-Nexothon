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
  User,
  Phone
} from 'lucide-react';
import { apiGet, apiPost } from '@/utils/api.utils';
import { useToast } from '@/hooks/use-toast';

interface PickupRequest {
  id: number;
  citizenName: string;
  citizenPhone: string;
  wasteType: string;
  quantity: number;
  address: string;
  preferredTime: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  greenCoins: number;
}

const CollectorRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PickupRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [isLoading, setIsLoading] = useState(true);

  if (!user || user.role !== 'collector') {
    return <div>Access denied</div>;
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from the backend
      // const response = await apiGet('/api/collector/requests');
      // For now, we'll use mock data
      
      // Mock data - in a real app, this would come from the API
      const mockRequests: PickupRequest[] = [
        {
          id: 1,
          citizenName: 'John Doe',
          citizenPhone: '+1 (555) 123-4567',
          wasteType: 'plastic',
          quantity: 5,
          address: '123 Green Street, EcoCity',
          preferredTime: '2024-01-15T10:00:00Z',
          status: 'pending',
          greenCoins: 15,
        },
        {
          id: 2,
          citizenName: 'Jane Smith',
          citizenPhone: '+1 (555) 987-6543',
          wasteType: 'e-waste',
          quantity: 2,
          address: '456 Earth Avenue, EcoCity',
          preferredTime: '2024-01-16T14:00:00Z',
          status: 'pending',
          greenCoins: 25,
        },
        {
          id: 3,
          citizenName: 'Robert Johnson',
          citizenPhone: '+1 (555) 456-7890',
          wasteType: 'paper',
          quantity: 10,
          address: '789 Recycle Road, EcoCity',
          preferredTime: '2024-01-14T09:00:00Z',
          status: 'accepted',
          greenCoins: 20,
        },
      ];
      
      setRequests(mockRequests);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch requests. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    let result = [...requests];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(request => 
        request.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(request => request.status === statusFilter);
    }
    
    setFilteredRequests(result);
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      // In a real app, this would make an API call
      // await apiPost(`/api/collector/requests/${requestId}/accept`, {});
      
      // Update local state
      setRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'accepted' } 
          : request
      ));
      
      toast({
        title: 'Request Accepted',
        description: 'You have successfully accepted this pickup request.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to accept request. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleStartPickup = async (requestId: number) => {
    try {
      // In a real app, this would make an API call
      // await apiPost(`/api/collector/requests/${requestId}/start`, {});
      
      // Update local state
      setRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'in-progress' } 
          : request
      ));
      
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

  const handleCompletePickup = async (requestId: number) => {
    try {
      // In a real app, this would make an API call
      // await apiPost(`/api/collector/requests/${requestId}/complete`, {});
      
      // Update local state
      setRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'completed' } 
          : request
      ));
      
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Pickup Requests</h1>
            <p className="text-muted-foreground">
              Manage incoming waste collection requests
            </p>
          </div>
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

      {/* Requests List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
            <p>Loading requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Recycle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No requests found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No requests match your search criteria.' 
                  : 'There are no pickup requests at the moment.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 rounded-full mt-0.5">
                        <Recycle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-medium capitalize">{request.wasteType}</h3>
                          {getStatusBadge(request.status)}
                          <Badge variant="secondary">{request.quantity} items</Badge>
                        </div>
                        <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-4 mb-2">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {request.citizenName}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {request.citizenPhone}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {request.address.split(',')[0]}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(request.preferredTime)}
                          </div>
                        </div>
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                            +{request.greenCoins} GreenCoins for this pickup
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {request.status === 'pending' && (
                      <Button onClick={() => handleAcceptRequest(request.id)}>
                        Accept
                      </Button>
                    )}
                    {request.status === 'accepted' && (
                      <Button onClick={() => handleStartPickup(request.id)}>
                        Start Pickup
                      </Button>
                    )}
                    {request.status === 'in-progress' && (
                      <Button onClick={() => handleCompletePickup(request.id)}>
                        Complete
                      </Button>
                    )}
                    <Button variant="outline">
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

export default CollectorRequests;