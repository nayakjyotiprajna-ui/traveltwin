export type TravelStyle =
  | 'Adventure'
  | 'Peaceful'
  | 'Cultural'
  | 'Nature'
  | 'Family'
  | 'Photography'
  | 'Luxury'
  | 'Budget';

export type AccessibilityPreference =
  | 'Low Motion'
  | 'Large Text'
  | 'Audio Guide'
  | 'Text Guide'
  | 'High Contrast'
  | 'Mobility Friendly'
  | 'Senior Friendly';

export type DestinationCategory =
  | 'Adventure'
  | 'Culture'
  | 'Nature'
  | 'Beach'
  | 'Mountain'
  | 'Heritage';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  travelPreferences: string[];
  accessibilityPreferences: AccessibilityPreference[];
  travelStyle: TravelStyle;
  budgetPreference: string;
  preferredEnvironment: string;
  xp: number;
  level: number;
  createdAt?: string;
}

export interface Hotspot {
  id: string;
  title: string;
  description: string;
  audioNarration?: string;
  position: [number, number, number];
  category: 'landmark' | 'culture' | 'viewpoint' | 'activity';
}

export interface Destination {
  id: string;
  name: string;
  region: string;
  country: string;
  description: string;
  culture: string;
  food: string[];
  attractions: string[];
  activities: string[];
  accessibility: {
    wheelchairAccessible: boolean;
    audioGuidesAvailable: boolean;
    lowPhysicalDemand: boolean;
    restAreasScore: number; // 1-10
    highlights: string[];
  };
  budget: {
    estimatedPerDay: number;
    currency: string;
    level: 'Budget' | 'Moderate' | 'Luxury';
  };
  bestTime: string;
  estimatedDuration: string;
  image: string;
  panorama?: string;
  threeDType: 'mountain' | 'coastal' | 'palace' | 'temple' | 'nature';
  categories: DestinationCategory[];
  hotspots: Hotspot[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface SimulationParams {
  destinationId: string;
  startDate: string;
  endDate: string;
  travellers: number;
  budget: 'Budget' | 'Moderate' | 'Luxury';
  accommodation: 'Boutique Hotel' | 'Eco Resort' | 'Heritage Homestay' | 'Standard Hotel';
  transportation: 'Scenic Train' | 'Private Cab' | 'Flight' | 'Accessible Tour Bus';
  selectedActivities: string[];
  accessibilityRequirements: AccessibilityPreference[];
}

export interface SimulationStage {
  name: string;
  percentage: number;
  status: 'pending' | 'in-progress' | 'completed';
  detail: string;
}

export interface SimulationResult {
  id: string;
  params: SimulationParams;
  estimatedDuration: string;
  estimatedBudget: number;
  currency: string;
  accommodationDetail: string;
  transportationDetail: string;
  crowdLevel: 'Low' | 'Moderate' | 'High' | 'Peak';
  crowdInsight: string;
  weatherConditions: {
    temp: string;
    condition: string;
    clothingAdvice: string;
  };
  accessibilityAnalysis: {
    score: number;
    rating: 'Excellent' | 'Good' | 'Fair';
    notes: string[];
  };
  activitiesPlanned: string[];
  potentialChallenges: string[];
  aiRecommendations: string[];
  createdAt: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  accessibilityTip: string;
  estimatedExpense: string;
}

export interface Itinerary {
  id: string;
  destination: string;
  title: string;
  summary: string;
  days: ItineraryDay[];
  totalEstimatedBudget: string;
  suggestedPacking: string[];
  createdAt: string;
}

export interface PassportStamp {
  id: string;
  destinationId: string;
  destinationName: string;
  country: string;
  unlockedAt: string;
  icon: string;
  color: string;
  experienceType: 'Virtual Visit' | 'Simulation' | 'Shared Journey';
  xpEarned: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface Memory {
  id: string;
  destinationId: string;
  destinationName: string;
  caption: string;
  image: string;
  date: string;
  tags: string[];
  userId: string;
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  status: 'exploring' | 'idle' | 'interacting';
}

export interface TravelRoom {
  roomCode: string;
  destinationId: string;
  destinationName: string;
  hostId: string;
  participants: Participant[];
  currentStage: string;
  status: 'active' | 'completed';
  createdAt: string;
}

export interface AIDirectorQuery {
  mood: string;
  preferredStyle?: TravelStyle;
  budgetPreference?: string;
  accessibilityNeeds?: AccessibilityPreference[];
  preferredEnvironment?: string;
}

export interface AIDirectorResult {
  destination: string;
  destinationId: string;
  mood: string;
  experience: string;
  activities: string[];
  duration: string;
  accessibility: string[];
  reason: string;
  confidenceScore: number;
}
