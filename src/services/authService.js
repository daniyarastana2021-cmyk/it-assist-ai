import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  multiFactor,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { USER_ROLES } from '../config/constants';

export async function registerUser(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });

  // Первый зарегистрированный пользователь становится admin
  const adminDoc = await getDoc(doc(db, 'meta', 'admin'));
  const role = adminDoc.exists() ? USER_ROLES.EMPLOYEE : USER_ROLES.ADMIN;

  await setDoc(doc(db, 'users', cred.user.uid), {
    uid: cred.user.uid,
    email,
    displayName,
    role,
    department: '',
    position: '',
    mfaEnabled: false,
    createdAt: serverTimestamp(),
  });

  // Создаём meta/admin только один раз
  if (!adminDoc.exists()) {
    await setDoc(doc(db, 'meta', 'admin'), { firstAdminUid: cred.user.uid });
  }

  return cred.user;
}

export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export async function updateUserRole(uid, role) {
  await updateDoc(doc(db, 'users', uid), { role });
}

// MFA — требует Firebase Identity Platform (платный Blaze план)
// ⚠️  Не подключайте без необходимости — это переведёт проект на платный тариф
// Используйте только если осознанно переходите на Blaze Plan
export function getMFAResolver(error) {
  // Placeholder для будущего подключения MFA
  // Реализация: https://firebase.google.com/docs/auth/web/mfa
  console.warn('MFA требует Blaze план. Текущий тариф: Spark (бесплатный).');
  return null;
}
