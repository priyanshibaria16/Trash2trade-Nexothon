import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CitizenDashboard from "./pages/CitizenDashboard";
import CitizenBookPickup from "./pages/CitizenBookPickup";
import CitizenRewards from "./pages/CitizenRewards";
import CitizenEcoScore from "./pages/CitizenEcoScore";
import CitizenPickups from "./pages/CitizenPickups";
import CollectorDashboard from "./pages/CollectorDashboard";
import CollectorRequests from "./pages/CollectorRequests";
import CollectorPickupDetails from "./pages/CollectorPickupDetails";
import CollectorActivePickups from "./pages/CollectorActivePickups";
import CollectorEarnings from "./pages/CollectorEarnings";
import NGODashboard from "./pages/NGODashboard";
import NGOSponsorDrive from "./pages/NGOSponsorDrive";
import NGOImpactTracker from "./pages/NGOImpactTracker";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Citizen Routes */}
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/citizen/book-pickup" element={<CitizenBookPickup />} />
          <Route path="/citizen/rewards" element={<CitizenRewards />} />
          <Route path="/citizen/eco-score" element={<CitizenEcoScore />} />
          <Route path="/citizen/pickups" element={<CitizenPickups />} />
          
          {/* Collector Routes */}
          <Route path="/collector" element={<CollectorDashboard />} />
          <Route path="/collector/requests" element={<CollectorRequests />} />
          <Route path="/collector/pickup/:id" element={<CollectorPickupDetails />} />
          <Route path="/collector/active" element={<CollectorActivePickups />} />
          <Route path="/collector/earnings" element={<CollectorEarnings />} />
          
          {/* NGO Routes */}
          <Route path="/ngo" element={<NGODashboard />} />
          <Route path="/ngo/sponsor" element={<NGOSponsorDrive />} />
          <Route path="/ngo/impact" element={<NGOImpactTracker />} />
          
          {/* Profile */}
          <Route path="/profile" element={<Profile />} />
          
          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!user && <Footer />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;