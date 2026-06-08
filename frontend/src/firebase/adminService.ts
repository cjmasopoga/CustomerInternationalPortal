import { initializeApp, deleteApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig, db } from './config';

export interface CustomerRecord {
  uid: string;
  displayName: string;
  email: string;
  createdAt: Date;
  createdBy: string;
}

/**
 * Creates a new customer account using a temporary secondary Firebase app
 * instance. This prevents the admin from being signed out of their own session
 * when createUserWithEmailAndPassword is called.
 */
export async function createCustomerAccount(
  displayName: string,
  email: string,
  password: string,
  adminUid: string
): Promise<CustomerRecord> {
  // Spin up a secondary (temporary) Firebase app — isolated from the main auth
  const secondaryApp = initializeApp(firebaseConfig, `admin-create-${Date.now()}`);
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const credential = await createUserWithEmailAndPassword(
      secondaryAuth,
      email,
      password
    );

    await updateProfile(credential.user, { displayName });

    const record: CustomerRecord = {
      uid: credential.user.uid,
      displayName,
      email,
      createdAt: new Date(),
      createdBy: adminUid
    };

    // Persist customer metadata in Firestore so the admin can see the list
    await setDoc(doc(db, 'customers', credential.user.uid), {
      ...record,
      createdAt: serverTimestamp()
    });

    return record;
  } finally {
    // Always clean up the secondary app to avoid memory leaks
    await secondaryAuth.signOut();
    await deleteApp(secondaryApp);
  }
}

/** Returns all customer records created by any admin */
export async function listCustomers(): Promise<CustomerRecord[]> {
  const snapshot = await getDocs(collection(db, 'customers'));
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      uid: d.id,
      displayName: data.displayName,
      email: data.email,
      createdAt: data.createdAt?.toDate() ?? new Date(),
      createdBy: data.createdBy
    };
  });
}
