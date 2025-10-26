import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiPost } from '@/utils/api.utils';
import { wasteTypes } from '@/data/mockData';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Webpack
const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

const CitizenBookPickup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [wasteType, setWasteType] = useState('plastic');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [frequency, setFrequency] = useState('one-time');
  const [status] = useState('pending');
  const [createdAt] = useState(new Date().toISOString().split('T')[0]);
  const [updatedAt] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [map, setMap] = useState<any>(null);

  // Map click handler component
  const MapClickSetter = ({ onSet }: { onSet: (lat: number, lon: number) => void }) => {
    useMapEvents({
      click(e) {
        onSet(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  // Map center setter component
  const MapCenterSetter = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    React.useEffect(() => {
      map.setView(center, Math.max(map.getZoom(), 14));
    }, [center, map]);
    return null;
  };

  // Draggable marker component
  const DraggableMarker = ({ 
    lat, 
    lon, 
    onDrag 
  }: { 
    lat: number; 
    lon: number; 
    onDrag: (lat: number, lon: number) => void 
  }) => {
    const [position, setPosition] = useState<[number, number]>([lat, lon]);
    
    return (
      <Marker
        position={position}
        draggable
        eventHandlers={{
          dragend: (e) => {
            const m = e.target as any;
            const p = m.getLatLng();
            setPosition([p.lat, p.lng]);
            onDrag(p.lat, p.lng);
          },
        }}
      />
    );
  };

  const handleMapClick = (lat: number, lon: number) => {
    setLatitude(lat);
    setLongitude(lon);
    setSearchResults([]);
  };

  const handleDrag = (lat: number, lon: number) => {
    setLatitude(lat);
    setLongitude(lon);
  };

  const handleSearchKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await handleSearch();
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setSearching(true);
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5`;
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setSearchResults([]);
      toast({
        title: 'Search failed',
        description: err?.message || 'Unable to search address. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSearching(false);
    }
  };

  const handleSearchResultClick = (result: any) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    setLatitude(lat);
    setLongitude(lon);
    setMapCenter([lat, lon]);
    setSearchResults([]);
    setSearchQuery(result.display_name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const pickupData = {
        wasteType,
        quantity: parseInt(quantity, 10),
        address,
        notes,
        preferredDate: date,
        preferredTime: time,
        frequency,
        status,
        latitude,
        longitude,
      };

      await apiPost('/api/pickups', pickupData);

      toast({
        title: 'Pickup Scheduled!',
        description: 'Your waste pickup has been scheduled successfully.',
      });

      navigate('/citizen/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to schedule pickup. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to book a pickup.</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Book a Pickup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value={user?.name || ''} readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" value={user?.email || ''} readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input 
                  id="phone" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="wasteType" className="text-right">
                  Waste Type
                </Label>
                <Select 
                  value={wasteType} 
                  onValueChange={setWasteType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select waste type" />
                  </SelectTrigger>
                  <SelectContent>
                    {wasteTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center">
                          <span className="mr-2">{type.icon}</span>
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity (kg)
                </Label>
                <Input 
                  id="quantity" 
                  type="number" 
                  min="1" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)} 
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Textarea 
                  id="address" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <div className="col-span-3">
                  <MapContainer
                    center={[latitude || 20.5937, longitude || 78.9629]}
                    zoom={5}
                    className="h-64 w-full"
                    whenCreated={setMap}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {latitude !== null && longitude !== null && (
                      <DraggableMarker 
                        lat={latitude} 
                        lon={longitude} 
                        onDrag={handleDrag} 
                      />
                    )}
                    <MapClickSetter onSet={handleMapClick} />
                    {latitude !== null && longitude !== null && (
                      <MapCenterSetter center={[latitude, longitude]} />
                    )}
                  </MapContainer>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="search" className="text-right">
                  Search Location
                </Label>
                <div className="col-span-3">
                  <Input
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                  />
                  {searching && <div className="text-sm text-muted-foreground mt-1">Searching...</div>}
                  {searchResults.length > 0 && (
                    <div className="mt-2 border rounded-md max-h-40 overflow-auto">
                      {searchResults.map((result) => (
                        <div
                          key={result.place_id}
                          className="cursor-pointer p-2 hover:bg-accent hover:text-accent-foreground text-sm"
                          onClick={() => handleSearchResultClick(result)}
                        >
                          {result.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Pickup Date
                </Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Pickup Time
                </Label>
                <Input 
                  id="time" 
                  type="time" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)} 
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="frequency" className="text-right">
                  Frequency
                </Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-time</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Additional Notes
                </Label>
                <Textarea 
                  id="notes" 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  placeholder="Any special instructions for the collector"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 pt-4">
                <div className="col-start-2 col-span-3 flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/citizen')}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Schedule Pickup'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CitizenBookPickup;