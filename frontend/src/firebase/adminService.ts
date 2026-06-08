import { initializeApp, deleteApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig, db, auth } from './config';

export interface CustomerRecord {
  uid: string;
  displayName: string;
  email: string;
  createdAt: Date;
  createdBy: string;
}

/**
 * Generates a cryptographically random temporary password.
 * Uses Web Crypto API — available in all modern browsers and Node 19+.
 */
function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
  const array = new Uint8Array(14);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join('');
}

/**
 * Creates a new customer account using a temporary secondary Firebase app
 * instance (so the admin is never signed out of their own session).
 * A cryptographically random temporary password is generated and the account
 * is created with it. A Firebase password-reset email is immediately sent to
 * the customer so they can set their own password before first login.
 * The `mustChangePassword` flag is stored in Firestore so the portal can
 * enforce a password-change step on first login.
 */
export async function createCustomerAccount(
  displayName: string,
  email: string,
  adminUid: string
): Promise<CustomerRecord> {
  const tempPassword = generateTempPassword();

  const secondaryApp = initializeApp(firebaseConfig, `admin-create-${Date.now()}`);
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const credential = await createUserWithEmailAndPassword(
      secondaryAuth,
      email,
      tempPassword
    );

    await updateProfile(credential.user, { displayName });

    const record: CustomerRecord = {
      uid: credential.user.uid,
      displayName,
      email,
      createdAt: new Date(),
      createdBy: adminUid
    };

    await setDoc(doc(db, 'customers', credential.user.uid), {
      ...record,
      mustChangePassword: true,
      createdAt: serverTimestamp()
    });

    // Send the Firebase "set your password" email using the main auth instance.
    // The customer receives a secure link to set their own password.
    await sendPasswordResetEmail(auth, email);

    return record;
  } finally {
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

