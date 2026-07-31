import { Redirect } from 'expo-router';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { hasCompletedOnboarding } = useUserStore();
  
  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return <Redirect href="/(auth)/welcome" />;
  if (!hasCompletedOnboarding) return <Redirect href="/(auth)/onboarding" />;
  return <Redirect href="/(tabs)" />;
}
