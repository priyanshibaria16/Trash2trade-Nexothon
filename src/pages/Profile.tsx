import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save, 
  Key,
  CreditCard,
  Truck,
  Heart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    bio: '',
  });

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real app, this would make an API call to update the profile
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been successfully updated.',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case 'citizen': return <User className="h-4 w-4" />;
      case 'collector': return <Truck className="h-4 w-4" />;
      case 'ngo': return <Heart className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = () => {
    switch (user.role) {
      case 'citizen': return 'bg-blue-500';
      case 'collector': return 'bg-green-500';
      case 'ngo': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="relative inline-block mb-4">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src="" alt={user.name} />
                  <AvatarFallback className="text-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  className="absolute bottom-0 right-0 rounded-full p-2 h-8 w-8"
                  variant="outline"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <h2 className="text-xl font-bold">{user.name}</h2>
              <div className="flex items-center justify-center mt-1">
                {getRoleIcon()}
                <span className="ml-2 text-sm capitalize">{user.role}</span>
              </div>
              
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor()} text-white`}>
                  {user.role}
                </div>
                {user.greenCoins !== undefined && (
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-success text-success-foreground">
                    {user.greenCoins} GC
                  </div>
                )}
                {user.ecoScore !== undefined && (
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-warning text-white">
                    Eco Score: {user.ecoScore}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Payment Methods
              </Button>
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Personal Information</span>
                {isEditing ? (
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">{user.name}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      {user.email}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {formData.phone || 'Not provided'}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {formData.address || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <div className="p-2 bg-muted rounded-md min-h-[60px]">
                    {formData.bio || 'No bio provided'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Role-Specific Information */}
          <Card>
            <CardHeader>
              <CardTitle>Role Information</CardTitle>
            </CardHeader>
            <CardContent>
              {user.role === 'citizen' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <div className="text-sm text-muted-foreground">GreenCoins Balance</div>
                      <div className="text-2xl font-bold text-success">{user.greenCoins || 0} GC</div>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <div className="text-sm text-muted-foreground">Eco Score</div>
                      <div className="text-2xl font-bold text-warning">{user.ecoScore || 0}</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Earn GreenCoins by participating in recycling activities and maintain a high Eco Score 
                    by consistently contributing to environmental sustainability.
                  </div>
                </div>
              )}
              
              {user.role === 'collector' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <div className="text-sm text-muted-foreground">Total Pickups</div>
                      <div className="text-2xl font-bold">42</div>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <div className="text-sm text-muted-foreground">Total Earnings</div>
                      <div className="text-2xl font-bold text-success">$1,250</div>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <div className="text-sm text-muted-foreground">Rating</div>
                      <div className="text-2xl font-bold text-warning">4.8</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    As a collector, you play a vital role in the recycling ecosystem. 
                    Your performance is measured by the number of pickups, earnings, and customer ratings.
                  </div>
                </div>
              )}
              
              {user.role === 'ngo' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <div className="text-sm text-muted-foreground">Pickups Sponsored</div>
                      <div className="text-2xl font-bold">156</div>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <div className="text-sm text-muted-foreground">Waste Recycled (kg)</div>
                      <div className="text-2xl font-bold">2,840</div>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <div className="text-sm text-muted-foreground">CO₂ Saved (kg)</div>
                      <div className="text-2xl font-bold">1,320</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    As an NGO, you contribute to environmental sustainability by sponsoring recycling drives 
                    and tracking the positive impact on your community and the planet.
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

export default Profile;