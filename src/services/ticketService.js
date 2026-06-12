import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export async function createTicket(data) {
  const ref = await addDoc(collection(db, 'tickets'), {
    ...data,
    status: 'new',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    comments: [],
  });
  return ref.id;
}

export async function getMyTickets(userId) {
  const q = query(
    collection(db, 'tickets'),
    where('createdBy', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAllTickets() {
  const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getTicketById(id) {
  const snap = await getDoc(doc(db, 'tickets', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateTicketStatus(id, status, comment = '') {
  await updateDoc(doc(db, 'tickets', id), {
    status,
    updatedAt: serverTimestamp(),
    ...(comment && { lastComment: comment }),
  });
}

export async function addComment(ticketId, userId, displayName, text) {
  const ticket = await getTicketById(ticketId);
  const comments = ticket?.comments || [];
  await updateDoc(doc(db, 'tickets', ticketId), {
    comments: [
      ...comments,
      { userId, displayName, text, createdAt: new Date().toISOString() },
    ],
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToTickets(userId, role, callback) {
  let q;
  if (role === 'employee') {
    q = query(
      collection(db, 'tickets'),
      where('createdBy', '==', userId),
      orderBy('createdAt', 'desc')
    );
  } else {
    q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
  }
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}
