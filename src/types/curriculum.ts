export type SubjectDomain =
  | "Mathematics"
  | "Reading Language Arts"
  | "Foundational Skills";

export type QuestionType =
  | "multiple_choice"
  | "fill_blank"
  | "matching"
  | "drag_drop"
  | "reading_comprehension"
  | "vocabulary"
  | "sequencing";

export type ReadingQuestionSubType =
  | "Main Idea"
  | "Theme"
  | "Inference"
  | "Context Clues"
  | "Author Purpose"
  | "Sequencing";

export type FoundationalActivityType =
  | "Match Sound"
  | "Build Word"
  | "Read Aloud Tracking"
  | "Listening Activities";

export type SmartScoreLevel =
  | "Beginner" // 0-20
  | "Developing" // 21-50
  | "Proficient" // 51-80
  | "Mastered"; // 81-100

// ==========================================
// 1. COLLECTION: subjects
// ==========================================
export interface SubjectDoc {
  id: string;
  title: SubjectDomain;
  slug: string;
  description: string;
  icon: string;
  colorTheme: string;
  totalUnits: number;
  totalLessons: number;
  totalSkills: number;
  teksOverview: string[];
  sourcePdfFolder: string;
  order: number;
}

// ==========================================
// 2. COLLECTION: units
// ==========================================
export interface VocabularyItem {
  term: string;
  definition: string;
  exampleSentence: string;
  spanishCognate?: string;
  partOfSpeech?: string;
  phonicsPattern?: string;
}

export interface UnitDoc {
  id: string;
  subjectId: string;
  subjectTitle: SubjectDomain;
  unitNumber: number;
  code: string; // e.g., "M1", "RLA-U1", "FS-U1"
  title: string;
  subtitle: string;
  nineWeeks: "1st Nine Weeks" | "2nd Nine Weeks" | "3rd Nine Weeks" | "4th Nine Weeks";
  weekRange: string; // e.g. "Weeks 2-5 (08/24 - 09/18)" from 3rd_Grade_Curriculum.xlsx
  instructionalDays: number;
  teksStandards: string[];
  elpsStandards?: string[];
  overview: string;
  learningObjectives: string[];
  vocabulary: VocabularyItem[];
  assessments: string[];
  sourcePdf: string;
  readerTitle?: string;
  trickyWords?: string[];
  highFrequencyWords?: string[];
  order: number;
}

// ==========================================
// 3. COLLECTION: lessons
// ==========================================
export interface WorkedExample {
  id: string;
  title: string;
  problem: string;
  steps: string[];
  solution: string;
  visualModelType?: "array" | "strip_diagram" | "number_line" | "place_value" | "area_model" | "text_evidence" | "word_chunking";
  visualData?: Record<string, unknown>;
}

export interface LessonContentSections {
  introduction: string;
  learningObjective: string;
  examples: WorkedExample[];
  guidedPractice: {
    prompt: string;
    scaffoldSteps: string[];
    checkQuestion: string;
    checkAnswer: string;
  }[];
  independentPractice: string[];
  assessment: string;
  summary: string;
}

export interface ReadingPassage {
  title: string;
  authorOrSource: string;
  genre: string;
  lexileOrGrade: string;
  skillWords?: string[];
  paragraphs: string[];
  audioSummary: string;
}

export interface FoundationalLessonExtras {
  sightWords: string[];
  trickyWords: string[];
  phonicsFocus: string;
  fluencyPassage: string;
  wordBuildingTiles: {
    targetWord: string;
    syllables: string[];
    hint: string;
  }[];
  soundMatches: {
    soundPrompt: string;
    phoneme: string;
    correctWord: string;
    distractors: string[];
  }[];
}

export interface LessonDoc {
  id: string;
  unitId: string;
  subjectId: string;
  lessonNumber: number;
  topicCode?: string; // e.g., "Topic A"
  title: string;
  teks: string[];
  objective: string;
  vocabulary: VocabularyItem[];
  sections: LessonContentSections;
  readingPassage?: ReadingPassage;
  foundationalExtras?: FoundationalLessonExtras;
  skillIds: string[];
  estimatedMinutes: number;
  sourcePdf: string;
  order: number;
}

// ==========================================
// 4. COLLECTION: skills
// ==========================================
export interface SkillDoc {
  id: string;
  lessonId: string;
  unitId: string;
  subjectId: string;
  code: string; // IXL-style skill code e.g. "M1.A.1", "RLA1.1", "FS1.1"
  title: string;
  description: string;
  teks: string;
  difficulty: 1 | 2 | 3;
  easierSkillId?: string; // Used by deterministic Adaptive Learning when mastery < 60
  nextSkillId?: string;
  workedExample: WorkedExample;
  hints: string[];
  miniAssessmentSummary: string;
  questionIds: string[];
  order: number;
}

