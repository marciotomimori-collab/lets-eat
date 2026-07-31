import { create } from 'zustand';
import { UserProfile, UserProfileInput } from '../types/user';

interface UserState {
  profile: UserProfile | null;
  isProfileLoaded: boolean;
  hasCompletedOnboarding: boolean;
  setProfile: (profile: UserProfile | null) => void;
  updateProfile: (data: UserProfileInput) => void;
  setOnboardingComplete: (complete: boolean) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isProfileLoaded: false,
  hasCompletedOnboarding: false,
  setProfile: (profile) =>
    set({
      profile,
      isProfileLoaded: true,
      hasCompletedOnboarding: !!(profile?.displayName && profile?.foodPreferences?.length > 0),
    }),
  updateProfile: (data) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...data, updatedAt: new Date() } : null,
    })),
  setOnboardingComplete: (hasCompletedOnboarding) => set({ hasCompletedOnboarding }),
  reset: () =>
    set({
      profile: null,
      isProfileLoaded: false,
      hasCompletedOnboarding: false,
    }),
}));
