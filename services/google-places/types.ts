export interface NearbySearchRequest {
  latitude: number;
  longitude: number;
  radius: number; // meters
  includedTypes?: string[];
  maxResultCount?: number;
  rankPreference?: 'DISTANCE' | 'POPULARITY';
}

export interface TextSearchRequest {
  textQuery: string;
  latitude: number;
  longitude: number;
  radius: number;
  priceLevels?: string[];
  minRating?: number;
  openNow?: boolean;
  maxResultCount?: number;
  includedType?: string;
}

export interface PlacesSearchResponse {
  places: GooglePlaceRaw[];
}

export interface GooglePlaceRaw {
  id: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  types?: string[];
  primaryType?: string;
  photos?: {
    name: string;
    widthPx: number;
    heightPx: number;
  }[];
  currentOpeningHours?: {
    openNow: boolean;
  };
  nationalPhoneNumber?: string;
  websiteUri?: string;
  googleMapsUri?: string;
}

export type FieldMaskLevel = 'essentials' | 'pro' | 'enterprise';
