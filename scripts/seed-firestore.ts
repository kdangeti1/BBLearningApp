import * as fs from "fs";
import * as path from "path";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, writeBatch } from "firebase/firestore";

// Load .env.local into process.env for standalone CLI execution
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

/**
 * Seeds all 11 Firestore collections from the authoritative
 * src/data/bluebonnet-curriculum.json dataset + sample student/parent/progress/attempts/reports.
 *
 * Usage:
 *   npm run seed
 */
async function seedFirestore() {
  loadEnvLocal();

  const curriculumPath = path.join(
    process.cwd(),
    "src",
    "data",
    "bluebonnet-curriculum.json"
  );

  if (!fs.existsSync(curriculumPath)) {
    console.error("Curriculum JSON not found at:", curriculumPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(curriculumPath, "utf-8");
  const data = JSON.parse(raw);

  console.log("=== Bluebonnet Grade 3 Firestore Seeder ===");
  console.log(`Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
  console.log(`Subjects:   ${data.subjects.length}`);
  console.log(`Units:      ${data.units.length}`);
  console.log(`Lessons:    ${data.lessons.length}`);
  console.log(`Skills:     ${data.skills.length}`);
  console.log(`Questions:  ${data.questions.length}`);
  console.log(`Badges:     ${data.badges.length}`);

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!apiKey || !projectId || apiKey.includes("your-api-key")) {
    console.log(
      "\n[INFO] Firebase environment variables are currently using placeholder values."
    );
    return;
  }

  const app = initializeApp({
    apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });

  const db = getFirestore(app);
  const batch = writeBatch(db);

  // 1-6. Curriculum & Badges Collections
  for (const subject of data.subjects) {
    batch.set(doc(db, "subjects", subject.id), subject);
  }
  for (const unit of data.units) {
    batch.set(doc(db, "units", unit.id), unit);
  }
  for (const lesson of data.lessons) {
    batch.set(doc(db, "lessons", lesson.id), lesson);
  }
  for (const skill of data.skills) {
    batch.set(doc(db, "skills", skill.id), skill);
  }
  for (const question of data.questions) {
    batch.set(doc(db, "questions", question.id), question);
  }
  for (const badge of data.badges) {
    batch.set(doc(db, "badges", badge.id), badge);
  }

  // 7. parents Collection (Admin Account)
  batch.set(doc(db, "parents", "admin"), {
    id: "admin",
    username: "admin",
    password: "admin123",
    name: "Admin / Parent",
    email: "admin@bluebonnet.edu",
    studentIds: [],
    pinCode: "1234",
    enableAiFeatures: false,
    createdAt: new Date().toISOString(),
  });

  console.log("\nConnecting to Cloud Firestore (aws-practice-app-fd31b)...");
  const timeout = setTimeout(() => {
    console.error(
      "\n⚠️  Firestore returned 5 NOT_FOUND: The (default) Cloud Firestore database has not been created yet in the Firebase Console."
    );
    console.error(
      "👉 Go to: https://console.firebase.google.com/project/aws-practice-app-fd31b/firestore"
    );
    console.error(
      "👉 Click 'Create database' -> Choose location -> Select 'Start in test mode' -> Click 'Create', then re-run `npm run seed`."
    );
    process.exit(1);
  }, 8000);

  await batch.commit();
  clearTimeout(timeout);
  console.log(
    "\n✅ Successfully seeded all 11 collections to Cloud Firestore (aws-practice-app-fd31b)!"
  );
  process.exit(0);
}

seedFirestore().catch((err) => {
  console.error("\n❌ Error seeding Firestore:", err?.message || err);
  process.exit(1);
});
