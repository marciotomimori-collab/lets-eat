import { useEffect, useCallback } from 'react';
import { useAchievementStore } from '../stores/achievementStore';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { getUserAchievements } from '../services/firebase/firestore';
import { checkAndUpdateAchievements, getAchievementDisplayData, AchievementEvent } from '../services/achievements/tracker';

export function useAchievements() {
  const { user } = useAuthStore();
  const { profile } = useUserStore();
  const { setAchievements, addNewlyUnlocked, achievements, isLoaded } = useAchievementStore();

  const loadAchievements = useCallback(async () => {
    if (!user) return;
    try {
      const userAchievements = await getUserAchievements(user.uid);
      const language = profile?.language || 'pt-BR';
      const displayData = getAchievementDisplayData(userAchievements, language);
      setAchievements(displayData);
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  }, [user, profile?.language]);

  const trackEvent = useCallback(
    async (event: AchievementEvent) => {
      if (!user) return;
      try {
        const unlocked = await checkAndUpdateAchievements(user.uid, event);
        if (unlocked.length > 0) {
          addNewlyUnlocked(unlocked);
          await loadAchievements(); // Reload to reflect changes
        }
      } catch (error) {
        console.error('Error tracking achievement:', error);
      }
    },
    [user]
  );

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  return { achievements, isLoaded, trackEvent, reload: loadAchievements };
}
