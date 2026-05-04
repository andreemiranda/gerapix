import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { AdminUser } from '../types';

export function useAdminUsers() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'admins'),
      (snap) => {
        setAdmins(snap.docs.map((doc) => ({ uid: doc.id, ...doc.data() }) as AdminUser));
        setLoading(false);
      },
      (err) => {
        console.error('Error observing admin status:', err);
        // We don't throw here to avoid crashing the hook, but we stop loading
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const removeAdmin = async (uid: string) => {
    await deleteDoc(doc(db, 'admins', uid));
  };

  return { admins, loading, removeAdmin, count: admins.length };
}
