import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import {
  getFirestore,
  Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    !firebaseConfig.apiKey.includes("your-api-key")
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    if (typeof window !== "undefined") {
      try {
        db = initializeFirestore(app, {
          localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager(),
          }),
        });
      } catch {
        db = getFirestore(app);
      }
    } else {
      db = getFirestore(app);
    }
    storage = getStorage(app);
  } catch (err) {
    console.warn("Firebase initialization fallback to local cache mode:", err);
  }
}

export const FIRESTORE_COLLECTIONS = {
  STUDENTS: "students",
  PARENTS: "parents",
  SUBJECTS: "subjects",
  UNITS: "units",
  LESSONS: "lessons",
  SKILLS: "skills",
  QUESTIONS: "questions",
  ATTEMPTS: "attempts",
  PROGRESS: "progress",
  BADGES: "badges",
  REPORTS: "reports",
} as const;

export { app, auth, db, storage };

