import {
  signInAnonymously as firebaseSignInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  EmailAuthProvider,
  linkWithCredential,
  signOut as firebaseSignOut,
  deleteUser,
  onAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from './config';

export const signInAnonymously = async (): Promise<UserCredential> => {
  return firebaseSignInAnonymously(auth);
};

export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async (
  idToken: string
): Promise<UserCredential> => {
  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
};

export const linkAnonymousToEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('No current user');
  const credential = EmailAuthProvider.credential(email, password);
  return linkWithCredential(currentUser, credential);
};

export const linkAnonymousToGoogle = async (
  idToken: string
): Promise<UserCredential> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('No current user');
  const credential = GoogleAuthProvider.credential(idToken);
  return linkWithCredential(currentUser, credential);
};

export const signOut = async (): Promise<void> => {
  return firebaseSignOut(auth);
};

export const deleteAccount = async (): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('No current user');
  return deleteUser(currentUser);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const isAnonymous = (): boolean => {
  return auth.currentUser?.isAnonymous ?? false;
};
