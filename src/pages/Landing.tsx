import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Leaf, 
  Recycle, 
  Users, 
  Award, 
  Truck,
  Heart,
  User,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import heroImage from '@/assets/hero-recycling.jpg';

const Landing = () => {
  const features = [
    {
      icon: Recycle,
      title: 'Smart Waste Collection',
      description: 'Book pickups for different waste types with our intelligent scheduling system.',
    },
    {
      icon: Award,
      title: 'Earn GreenCoins',
      description: 'Get rewarded for every kilogram of waste you help recycle. Redeem for real benefits.',
    },
    {
      icon: Users,
      title: 'Community Impact',
      description: 'Join thousands of eco-warriors making a difference in their neighborhoods.',
    },
  ];

  const roles = [
    {
      icon: User,
      title: 'Citizens',
      description: 'Book pickups, earn rewards, and track your environmental impact.',
      benefits: ['Easy pickup booking', 'GreenCoins rewards', 'Eco score tracking', 'Impact badges'],
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Truck,
      title: 'Collectors',
      description: 'Make money while helping the environment by collecting waste.',
      benefits: ['Flexible earning', 'Route optimization', 'Performance tracking', 'Community rating'],
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Heart,
      title: 'NGOs & Businesses',
      description: 'Sponsor collection drives and measure your environmental impact.',
      benefits: ['Impact measurement', 'Community engagement', 'CSR reporting', 'Brand visibility'],
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Active Users' },
    { value: '50,000kg', label: 'Waste Recycled' },
    { value: '25+', label: 'Cities Covered' },
    { value: '4.8★', label: 'User Rating' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-accent/20 to-secondary/20 py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/60" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-primary/10 rounded-full animate-float">
                <Leaf className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Transform Waste into{' '}
              <span className="bg-gradient-eco bg-clip-text text-transparent">
                Rewards
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the tech-powered recycling revolution. Connect with collectors, 
              earn rewards, and make a real impact on our planet's future.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" variant="eco" asChild className="text-lg px-8 py-3">
                <Link to="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="eco-outline" size="lg" asChild className="text-lg px-8 py-3">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Trash2Trade?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform makes recycling rewarding, efficient, and impactful for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-eco transition-shadow">
                  <CardContent className="p-8">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built for Everyone
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you're an individual, collector, or organization, we have tools designed for your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <Card key={index} className="hover:shadow-eco transition-shadow">
                  <CardContent className="p-8">
                    <div className={`${role.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6`}>
                      <Icon className={`h-8 w-8 ${role.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
                      {role.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 text-center">
                      {role.description}
                    </p>
                    <ul className="space-y-2">
                      {role.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-success mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-eco">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Make an Impact?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of eco-warriors who are already making a difference. 
              Start your recycling journey today.
            </p>
            <Button 
              size="lg" 
              variant="eco" 
              asChild 
              className="text-lg px-8 py-3"
            >
              <Link to="/signup">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;