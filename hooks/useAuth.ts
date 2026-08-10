import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { onAuthChange } from '../services/firebase/auth';
import { getUserProfile } from '../services/firebase/firestore';

export function useAuth() {
  const { setUser, setLoading } = useAuthStore();
  const { setProfile } = useUserStore();

  useEffect(() => {
    setLoading(true);
    let isResolved = false;

    const fallbackTimeout = setTimeout(() => {
      if (!isResolved) {
        console.warn('Auth listener timeout: fallback triggered');
        setLoading(false);
      }
    }, 2000);

    const unsubscribe = onAuthChange(async (user) => {
      isResolved = true;
      setUser(user);
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false); // Ensure loading is false after auth resolves
    });
    return () => {
      clearTimeout(fallbackTimeout);
      unsubscribe();
    };
  }, []);

  return useAuthStore();
}
