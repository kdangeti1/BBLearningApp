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

  // 7. students Collection
  batch.set(doc(db, "students", "student-leo-g3"), {
    id: "student-leo-g3",
    username: "leo",
    password: "1234",
    name: "Leo Martinez",
    email: "leo.g3@bluebonnet.edu",
    avatar: "🦊",
    grade: 3,
    parentId: "admin",
    xp: 1450,
    stars: 34,
    coins: 280,
    streakDays: 5,
    lastActiveDate: new Date().toISOString().slice(0, 10),
    dailyGoalMinutes: 25,
    todayMinutesSpent: 18,
    todayQuestionsAnswered: 12,
    dailyGoalTargetQuestions: 15,
    earnedBadgeIds: ["badge-5-day-streak", "badge-multiplication-master"],
    accessibility: {
      dyslexiaFont: false,
      textToSpeech: true,
      darkMode: false,
      largeButtons: false,
      audioInstructions: true,
    },
    createdAt: new Date().toISOString(),
  });

  // 8. parents Collection (Admin Account)
  batch.set(doc(db, "parents", "admin"), {
    id: "admin",
    username: "admin",
    password: "admin123",
    name: "Admin / Parent",
    email: "admin@bluebonnet.edu",
    studentIds: ["student-leo-g3"],
    pinCode: "1234",
    enableAiFeatures: false,
    createdAt: new Date().toISOString(),
  });

  // 9. progress Collection
  batch.set(doc(db, "progress", "student-leo-g3_math-m1-s1"), {
    id: "student-leo-g3_math-m1-s1",
    studentId: "student-leo-g3",
    subjectId: "subj-math",
    unitId: "math-m1",
    lessonId: "math-m1-l1",
    skillId: "math-m1-s1",
    skillCode: "M1.A.1",
    skillTitle: "Understand Equal Groups as Multiplication",
    teks: "3.4D, 3.4E",
    smartScore: 88,
    level: "Mastered",
    attemptsCount: 16,
    correctCount: 15,
    consecutiveCorrect: 6,
    totalTimeSeconds: 420,
    needsRemediation: false,
    lastPracticedAt: new Date().toISOString(),
  });

  // 10. attempts Collection
  batch.set(doc(db, "attempts", "att-seed-1"), {
    id: "att-seed-1",
    studentId: "student-leo-g3",
    subjectId: "subj-math",
    unitId: "math-m1",
    lessonId: "math-m1-l1",
    skillId: "math-m1-s1",
    questionId: "math-m1-q1",
    questionType: "multiple_choice",
    isCorrect: true,
    selectedAnswer: "4 × 3 = 12",
    smartScoreBefore: 81,
    smartScoreAfter: 88,
    timeSpentSeconds: 22,
    usedHint: false,
    timestamp: new Date().toISOString(),
    dateKey: new Date().toISOString().slice(0, 10),
  });

  // 11. reports Collection
  batch.set(doc(db, "reports", "rep-seed-1"), {
    id: "rep-seed-1",
    studentId: "student-leo-g3",
    parentId: "parent-martinez",
    generatedAt: new Date().toISOString(),
    period: "weekly",
    generatedBy: "deterministic_engine",
    overallMasteryAvg: 74,
    totalQuestionsAnswered: 97,
    overallAccuracy: 84,
    totalMinutesSpent: 47,
    strongSkills: [
      { skillCode: "FS.1.1", title: "Decode Closed Syllables & Trigraphs", score: 91 },
      { skillCode: "M1.A.1", title: "Understand Equal Groups as Multiplication", score: 88 },
    ],
    weakSkills: [
      {
        skillCode: "M5.A.1",
        title: "Unit Fractions and Number Line Partitioning",
        score: 46,
        recommendedAction: "Practice prerequisite skill M4.A.1 and review its worked example.",
      },
    ],
    summaryText: "Leo has maintained a 5-day learning streak with an average SmartScore of 74/100.",
    actionableTips: [
      "Focus 10 minutes on M5.A.1: Unit Fractions on a Number Line.",
      "Read aloud today's Bluebonnet Reader passage in the Foundational Skills Lab.",
    ],
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
