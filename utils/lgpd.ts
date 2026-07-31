import { getUserProfile, getReviewsByUser, getUserAchievements, getUserHistory, deleteUserProfile } from '../services/firebase/firestore';
import { deleteAccount as deleteAuthAccount } from '../services/firebase/auth';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase/config';

export interface ExportedUserData {
  profile: any;
  reviews: any[];
  achievements: any[];
  history: any[];
  exportedAt: string;
}

export async function exportUserData(uid: string): Promise<ExportedUserData> {
  const [profile, reviews, achievements, history] = await Promise.all([
    getUserProfile(uid),
    getReviewsByUser(uid),
    getUserAchievements(uid),
    getUserHistory(uid),
  ]);

  return {
    profile,
    reviews,
    achievements,
    history,
    exportedAt: new Date().toISOString(),
  };
}

export async function deleteAllUserData(uid: string): Promise<void> {
  // 1. Delete all user reviews
  const reviewsQuery = query(
    collection(db, 'reviews'),
    where('userId', '==', uid)
  );
  const reviewsSnap = await getDocs(reviewsQuery);
  const deleteReviewPromises = reviewsSnap.docs.map((d) =>
    deleteDoc(doc(db, 'reviews', d.id))
  );
  await Promise.all(deleteReviewPromises);

  // 2. Delete achievements subcollection
  const achievementsSnap = await getDocs(
    collection(db, 'users', uid, 'achievements')
  );
  const deleteAchPromises = achievementsSnap.docs.map((d) =>
    deleteDoc(doc(db, 'users', uid, 'achievements', d.id))
  );
  await Promise.all(deleteAchPromises);

  // 3. Delete history subcollection
  const historySnap = await getDocs(
    collection(db, 'users', uid, 'history')
  );
  const deleteHistPromises = historySnap.docs.map((d) =>
    deleteDoc(doc(db, 'users', uid, 'history', d.id))
  );
  await Promise.all(deleteHistPromises);

  // 4. Delete user profile
  await deleteUserProfile(uid);

  // 5. Delete Firebase Auth account
  await deleteAuthAccount();
}
