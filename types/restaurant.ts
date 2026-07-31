export interface GooglePlace {
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
  photos?: GooglePlacePhoto[];
  currentOpeningHours?: {
    openNow: boolean;
    weekdayDescriptions: string[];
  };
  nationalPhoneNumber?: string;
  websiteUri?: string;
  googleMapsUri?: string;
  editorialSummary?: {
    text: string;
  };
  reviews?: GooglePlaceReview[];
}

export interface GooglePlacePhoto {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions: {
    displayName: string;
    uri: string;
  }[];
}

export interface GooglePlaceReview {
  name: string;
  rating: number;
  text: {
    text: string;
    languageCode: string;
  };
  authorAttribution: {
    displayName: string;
    photoUri: string;
  };
  relativePublishTimeDescription: string;
}

export interface RestaurantAppData {
  placeId: string;
  inAppRating: number;
  inAppReviewCount: number;
  lastVisitedAt: Date;
  cuisineCategories: string[];
}

export interface RestaurantCardData {
  placeId: string;
  name: string;
  rating: number;
  userRatingCount: number;
  priceLevel: string;
  address: string;
  distance?: number; // km
  types: string[];
  photoUri?: string;
  openNow?: boolean;
  inAppRating?: number;
  inAppReviewCount?: number;
}
