// Trip Types
export type TripType = "date" | "holiday" | "friends";

export type ActivityType =
  | "restaurant"
  | "museum"
  | "activity"
  | "attraction"
  | "nightlife"
  | "scenic";

export type PriceRange = "$" | "$$" | "$$$" | "$$$$";

// Coordinates
export interface Coordinates {
  lat: number;
  lng: number;
}

// Activity
export interface Activity {
  id: string;
  time: string;
  name: string;
  type: ActivityType;
  description: string;
  coordinates: Coordinates;
  priceRange: PriceRange;
  isHiddenGem: boolean;
  hiddenGemReason?: string;
}

// Day Plan
export interface DayPlan {
  date: string;
  activities: Activity[];
}

// Location Info
export interface LocationInfo {
  name: string;
  coordinates: Coordinates;
}

// Budget Breakdown
export interface BudgetBreakdown {
  estimated: number;
  currency: string;
  withinBudget: boolean;
}

// Complete Trip Plan
export interface TripPlan {
  tripName: string;
  location: LocationInfo;
  days: DayPlan[];
  budgetBreakdown: BudgetBreakdown;
  tips: string[];
}

// Trip Form Input
export interface TripFormInput {
  location: string;
  tripType: TripType;
  startDate: string;
  endDate: string;
  budget: number;
  preferences?: string;
}

// API Response Types
export interface GenerateResponse {
  success: true;
  plan: TripPlan;
}

export interface GenerateErrorResponse {
  success: false;
  error: string;
}

export type GenerateResult = GenerateResponse | GenerateErrorResponse;

// Share Types
export interface SharedTrip {
  id: string;
  plan: TripPlan;
  formInput: TripFormInput;
  createdAt: string;
  expiresAt: string;
}

export interface ShareResponse {
  success: true;
  shareId: string;
  shareUrl: string;
}

export interface ShareErrorResponse {
  success: false;
  error: string;
}

export type ShareResult = ShareResponse | ShareErrorResponse;

// Grok API Types
export interface GrokMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GrokChatRequest {
  model: string;
  messages: GrokMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface GrokChatResponse {
  id: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Activity Type Icons mapping
export const ACTIVITY_ICONS: Record<ActivityType, string> = {
  restaurant: "🍽️",
  museum: "🏛️",
  activity: "🎯",
  attraction: "📸",
  nightlife: "🌙",
  scenic: "🌅",
};

// Trip Type Options
export const TRIP_TYPE_OPTIONS: { value: TripType; label: string; icon: string }[] = [
  { value: "date", label: "Date", icon: "💑" },
  { value: "holiday", label: "Holiday", icon: "🏖️" },
  { value: "friends", label: "Friends", icon: "👯" },
];
