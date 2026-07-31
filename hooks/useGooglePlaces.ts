import { useState, useCallback } from 'react';
import { nearbySearch, textSearch, getPlaceDetails, PlacesApiError } from '../services/google-places/api';
import { GooglePlaceRaw, TextSearchRequest, NearbySearchRequest } from '../services/google-places/types';
import { RestaurantCardData } from '../types/restaurant';
import { calculateDistance, formatPriceLevel } from '../utils/formatters';

function placeToCardData(
  place: GooglePlaceRaw,
  userLat?: number | null,
  userLng?: number | null
): RestaurantCardData {
  const distance =
    userLat && userLng
      ? calculateDistance(userLat, userLng, place.location.latitude, place.location.longitude)
      : undefined;

  return {
    placeId: place.id,
    name: place.displayName?.text || 'Unknown',
    rating: place.rating || 0,
    userRatingCount: place.userRatingCount || 0,
    priceLevel: place.priceLevel || 'PRICE_LEVEL_MODERATE',
    address: place.formattedAddress || '',
    distance,
    types: place.types || [],
    openNow: place.currentOpeningHours?.openNow,
  };
}

export function useGooglePlaces() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByText = useCallback(
    async (
      params: TextSearchRequest,
      userLat?: number | null,
      userLng?: number | null
    ): Promise<RestaurantCardData[]> => {
      setIsLoading(true);
      setError(null);
      try {
        const places = await textSearch(params);
        return places.map((p) => placeToCardData(p, userLat, userLng));
      } catch (e) {
        const msg = e instanceof PlacesApiError
          ? e.status === 429
            ? 'errors.apiLimit'
            : 'errors.generic'
          : 'errors.generic';
        setError(msg);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const searchNearby = useCallback(
    async (
      params: NearbySearchRequest,
      userLat?: number | null,
      userLng?: number | null
    ): Promise<RestaurantCardData[]> => {
      setIsLoading(true);
      setError(null);
      try {
        const places = await nearbySearch(params);
        return places.map((p) => placeToCardData(p, userLat, userLng));
      } catch (e) {
        const msg = e instanceof PlacesApiError
          ? e.status === 429
            ? 'errors.apiLimit'
            : 'errors.generic'
          : 'errors.generic';
        setError(msg);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getDetails = useCallback(
    async (placeId: string): Promise<GooglePlaceRaw | null> => {
      setIsLoading(true);
      setError(null);
      try {
        return await getPlaceDetails(placeId, 'pro');
      } catch (e) {
        setError('errors.generic');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { searchByText, searchNearby, getDetails, isLoading, error };
}
