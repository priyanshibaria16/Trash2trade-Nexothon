import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/ui/logo';
import { 
  User, 
  Bell, 
  LogOut,
  Home,
  Calendar,
  Gift,
  Trophy,
  Truck,
  MapPin,
  DollarSign,
  Heart,
  BarChart3,
  FileText,
  Target
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { apiGet } from '@/utils/api.utils';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Role-based navigation items
  const getNavItems = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'citizen':
        return [
          { path: '/citizen', label: 'Dashboard', icon: Home },
          { path: '/citizen/book-pickup', label: 'Book Pickup', icon: Calendar },
          { path: '/citizen/rewards', label: 'Rewards', icon: Gift },
          { path: '/citizen/eco-score', label: 'Eco Score', icon: Trophy },
        ];
      case 'collector':
        return [
          { path: '/collector', label: 'Dashboard', icon: Home },
          { path: '/collector/requests', label: 'Pickup Requests', icon: Truck },
          { path: '/collector/active', label: 'Active Route', icon: MapPin },
          { path: '/collector/earnings', label: 'Earnings', icon: DollarSign },
        ];
      case 'ngo':
        return [
          { path: '/ngo', label: 'Dashboard', icon: Home },
          { path: '/ngo/sponsor', label: 'Sponsor Drive', icon: Heart },
          { path: '/ngo/impact', label: 'Impact Tracker', icon: BarChart3 },
          { path: '/ngo/campaigns', label: 'Campaigns', icon: Target },
          { path: '/ngo/reports', label: 'Reports', icon: FileText },
        ];
      default:
        return [];
    }
  };

  // Fetch notifications (this is a simplified example)
  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          // In a real app, this would fetch actual notifications from the API
          // For now, we'll simulate some notifications
          const simulatedNotifications = [
            { id: 1, message: 'Your pickup has been accepted', read: false, timestamp: new Date() },
            { id: 2, message: 'New reward available', read: false, timestamp: new Date(Date.now() - 86400000) },
            { id: 3, message: 'Eco score updated', read: true, timestamp: new Date(Date.now() - 172800000) },
          ];
          setNotifications(simulatedNotifications);
          setUnreadCount(simulatedNotifications.filter(n => !n.read).length);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchNotifications();
  }, [user]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(unreadCount - 1);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  if (!user) {
    return (
      <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const navItems = getNavItems();

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>
          
          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Green Coins Display */}
            <div className="hidden sm:flex items-center space-x-1 bg-success/10 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-success">
                {user.greenCoins || 0} GC
              </span>
            </div>
            
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end" forceMount>
                <div className="flex items-center justify-between p-2">
                  <h3 className="font-medium">Notifications</h3>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                      Mark all as read
                    </Button>
                  )}
                </div>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <DropdownMenuItem 
                        key={notification.id} 
                        className={`flex flex-col items-start p-3 ${!notification.read ? 'bg-accent' : ''}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.timestamp).toLocaleDateString()}
                        </p>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs text-primary capitalize">{user.role}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;