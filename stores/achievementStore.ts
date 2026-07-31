import { create } from 'zustand';
import { AchievementDisplayData } from '../types/achievement';

interface AchievementState {
  achievements: AchievementDisplayData[];
  newlyUnlocked: string[];
  isLoaded: boolean;
  setAchievements: (achievements: AchievementDisplayData[]) => void;
  addNewlyUnlocked: (keys: string[]) => void;
  clearNewlyUnlocked: () => void;
  reset: () => void;
}

export const useAchievementStore = create<AchievementState>((set) => ({
  achievements: [],
  newlyUnlocked: [],
  isLoaded: false,
  setAchievements: (achievements) => set({ achievements, isLoaded: true }),
  addNewlyUnlocked: (keys) =>
    set((state) => ({
      newlyUnlocked: [...state.newlyUnlocked, ...keys],
    })),
  clearNewlyUnlocked: () => set({ newlyUnlocked: [] }),
  reset: () =>
    set({
      achievements: [],
      newlyUnlocked: [],
      isLoaded: false,
    }),
}));
