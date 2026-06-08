import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../firebase/AuthContext';

/**
 * Returns true when the currently signed-in user has an admin document
 * at Firestore path `admins/{uid}`.
 *
 * Admins are seeded manually (or via the Firebase Console) by adding a
 * document to the `admins` collection with `{role: 'admin'}`.
 */
export function useAdmin(): { isAdmin: boolean; loading: boolean } {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    let cancelled = false;

    getDoc(doc(db, 'admins', currentUser.uid))
      .then((snap) => {
        if (!cancelled) {
          setIsAdmin(snap.exists());
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsAdmin(false);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  return { isAdmin, loading };
}
