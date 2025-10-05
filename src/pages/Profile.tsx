import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Save, 
  Loader,
  Coins,
  Trophy
} from 'lucide-react';
import { apiGet, apiPut } from '@/utils/api.utils';

interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  green_coins: number;
  eco_score: number;
  created_at: string;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiGet('/api/auth/profile');
        setProfile({
          name: response.user.name,
          email: response.user.email,
          phone: response.user.phone || '',
          address: response.user.address || '',
          bio: response.user.bio || '',
          green_coins: response.user.green_coins || 0,
          eco_score: response.user.eco_score || 0,
          created_at: response.user.created_at
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (profile) {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setSaving(true);
    try {
      // In a real app, this would make an API call to update the profile
      // await apiPut('/api/auth/profile', profile);
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="bg-primary/10 rounded-full p-4">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h2 className="text-xl font-bold mt-4">{profile.name}</h2>
                <p className="text-muted-foreground">{user?.role}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-muted-foreground mr-3" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                
                {profile.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-muted-foreground mr-3" />
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                )}
                
                {profile.address && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-muted-foreground mr-3" />
                    <span className="text-sm">{profile.address}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-muted-foreground mr-3" />
                  <span className="text-sm">
                    Member since {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-primary/5 p-4 rounded-lg text-center">
                  <Coins className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{profile.green_coins}</p>
                  <p className="text-xs text-muted-foreground">GreenCoins</p>
                </div>
                <div className="bg-warning/5 p-4 rounded-lg text-center">
                  <Trophy className="h-6 w-6 text-warning mx-auto mb-2" />
                  <p className="text-2xl font-bold">{profile.eco_score}</p>
                  <p className="text-xs text-muted-foreground">Eco Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                      required
                      disabled
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={profile.phone || ''}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={profile.address || ''}
                      onChange={handleChange}
                      placeholder="Enter your address"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profile.bio || ''}
                    onChange={handleChange}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" onClick={logout}>
                    Logout
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;