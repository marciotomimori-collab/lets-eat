import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';
import { UserProfile, UserProfileInput } from '../../types/user';
import { Review, ReviewInput } from '../../types/review';
import { UserAchievement } from '../../types/achievement';

// ─── User Profile ───────────────────────────────────────

export const createUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return convertTimestamps(docSnap.data()) as UserProfile;
};

export const updateUserProfile = async (
  uid: string,
  data: UserProfileInput
): Promise<void> => {
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteUserProfile = async (uid: string): Promise<void> => {
  await deleteDoc(doc(db, 'users', uid));
};

// ─── Reviews ────────────────────────────────────────────

export const createReview = async (
  uid: string,
  displayName: string,
  input: ReviewInput
): Promise<string> => {
  const reviewRef = await addDoc(collection(db, 'reviews'), {
    userId: uid,
    userDisplayName: displayName || 'Anônimo',
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return reviewRef.id;
};

export const getReviewsForPlace = async (
  placeId: string,
  maxResults: number = 20
): Promise<Review[]> => {
  const q = query(
    collection(db, 'reviews'),
    where('placeId', '==', placeId),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...convertTimestamps(d.data()),
  })) as Review[];
};

export const getReviewsByUser = async (
  uid: string,
  maxResults: number = 50
): Promise<Review[]> => {
  const q = query(
    collection(db, 'reviews'),
    where('userId', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...convertTimestamps(d.data()),
  })) as Review[];
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  await deleteDoc(doc(db, 'reviews', reviewId));
};

// ─── Achievements ───────────────────────────────────────

export const getUserAchievements = async (
  uid: string
): Promise<UserAchievement[]> => {
  const q = query(collection(db, 'users', uid, 'achievements'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    key: d.id,
    ...convertTimestamps(d.data()),
  })) as UserAchievement[];
};

export const updateAchievement = async (
  uid: string,
  achievementKey: string,
  data: Partial<UserAchievement>
): Promise<void> => {
  await setDoc(
    doc(db, 'users', uid, 'achievements', achievementKey),
    {
      ...data,
      ...(data.unlockedAt ? { unlockedAt: serverTimestamp() } : {}),
    },
    { merge: true }
  );
};

// ─── History ────────────────────────────────────────────

export interface HistoryEntry {
  placeId: string;
  placeName: string;
  mode: 'search' | 'surprise';
  eventType: string;
  cuisineType: string;
  timestamp: Date;
  userRating: number | null;
}

export const addHistoryEntry = async (
  uid: string,
  entry: Omit<HistoryEntry, 'timestamp'>
): Promise<string> => {
  const ref = await addDoc(collection(db, 'users', uid, 'history'), {
    ...entry,
    timestamp: serverTimestamp(),
  });
  return ref.id;
};

export const getUserHistory = async (
  uid: string,
  maxResults: number = 20
): Promise<HistoryEntry[]> => {
  const q = query(
    collection(db, 'users', uid, 'history'),
    orderBy('timestamp', 'desc'),
    limit(maxResults)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => convertTimestamps(d.data())) as HistoryEntry[];
};

// ─── Restaurant App Data ────────────────────────────────

export const getRestaurantAppData = async (placeId: string) => {
  const docRef = doc(db, 'restaurants', placeId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return convertTimestamps(docSnap.data());
};

export const upsertRestaurantAppData = async (
  placeId: string,
  data: Record<string, any>
): Promise<void> => {
  await setDoc(doc(db, 'restaurants', placeId), data, { merge: true });
};

// ─── Helpers ────────────────────────────────────────────

function convertTimestamps(data: DocumentData): DocumentData {
  const result: DocumentData = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Timestamp) {
      result[key] = value.toDate();
    } else {
      result[key] = value;
    }
  }
  return result;
}
