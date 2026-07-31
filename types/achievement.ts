export interface UserAchievement {
  key: string;
  unlockedAt: Date | null;
  progress: number;
}

export interface AchievementDisplayData {
  key: string;
  title: string;
  description: string;
  emoji: string;
  target: number;
  progress: number;
  isUnlocked: boolean;
  unlockedAt: Date | null;
  category: 'usage' | 'cuisine' | 'social' | 'review' | 'special';
}
