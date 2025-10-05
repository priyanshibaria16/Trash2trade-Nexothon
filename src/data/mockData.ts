export interface PickupRequest {
  id: string;
  userId: string;
  wasteType: 'plastic' | 'e-waste' | 'paper' | 'metal';
  quantity: number;
  address: string;
  preferredTime: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed';
  collectorId?: string;
  collectorName?: string;
  scheduledDate?: string;
  completedDate?: string;
  greenCoinsEarned?: number;
  coordinates?: [number, number];
}

export interface CollectorStats {
  totalPickups: number;
  totalEarnings: number;
  greenCoinsEarned: number;
  rating: number;
  completionRate: number;
}

export interface NGOImpact {
  pickupsSponsored: number;
  wasteRecycled: number; // in kg
  co2Saved: number; // in kg
  totalInvestment: number;
}

export const mockPickups: PickupRequest[] = [
  {
    id: '1',
    userId: '1',
    wasteType: 'plastic',
    quantity: 5,
    address: '123 Green Street, EcoCity',
    preferredTime: '2024-01-15T10:00:00Z',
    status: 'pending',
    coordinates: [40.7128, -74.0060],
  },
  {
    id: '2',
    userId: '1',
    wasteType: 'e-waste',
    quantity: 2,
    address: '456 Earth Avenue, EcoCity',
    preferredTime: '2024-01-16T14:00:00Z',
    status: 'accepted',
    collectorId: '2',
    collectorName: 'Maria Garcia',
    scheduledDate: '2024-01-16T14:00:00Z',
    coordinates: [40.7589, -73.9851],
  },
  {
    id: '3',
    userId: '2',
    wasteType: 'paper',
    quantity: 10,
    address: '789 Recycle Road, EcoCity',
    preferredTime: '2024-01-14T09:00:00Z',
    status: 'completed',
    collectorId: '2',
    collectorName: 'Maria Garcia',
    completedDate: '2024-01-14T09:30:00Z',
    greenCoinsEarned: 25,
    coordinates: [40.7831, -73.9712],
  },
];

export const mockCollectorStats: CollectorStats = {
  totalPickups: 45,
  totalEarnings: 1250,
  greenCoinsEarned: 350,
  rating: 4.8,
  completionRate: 96,
};

export const mockNGOImpact: NGOImpact = {
  pickupsSponsored: 150,
  wasteRecycled: 2500,
  co2Saved: 1200,
  totalInvestment: 5000,
};

export const mockEcoScoreData = [
  { month: 'Jan', score: 45 },
  { month: 'Feb', score: 52 },
  { month: 'Mar', score: 58 },
  { month: 'Apr', score: 65 },
  { month: 'May', score: 72 },
  { month: 'Jun', score: 78 },
];

export const mockImpactData = [
  { month: 'Jan', pickups: 12, recycled: 180, co2: 85 },
  { month: 'Feb', recycled: 220, co2: 105 },
  { month: 'Mar', pickups: 28, recycled: 310, co2: 145 },
  { month: 'Apr', pickups: 35, recycled: 420, co2: 200 },
  { month: 'May', pickups: 42, recycled: 580, co2: 275 },
  { month: 'Jun', pickups: 50, recycled: 650, co2: 310 },
];

export const wasteTypes = [
  { value: 'plastic', label: 'Plastic', color: '#ef4444', icon: '♻️' },
  { value: 'e-waste', label: 'E-Waste', color: '#8b5cf6', icon: '💻' },
  { value: 'paper', label: 'Paper', color: '#f59e0b', icon: '📄' },
  { value: 'metal', label: 'Metal', color: '#6b7280', icon: '🔩' },
];

export const badges = [
  { id: 'eco-warrior', name: 'Eco Warrior', icon: '🌍', requirement: 50, earned: true },
  { id: 'recycling-hero', name: 'Recycling Hero', icon: '♻️', requirement: 100, earned: true },
  { id: 'green-champion', name: 'Green Champion', icon: '🏆', requirement: 200, earned: false },
  { id: 'planet-protector', name: 'Planet Protector', icon: '🛡️', requirement: 300, earned: false },
];