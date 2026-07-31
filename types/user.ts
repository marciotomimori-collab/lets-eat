export interface UserProfile {
  uid: string;
  displayName: string | null;
  age: number | null;
  email: string | null;
  authProvider: 'anonymous' | 'google' | 'email';
  foodPreferences: string[];
  defaultRadius: number; // in meters
  defaultPriceLevel: string;
  language: 'pt-BR' | 'en';
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
  consentGiven: boolean;
  consentDate: Date | null;
}

export interface UserProfileInput {
  displayName?: string;
  age?: number;
  foodPreferences?: string[];
  defaultRadius?: number;
  defaultPriceLevel?: string;
  language?: 'pt-BR' | 'en';
  photoURL?: string;
}
