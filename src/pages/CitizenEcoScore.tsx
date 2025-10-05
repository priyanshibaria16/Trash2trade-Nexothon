import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  TrendingUp, 
  Recycle, 
  Calendar, 
  Target, 
  Award,
  Leaf,
  Star
} from 'lucide-react';
import { mockEcoScoreData, mockImpactData, badges } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const CitizenEcoScore = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'citizen') {
    return <div>Access denied</div>;
  }

  // Calculate next level progress
  const currentScore = user.ecoScore || 0;
  const nextLevelThreshold = Math.ceil(currentScore / 50) * 50;
  const progressToNextLevel = (currentScore / nextLevelThreshold) * 100;

  // Determine user level based on eco score
  const getUserLevel = (score: number) => {
    if (score >= 200) return { name: 'Eco Master', color: 'text-purple-600', icon: '👑' };
    if (score >= 150) return { name: 'Eco Champion', color: 'text-blue-600', icon: '🏆' };
    if (score >= 100) return { name: 'Eco Hero', color: 'text-green-600', icon: '🦸' };
    if (score >= 50) return { name: 'Eco Warrior', color: 'text-yellow-600', icon: '⚔️' };
    return { name: 'Eco Beginner', color: 'text-gray-600', icon: '🌱' };
  };

  const userLevel = getUserLevel(currentScore);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Eco Score Dashboard</h1>
        <p className="text-muted-foreground">
          Track your environmental impact and progress
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Current Score */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-warning" />
              Your Eco Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="text-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-warning/10 flex items-center justify-center">
                    <span className="text-4xl font-bold text-warning">{currentScore}</span>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-warning text-warning-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {userLevel.name}
                  </div>
                </div>
              </div>
              
              <div className="flex-1 w-full">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress to {nextLevelThreshold} pts</span>
                    <span className="font-medium">{currentScore}/{nextLevelThreshold}</span>
                  </div>
                  <Progress value={progressToNextLevel} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center">
                      <Recycle className="h-5 w-5 text-primary mr-2" />
                      <span className="text-sm font-medium">Pickups</span>
                    </div>
                    <p className="text-xl font-bold mt-1">24</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center">
                      <Leaf className="h-5 w-5 text-success mr-2" />
                      <span className="text-sm font-medium">CO₂ Saved</span>
                    </div>
                    <p className="text-xl font-bold mt-1">125 kg</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {badges.map((badge) => (
                <div 
                  key={badge.id} 
                  className={`flex items-center p-3 rounded-lg ${badge.earned ? 'bg-primary/5 border border-primary/20' : 'bg-muted opacity-50'}`}
                >
                  <span className="text-2xl mr-3">{badge.icon}</span>
                  <div>
                    <p className={`font-medium ${badge.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {badge.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {badge.earned ? 'Earned' : `Earn ${badge.requirement} points`}
                    </p>
                  </div>
                  {badge.earned && (
                    <Star className="h-4 w-4 text-yellow-500 ml-auto" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score History Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-success" />
            Score History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockEcoScoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Impact */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-500" />
            Environmental Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockImpactData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="recycled" fill="#8b5cf6" name="Waste Recycled (kg)" />
                <Bar dataKey="co2" fill="#10b981" name="CO₂ Saved (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tips for Improvement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Tips to Improve Your Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Schedule Regular Pickups</h3>
                <p className="text-sm text-muted-foreground">
                  Consistent recycling habits boost your score
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg">
              <Recycle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Diversify Waste Types</h3>
                <p className="text-sm text-muted-foreground">
                  Recycling different materials increases impact
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg">
              <Trophy className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Refer Friends</h3>
                <p className="text-sm text-muted-foreground">
                  Community involvement boosts your eco score
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg">
              <Leaf className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Participate in Drives</h3>
                <p className="text-sm text-muted-foreground">
                  Join NGO-sponsored events for bonus points
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CitizenEcoScore;