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
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const CitizenBookPickup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    wasteType: 'plastic',
    quantity: 1,
    address: '',
    notes: '',
    preferredDate: '',
    preferredTime: '',
  });

  if (!user || user.role !== 'citizen') {
    return <div>Access denied</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare data for API call with correct field names
      const pickupData = {
        waste_type: formData.wasteType,
        quantity: parseInt(formData.quantity.toString()),
        address: formData.address,
        notes: formData.notes,
        preferred_date: formData.preferredDate,
        preferred_time: formData.preferredTime,
        latitude: latitude,
        longitude: longitude,
      };

      // Make API call to book pickup
      const response = await apiPost('/api/pickups', pickupData);

      toast({
        title: 'Pickup Requested!',
        description: 'Your pickup has been successfully requested. A collector will contact you soon.',
      });

      // Navigate back to dashboard
      navigate('/citizen');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to book pickup. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Book a Pickup</h1>
          <p className="text-muted-foreground">
            Schedule a waste collection at your convenience
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pickup Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Waste Type */}
              <div className="space-y-2">
                <Label htmlFor="wasteType">Waste Type</Label>
                <Select 
                  value={formData.wasteType} 
                  onValueChange={(value) => handleSelectChange('wasteType', value)}
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

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (items/bags)</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Pickup Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your full address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Select Location (optional)</Label>
                <div className="rounded-lg overflow-hidden border" style={{ height: 320 }}>
                  <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                    <TileLayer 
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
                      attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                    />
                    <MapClickSetter onSet={(lat, lon) => { setLatitude(lat); setLongitude(lon); }} />
                    {Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude)) && (
                      <DraggableMarker lat={Number(latitude)} lon={Number(longitude)} onDrag={(lat, lon) => { setLatitude(lat); setLongitude(lon); }} />
                    )}
                  </MapContainer>
                </div>
                <div className="text-sm text-muted-foreground">
                  {Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude)) ? `Lat: ${Number(latitude).toFixed(6)}, Lon: ${Number(longitude).toFixed(6)}` : 'Tap on the map to set a location'}
                </div>
              </div>

              {/* Preferred Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Preferred Date</Label>
                  <Input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <Input
                    id="preferredTime"
                    name="preferredTime"
                    type="time"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any special instructions for the collector"
                />
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/citizen')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? 'Booking...' : 'Book Pickup'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CitizenBookPickup;

// Leaflet marker icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapClickSetter({ onSet }: { onSet: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onSet(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function DraggableMarker({ lat, lon, onDrag }: { lat: number; lon: number; onDrag: (lat: number, lon: number) => void }) {
  const [position, setPosition] = useState<[number, number]>([lat, lon]);
  useMapEvents({});
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
}