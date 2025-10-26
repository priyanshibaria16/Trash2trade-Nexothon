import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Twitter, Linkedin, Github, Sun, Moon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import Logo from '@/components/ui/logo';

const Footer = () => {
  const footerBase = "bg-gradient-to-b from-muted/40 to-background border-t border-border";
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark') ? 'dark' : 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = /.+@.+\..+/.test(email);
    if (!isValid) {
      toast({ title: 'Invalid email', description: 'Please enter a valid email address.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Subscribed', description: 'Thanks for subscribing! We\'ll keep you updated.' });
    setEmail("");
  };
  return (
    <footer className={`${footerBase} mt-20`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <Logo />
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              Join the tech-powered recycling revolution. Connect citizens, collectors, 
              and NGOs for a sustainable future. Every pickup makes a difference.
            </p>
            {/* Newsletter */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground/80 mb-2">Newsletter</h4>
              <form onSubmit={handleSubscribe} className="flex w-full max-w-md items-center gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="flex-1"
                />
                <Button type="submit" variant="eco">Subscribe</Button>
              </form>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span>Active in 25+ cities</span>
              </div>
            </div>
            {/* Social icons */}
            <TooltipProvider>
              <div className="mt-4 flex items-center gap-3 text-muted-foreground">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="#" aria-label="Twitter" className="p-2 rounded-md hover:bg-accent hover:text-foreground transition-colors">
                      <Twitter className="h-4 w-4" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>Twitter</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="#" aria-label="LinkedIn" className="p-2 rounded-md hover:bg-accent hover:text-foreground transition-colors">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>LinkedIn</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="https://github.com/priyanshibaria16/Trash2trade-Nexothon" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2 rounded-md hover:bg-accent hover:text-foreground transition-colors">
                      <Github className="h-4 w-4" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>GitHub</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground/80 mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  For Citizens
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  For Collectors
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  For NGOs
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground/80 mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:hello@trash2trade.com" className="hover:text-primary transition-colors">hello@trash2trade.com</a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+15551234567" className="hover:text-primary transition-colors">+1 (555) 123-4567</a>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <a href="#" className="hover:text-primary transition-colors">EcoCity, Green State</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Trash2Trade. Making recycling rewarding for everyone.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border">
            <nav className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Link to="/" className="px-3 py-1 rounded-md hover:bg-accent hover:text-foreground transition-colors">Home</Link>
                <Link to="/citizen" className="px-3 py-1 rounded-md hover:bg-accent hover:text-foreground transition-colors">Citizen Dashboard</Link>
                <Link to="/collector" className="px-3 py-1 rounded-md hover:bg-accent hover:text-foreground transition-colors">Collector Dashboard</Link>
                <Link to="/ngo" className="px-3 py-1 rounded-md hover:bg-accent hover:text-foreground transition-colors">NGO Dashboard</Link>
                <Link to="/ngo/campaigns" className="px-3 py-1 rounded-md hover:bg-accent hover:text-foreground transition-colors">Campaigns</Link>
                <Link to="/profile" className="px-3 py-1 rounded-md hover:bg-accent hover:text-foreground transition-colors">Profile</Link>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Toggle theme"
                  className="border border-border"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <div className="text-sm text-muted-foreground">
                  Made by <span className="font-semibold text-foreground">NexaNinjas</span>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;