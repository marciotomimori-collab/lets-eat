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
    const unsubscribe = onAuthChange(async (user) => {
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
    });
    return unsubscribe;
  }, []);

  return useAuthStore();
}
