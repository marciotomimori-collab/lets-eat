import {
  NearbySearchRequest,
  TextSearchRequest,
  PlacesSearchResponse,
  GooglePlaceRaw,
  FieldMaskLevel,
} from './types';

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || 'YOUR_API_KEY';
const BASE_URL = 'https://places.googleapis.com/v1';

const FIELD_MASKS: Record<FieldMaskLevel, string> = {
  essentials:
    'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.priceLevel,places.types,places.primaryType,places.googleMapsUri',
  pro: 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.priceLevel,places.types,places.primaryType,places.photos,places.currentOpeningHours,places.nationalPhoneNumber,places.websiteUri,places.googleMapsUri',
  enterprise:
    'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.priceLevel,places.types,places.primaryType,places.photos,places.currentOpeningHours,places.nationalPhoneNumber,places.websiteUri,places.googleMapsUri,places.reviews,places.editorialSummary',
};

const DETAIL_FIELD_MASKS: Record<FieldMaskLevel, string> = {
  essentials:
    'id,displayName,formattedAddress,location,rating,userRatingCount,priceLevel,types,primaryType,googleMapsUri',
  pro: 'id,displayName,formattedAddress,location,rating,userRatingCount,priceLevel,types,primaryType,photos,currentOpeningHours,nationalPhoneNumber,websiteUri,googleMapsUri',
  enterprise:
    'id,displayName,formattedAddress,location,rating,userRatingCount,priceLevel,types,primaryType,photos,currentOpeningHours,nationalPhoneNumber,websiteUri,googleMapsUri,reviews,editorialSummary',
};

// Session-level in-memory cache
const searchCache = new Map<string, { data: PlacesSearchResponse; timestamp: number }>();
const detailCache = new Map<string, { data: GooglePlaceRaw; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes session cache

function getCacheKey(params: Record<string, any>): string {
  return JSON.stringify(params);
}

function isExpired(timestamp: number): boolean {
  return Date.now() - timestamp > CACHE_TTL;
}

// ─── Nearby Search ──────────────────────────────────────

export async function nearbySearch(
  request: NearbySearchRequest,
  fieldLevel: FieldMaskLevel = 'essentials'
): Promise<GooglePlaceRaw[]> {
  const cacheKey = getCacheKey({ ...request, fieldLevel, type: 'nearby' });
  const cached = searchCache.get(cacheKey);
  if (cached && !isExpired(cached.timestamp)) {
    return cached.data.places || [];
  }

  const body: Record<string, any> = {
    locationRestriction: {
      circle: {
        center: {
          latitude: request.latitude,
          longitude: request.longitude,
        },
        radius: request.radius,
      },
    },
    maxResultCount: request.maxResultCount || 10,
  };

  if (request.includedTypes?.length) {
    body.includedTypes = request.includedTypes;
  }
  if (request.rankPreference) {
    body.rankPreference = request.rankPreference;
  }

  const response = await fetch(`${BASE_URL}/places:searchNearby`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': FIELD_MASKS[fieldLevel],
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new PlacesApiError(response.status, error);
  }

  const data: PlacesSearchResponse = await response.json();
  searchCache.set(cacheKey, { data, timestamp: Date.now() });
  return data.places || [];
}

// ─── Text Search ────────────────────────────────────────

export async function textSearch(
  request: TextSearchRequest,
  fieldLevel: FieldMaskLevel = 'essentials'
): Promise<GooglePlaceRaw[]> {
  const cacheKey = getCacheKey({ ...request, fieldLevel, type: 'text' });
  const cached = searchCache.get(cacheKey);
  if (cached && !isExpired(cached.timestamp)) {
    return cached.data.places || [];
  }

  const body: Record<string, any> = {
    textQuery: request.textQuery,
    locationBias: {
      circle: {
        center: {
          latitude: request.latitude,
          longitude: request.longitude,
        },
        radius: request.radius,
      },
    },
    maxResultCount: request.maxResultCount || 10,
  };

  if (request.priceLevels?.length) {
    body.priceLevels = request.priceLevels;
  }
  if (request.minRating) {
    body.minRating = request.minRating;
  }
  if (request.openNow !== undefined) {
    body.openNow = request.openNow;
  }
  if (request.includedType) {
    body.includedType = request.includedType;
  }

  const response = await fetch(`${BASE_URL}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': FIELD_MASKS[fieldLevel],
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new PlacesApiError(response.status, error);
  }

  const data: PlacesSearchResponse = await response.json();
  searchCache.set(cacheKey, { data, timestamp: Date.now() });
  return data.places || [];
}

// ─── Place Details ──────────────────────────────────────

export async function getPlaceDetails(
  placeId: string,
  fieldLevel: FieldMaskLevel = 'pro'
): Promise<GooglePlaceRaw> {
  const cacheKey = `${placeId}:${fieldLevel}`;
  const cached = detailCache.get(cacheKey);
  if (cached && !isExpired(cached.timestamp)) {
    return cached.data;
  }

  const response = await fetch(`${BASE_URL}/places/${placeId}`, {
    method: 'GET',
    headers: {
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': DETAIL_FIELD_MASKS[fieldLevel],
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new PlacesApiError(response.status, error);
  }

  const data: GooglePlaceRaw = await response.json();
  detailCache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

// ─── Place Photo ────────────────────────────────────────

export function getPhotoUri(
  photoResourceName: string,
  maxWidth: number = 400
): string {
  return `${BASE_URL}/${photoResourceName}/media?maxWidthPx=${maxWidth}&key=${API_KEY}`;
}

// ─── Error Class ────────────────────────────────────────

export class PlacesApiError extends Error {
  status: number;
  details: any;

  constructor(status: number, details: any) {
    const message =
      status === 429
        ? 'API rate limit exceeded'
        : status === 403
        ? 'API key invalid or restricted'
        : `Places API error: ${status}`;
    super(message);
    this.name = 'PlacesApiError';
    this.status = status;
    this.details = details;
  }
}

// ─── Clear Cache ────────────────────────────────────────

export function clearPlacesCache(): void {
  searchCache.clear();
  detailCache.clear();
}
