// src/config/firebase.ts
import admin from 'firebase-admin';
import { firebaseServiceAccount } from './firebase-service-account';

admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount as admin.ServiceAccount),
});

export default admin;
