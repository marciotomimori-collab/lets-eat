import { create } from 'zustand';
import { RestaurantCardData } from '../types/restaurant';

interface SearchState {
  // Search form state
  selectedCuisines: string[];
  selectedEventType: string | null;
  selectedPriceLevels: string[];
  searchRadius: number; // km
  
  // Results
  searchResults: RestaurantCardData[];
  isSearching: boolean;
  searchError: string | null;
  
  // Surprise mode
  surprisePool: RestaurantCardData[];
  surpriseIndex: number;
  surpriseRadius: number; // km
  surprisePriceLevels: string[];
  
  // Actions
  setSelectedCuisines: (cuisines: string[]) => void;
  toggleCuisine: (cuisine: string) => void;
  setSelectedEventType: (eventType: string | null) => void;
  setSelectedPriceLevels: (levels: string[]) => void;
  togglePriceLevel: (level: string) => void;
  setSearchRadius: (radius: number) => void;
  setSearchResults: (results: RestaurantCardData[]) => void;
  setIsSearching: (searching: boolean) => void;
  setSearchError: (error: string | null) => void;
  setSurprisePool: (pool: RestaurantCardData[]) => void;
  nextSurprise: () => RestaurantCardData | null;
  setSurpriseRadius: (radius: number) => void;
  setSurprisePriceLevels: (levels: string[]) => void;
  resetSearch: () => void;
  resetSurprise: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  selectedCuisines: [],
  selectedEventType: null,
  selectedPriceLevels: [],
  searchRadius: 5,
  searchResults: [],
  isSearching: false,
  searchError: null,
  surprisePool: [],
  surpriseIndex: 0,
  surpriseRadius: 3,
  surprisePriceLevels: [],
  
  setSelectedCuisines: (cuisines) => set({ selectedCuisines: cuisines }),
  toggleCuisine: (cuisine) =>
    set((state) => ({
      selectedCuisines: state.selectedCuisines.includes(cuisine)
        ? state.selectedCuisines.filter((c) => c !== cuisine)
        : [...state.selectedCuisines, cuisine],
    })),
  setSelectedEventType: (eventType) => set({ selectedEventType: eventType }),
  setSelectedPriceLevels: (levels) => set({ selectedPriceLevels: levels }),
  togglePriceLevel: (level) =>
    set((state) => ({
      selectedPriceLevels: state.selectedPriceLevels.includes(level)
        ? state.selectedPriceLevels.filter((l) => l !== level)
        : [...state.selectedPriceLevels, level],
    })),
  setSearchRadius: (radius) => set({ searchRadius: radius }),
  setSearchResults: (results) => set({ searchResults: results, searchError: null }),
  setIsSearching: (isSearching) => set({ isSearching }),
  setSearchError: (error) => set({ searchError: error, isSearching: false }),
  setSurprisePool: (pool) => set({ surprisePool: pool, surpriseIndex: 0 }),
  nextSurprise: () => {
    const state = get();
    if (state.surpriseIndex >= state.surprisePool.length) return null;
    const restaurant = state.surprisePool[state.surpriseIndex];
    set({ surpriseIndex: state.surpriseIndex + 1 });
    return restaurant;
  },
  setSurpriseRadius: (radius) => set({ surpriseRadius: radius }),
  setSurprisePriceLevels: (levels) => set({ surprisePriceLevels: levels }),
  resetSearch: () =>
    set({
      selectedCuisines: [],
      selectedEventType: null,
      selectedPriceLevels: [],
      searchRadius: 5,
      searchResults: [],
      isSearching: false,
      searchError: null,
    }),
  resetSurprise: () =>
    set({
      surprisePool: [],
      surpriseIndex: 0,
    }),
}));