// ==========================================
// 5. COLLECTION: questions
// ==========================================
export interface MatchingPair {
  left: string;
  right: string;
}

export interface DragDropItem {
  id: string;
  label: string;
  category: string;
}

export interface QuestionDoc {
  id: string;
  skillId: string;
  lessonId: string;
  unitId: string;
  subjectId: string;
  type: QuestionType;
  readingSubType?: ReadingQuestionSubType;
  foundationalActivityType?: FoundationalActivityType;
  difficulty: 1 | 2 | 3;
  teks: string;
  prompt: string;
  audioInstruction?: string;
  passageExcerpt?: string;
  options?: string[]; // For multiple_choice, vocabulary, reading_comprehension
  correctAnswer: string; // String or JSON-encoded array for sequencing/matching/drag_drop
  acceptableAnswers?: string[]; // For fill_blank case-insensitive variants
  matchingPairs?: MatchingPair[]; // For matching
  dragDropCategories?: string[]; // For drag_drop
  dragDropItems?: DragDropItem[]; // For drag_drop
  sequenceItems?: string[]; // Correct order for sequencing
  hint: string;
  workedExplanation: string;
  isMiniAssessment?: boolean;
}

// ==========================================
// 6. COLLECTION: students
// ==========================================
export interface AccessibilityPreferences {
  dyslexiaFont: boolean;
  textToSpeech: boolean;
  darkMode: boolean;
  largeButtons: boolean;
  audioInstructions: boolean;
}

export interface StudentDoc {
  id: string;
  username: string; // Simple child login ID (e.g. "leo")
  password: string; // Simple child password (e.g. "1234")
  name: string;
  email?: string;
  avatar: string;
  grade: 3;
  parentId: string;
  xp: number;
  stars: number;
  coins: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  dailyGoalMinutes: number;
  todayMinutesSpent: number;
  todayQuestionsAnswered: number;
  dailyGoalTargetQuestions: number;
  earnedBadgeIds: string[];
  accessibility: AccessibilityPreferences;
  createdAt: string;
}

// ==========================================
// 7. COLLECTION: parents
// ==========================================
export interface ParentDoc {
  id: string;
  username: string; // Admin login ID (default: "admin")
  password: string; // Admin password (default: "admin123")
  name: string;
  email: string;
  studentIds: string[];
  pinCode: string;
  enableAiFeatures: boolean;
  createdAt: string;
}

// ==========================================
// 8. COLLECTION: attempts
// ==========================================
export interface AttemptDoc {
  id: string;
  studentId: string;
  subjectId: string;
  unitId: string;
  lessonId: string;
  skillId: string;
  questionId: string;
  questionType: QuestionType;
  isCorrect: boolean;
  selectedAnswer: string;
  smartScoreBefore: number;
  smartScoreAfter: number;
  timeSpentSeconds: number;
  usedHint: boolean;
  timestamp: string; // ISO string
  dateKey: string; // YYYY-MM-DD
}

// ==========================================
// 9. COLLECTION: progress
// ==========================================
export interface SkillProgressDoc {
  id: string; // `${studentId}_${skillId}`
  studentId: string;
  subjectId: string;
  unitId: string;
  lessonId: string;
  skillId: string;
  skillCode: string;
  skillTitle: string;
  teks: string;
  smartScore: number; // 0-100
  level: SmartScoreLevel;
  attemptsCount: number;
  correctCount: number;
  consecutiveCorrect: number;
  totalTimeSeconds: number;
  needsRemediation: boolean; // true if smartScore < 60 after >= 3 attempts
  recommendedEasierSkillId?: string;
  retestScheduledAt?: string;
  lastPracticedAt: string;
}

// ==========================================
// 10. COLLECTION: badges
// ==========================================
export interface BadgeDoc {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "math" | "reading" | "foundational" | "streak" | "mastery";
  xpReward: number;
  coinReward: number;
  criteriaText: string;
}

// ==========================================
// 11. COLLECTION: reports
// ==========================================
export interface ParentReportDoc {
  id: string;
  studentId: string;
  parentId: string;
  generatedAt: string;
  period: "daily" | "weekly" | "monthly";
  generatedBy: "deterministic_engine" | "gemini_ai";
  overallMasteryAvg: number;
  totalQuestionsAnswered: number;
  overallAccuracy: number;
  totalMinutesSpent: number;
  strongSkills: { skillCode: string; title: string; score: number }[];
  weakSkills: { skillCode: string; title: string; score: number; recommendedAction: string }[];
  summaryText: string;
  actionableTips: string[];
}

