"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import curriculumData from "@/data/bluebonnet-curriculum.json";
import {
  SubjectDoc,
  UnitDoc,
  LessonDoc,
  SkillDoc,
  QuestionDoc,
  StudentDoc,
  ParentDoc,
  AttemptDoc,
  SkillProgressDoc,
  BadgeDoc,
  ParentReportDoc,
  AccessibilityPreferences,
} from "@/types/curriculum";
import { calculateSmartScore, getSmartScoreLevel } from "@/lib/utils";
import { db, isFirebaseConfigured, FIRESTORE_COLLECTIONS } from "@/lib/firebase";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";

const typedCurriculum = curriculumData as unknown as {
  subjects: SubjectDoc[];
  units: UnitDoc[];
  lessons: LessonDoc[];
  skills: SkillDoc[];
  questions: QuestionDoc[];
  badges: BadgeDoc[];
};

const EMPTY_STUDENT: StudentDoc = {
  id: "",
  username: "",
  password: "",
  name: "Student",
  email: "",
  avatar: "🎓",
  grade: 3,
  parentId: "admin",
  xp: 0,
  stars: 0,
  coins: 0,
  streakDays: 0,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  dailyGoalMinutes: 25,
  todayMinutesSpent: 0,
  todayQuestionsAnswered: 0,
  dailyGoalTargetQuestions: 15,
  earnedBadgeIds: [],
  accessibility: {
    dyslexiaFont: false,
    textToSpeech: true,
    darkMode: false,
    largeButtons: false,
    audioInstructions: true,
  },
  createdAt: new Date().toISOString(),
};

const INITIAL_PARENT: ParentDoc = {
  id: "admin",
  username: "admin",
  password: "admin123",
  name: "Admin / Parent",
  email: "admin@bluebonnet.edu",
  studentIds: [],
  pinCode: "1234",
  enableAiFeatures: process.env.NEXT_PUBLIC_ENABLE_AI === "true",
  createdAt: "2026-08-19T08:00:00.000Z",
};

const INITIAL_PROGRESS: Record<string, SkillProgressDoc> = {};
const INITIAL_ATTEMPTS: AttemptDoc[] = [];

export type ActiveRole = "student" | "parent";
export type MainTab =
  | "dashboard"
  | "subjects"
  | "pacing_calendar"
  | "lesson_viewer"
  | "skill_practice"
  | "reading_studio"
  | "foundational_lab"
  | "brain_games"
  | "badges"
  | "parent_dashboard"
  | "curriculum_import"
  | "manage_children";

interface LearningStoreState {
  // Authentication & Multi-Child State
  isAuthenticated: boolean;
  loggedInAccountType: "admin" | "child" | null;
  studentsList: StudentDoc[];
  allStudentsProgress: Record<string, Record<string, SkillProgressDoc>>;

  // Navigation & Role
  activeRole: ActiveRole;
  activeTab: MainTab;
  selectedSubjectId: string;
  selectedUnitId: string;
  selectedLessonId: string;
  selectedSkillId: string;

  // Feature Flag: ENABLE_AI
  enableAi: boolean;

  // All 11 Firestore Collections
  subjects: SubjectDoc[];
  units: UnitDoc[];
  lessons: LessonDoc[];
  skills: SkillDoc[];
  questions: QuestionDoc[];
  badges: BadgeDoc[];
  student: StudentDoc;
  parent: ParentDoc;
  progress: Record<string, SkillProgressDoc>;
  attempts: AttemptDoc[];
  reports: ParentReportDoc[];

  // Auth & Profile Management Actions
  login: (username: string, password: string) => {
    success: boolean;
    message: string;
    role?: "admin" | "child";
  };
  logout: () => void;
  createChildProfile: (params: {
    name: string;
    username: string;
    password: string;
    avatar: string;
    dailyGoalMinutes?: number;
    dailyGoalTargetQuestions?: number;
  }) => Promise<{ success: boolean; message: string; child?: StudentDoc }>;
  updateChildPassword: (studentId: string, newPassword: string) => Promise<void>;
  deleteChildProfile: (studentId: string) => Promise<void>;
  selectActiveChild: (studentId: string) => void;
  loadProfilesFromFirestore: () => Promise<void>;

  // Navigation Actions
  setActiveRole: (role: ActiveRole) => void;
  setActiveTab: (tab: MainTab) => void;
  selectSubject: (subjectId: string) => void;
  selectUnit: (unitId: string) => void;
  openLesson: (lessonId: string) => void;
  startSkillPractice: (skillId: string) => void;
  toggleAccessibility: (key: keyof AccessibilityPreferences) => void;
  setEnableAi: (enabled: boolean) => void;

  // Core Learning Engine Actions
  recordQuestionAttempt: (params: {
    skillId: string;
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
    timeSpentSeconds: number;
    usedHint: boolean;
  }) => {
    smartScoreBefore: number;
    smartScoreAfter: number;
    delta: number;
    streakBonusAwarded: boolean;
    newlyEarnedBadges: BadgeDoc[];
    needsRemediation: boolean;
    easierSkill?: SkillDoc;
  };

  addFluencyPracticeXP: (wpm: number, accuracy: number) => void;
  addBrainGameReward: (xp: number, coins: number, stars?: number) => void;
  addCustomPracticeQuestions: (newQuestions: QuestionDoc[]) => void;
  importCustomCurriculumData: (payload: {
    units?: UnitDoc[];
    lessons?: LessonDoc[];
    skills?: SkillDoc[];
    questions?: QuestionDoc[];
  }) => void;
  generateDeterministicParentReport: (
    period: "daily" | "weekly" | "monthly"
  ) => ParentReportDoc;
  syncAllToFirestore: () => Promise<{ synced: boolean; message: string }>;
}

export const useLearningStore = create<LearningStoreState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      loggedInAccountType: null,
      studentsList: [],
      allStudentsProgress: {},

      activeRole: "student",
      activeTab: "dashboard",
      selectedSubjectId: "subj-math",
      selectedUnitId: "math-m1",
      selectedLessonId: "math-m1-l1",
      selectedSkillId: "math-m1-s1",

      enableAi: process.env.NEXT_PUBLIC_ENABLE_AI === "true",

      subjects: typedCurriculum.subjects,
      units: typedCurriculum.units,
      lessons: typedCurriculum.lessons,
      skills: typedCurriculum.skills,
      questions: typedCurriculum.questions,
      badges: typedCurriculum.badges,
      student: EMPTY_STUDENT,
      parent: INITIAL_PARENT,
      progress: INITIAL_PROGRESS,
      attempts: INITIAL_ATTEMPTS,
      reports: [],

      login: (username, password) => {
        const cleanUser = username.trim().toLowerCase();
        const cleanPass = password.trim();
        const state = get();

        // 1. Check Admin Login (default: admin / admin123)
        const adminUsername = (state.parent.username || "admin").toLowerCase();
        const adminPassword = state.parent.password || "admin123";

        if (
          (cleanUser === adminUsername ||
            cleanUser === "admin" ||
            cleanUser === state.parent.email.toLowerCase()) &&
          cleanPass === adminPassword
        ) {
          const activeStudent = state.studentsList[0] || EMPTY_STUDENT;
          const activeProg =
            state.allStudentsProgress[activeStudent.id] || {};
          set({
            isAuthenticated: true,
            loggedInAccountType: "admin",
            activeRole: "parent",
            activeTab: "manage_children",
            student: activeStudent,
            progress: activeProg,
          });
          return {
            success: true,
            message: "Welcome, Admin! You can manage child profiles and view analytics.",
            role: "admin",
          };
        }

        // 2. Check Child Profiles
        const matchedChild = state.studentsList.find(
          (s) =>
            (s.username || "").toLowerCase() === cleanUser ||
            s.name.toLowerCase() === cleanUser
        );

        if (matchedChild && matchedChild.password === cleanPass) {
          const childProgress =
            state.allStudentsProgress[matchedChild.id] || {};
          set({
            isAuthenticated: true,
            loggedInAccountType: "child",
            activeRole: "student",
            activeTab: "dashboard",
            student: matchedChild,
            progress: childProgress,
          });
          return {
            success: true,
            message: `Welcome back, ${matchedChild.name}!`,
            role: "child",
          };
        }

        return {
          success: false,
          message:
            "Invalid Login ID or password. Please check your credentials and try again.",
        };
      },

      logout: () =>
        set({
          isAuthenticated: false,
          loggedInAccountType: null,
          activeTab: "dashboard",
        }),

      createChildProfile: async ({
        name,
        username,
        password,
        avatar,
        dailyGoalMinutes = 25,
        dailyGoalTargetQuestions = 15,
      }) => {
        const state = get();
        const cleanUsername = username
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "");

        if (!name.trim() || !cleanUsername || !password.trim()) {
          return {
            success: false,
            message: "Please provide a Name, Login ID, and Password.",
          };
        }

        if (
          cleanUsername === "admin" ||
          state.studentsList.some(
            (s) => (s.username || "").toLowerCase() === cleanUsername
          )
        ) {
          return {
            success: false,
            message: `Login ID "${cleanUsername}" is already taken. Please choose another ID.`,
          };
        }

        const newStudent: StudentDoc = {
          id: `student-${cleanUsername}-${Date.now().toString().slice(-4)}`,
          username: cleanUsername,
          password: password.trim(),
          name: name.trim(),
          email: `${cleanUsername}@bluebonnet.edu`,
          avatar: avatar || "🦊",
          grade: 3,
          parentId: state.parent.id,
          xp: 100,
          stars: 5,
          coins: 50,
          streakDays: 1,
          lastActiveDate: new Date().toISOString().slice(0, 10),
          dailyGoalMinutes,
          todayMinutesSpent: 0,
          todayQuestionsAnswered: 0,
          dailyGoalTargetQuestions,
          earnedBadgeIds: [],
          accessibility: {
            dyslexiaFont: false,
            textToSpeech: true,
            darkMode: false,
            largeButtons: false,
            audioInstructions: true,
          },
          createdAt: new Date().toISOString(),
        };

        const nextStudentsList = [...state.studentsList, newStudent];
        const nextParent: ParentDoc = {
          ...state.parent,
          studentIds: nextStudentsList.map((s) => s.id),
        };
        const nextAllProgress = {
          ...state.allStudentsProgress,
          [newStudent.id]: {},
        };

        set({
          studentsList: nextStudentsList,
          parent: nextParent,
          allStudentsProgress: nextAllProgress,
          student: newStudent,
          progress: {},
        });

        if (isFirebaseConfigured && db) {
          try {
            await setDoc(
              doc(db, FIRESTORE_COLLECTIONS.STUDENTS, newStudent.id),
              newStudent
            );
            await setDoc(
              doc(db, FIRESTORE_COLLECTIONS.PARENTS, nextParent.id),
              nextParent
            );
          } catch (err) {
            console.warn("Firestore child profile save warning:", err);
          }
        }

        return {
          success: true,
          message: `Created child profile for ${newStudent.name} (Login ID: "${newStudent.username}")!`,
          child: newStudent,
        };
      },

      updateChildPassword: async (studentId, newPassword) => {
        const state = get();
        const updatedList = state.studentsList.map((s) =>
          s.id === studentId ? { ...s, password: newPassword.trim() } : s
        );
        const updatedActive =
          state.student.id === studentId
            ? { ...state.student, password: newPassword.trim() }
            : state.student;

        set({
          studentsList: updatedList,
          student: updatedActive,
        });

        const target = updatedList.find((s) => s.id === studentId);
        if (target && isFirebaseConfigured && db) {
          await setDoc(
            doc(db, FIRESTORE_COLLECTIONS.STUDENTS, target.id),
            target
          ).catch(() => {});
        }
      },

      deleteChildProfile: async (studentId) => {
        const state = get();
        const remaining = state.studentsList.filter((s) => s.id !== studentId);
        const nextActive =
          state.student.id === studentId
            ? remaining[0] || EMPTY_STUDENT
            : state.student;
        const nextAllProg = { ...state.allStudentsProgress };
        delete nextAllProg[studentId];

        set({
          studentsList: remaining,
          student: nextActive,
          progress: nextAllProg[nextActive.id] || {},
          allStudentsProgress: nextAllProg,
        });

        if (isFirebaseConfigured && db) {
          await deleteDoc(
            doc(db, FIRESTORE_COLLECTIONS.STUDENTS, studentId)
          ).catch(() => {});
        }
      },

      selectActiveChild: (studentId) => {
        const state = get();
        const found = state.studentsList.find((s) => s.id === studentId);
        if (!found) return;
        const childProg = state.allStudentsProgress[found.id] || {};
        set({
          student: found,
          progress: childProg,
        });
      },

      loadProfilesFromFirestore: async () => {
        if (!isFirebaseConfigured || !db) return;
        try {
          const studentsSnap = await getDocs(
            collection(db, FIRESTORE_COLLECTIONS.STUDENTS)
          );
          const remoteStudents: StudentDoc[] = [];
          studentsSnap.forEach((docSnap) => {
            const d = docSnap.data() as StudentDoc;
            if (d && d.id) {
              remoteStudents.push({
                ...d,
                username:
                  d.username ||
                  d.name.toLowerCase().split(" ")[0] ||
                  "student",
                password: d.password || "",
              });
            }
          });

          const progressSnap = await getDocs(
            collection(db, FIRESTORE_COLLECTIONS.PROGRESS)
          );
          const remoteProgressByStudent: Record<
            string,
            Record<string, SkillProgressDoc>
          > = {};

          progressSnap.forEach((docSnap) => {
            const p = docSnap.data() as SkillProgressDoc;
            if (p && p.studentId && p.skillId) {
              if (!remoteProgressByStudent[p.studentId]) {
                remoteProgressByStudent[p.studentId] = {};
              }
              remoteProgressByStudent[p.studentId][p.skillId] = p;
            }
          });

          // Sync directly with Firestore as single source of truth
          const currentStudentId = get().student?.id;
          const activeStudent =
            remoteStudents.find((s) => s.id === currentStudentId) ||
            remoteStudents[0] ||
            EMPTY_STUDENT;

          set({
            studentsList: remoteStudents,
            allStudentsProgress: remoteProgressByStudent,
            student: activeStudent,
            progress: remoteProgressByStudent[activeStudent.id] || {},
          });
        } catch (err) {
          console.warn("Firestore profile sync notice:", err);
        }
      },

      setActiveRole: (role) => {
        const state = get();
        // Only admin can switch freely to parent settings
        if (role === "parent" && state.loggedInAccountType === "child") {
          return;
        }
        set({
          activeRole: role,
          activeTab: role === "parent" ? "parent_dashboard" : "dashboard",
        });
      },

      setActiveTab: (tab) => set({ activeTab: tab }),

      selectSubject: (subjectId) => {
        const unitsForSubject = get().units.filter(
          (u) => u.subjectId === subjectId
        );
        const firstUnit = unitsForSubject[0];
        const firstLesson = firstUnit
          ? get().lessons.find((l) => l.unitId === firstUnit.id)
          : undefined;
        const firstSkill = firstLesson
          ? get().skills.find((s) => s.lessonId === firstLesson.id)
          : undefined;

        set({
          selectedSubjectId: subjectId,
          selectedUnitId: firstUnit?.id || get().selectedUnitId,
          selectedLessonId: firstLesson?.id || get().selectedLessonId,
          selectedSkillId: firstSkill?.id || get().selectedSkillId,
        });
      },

      selectUnit: (unitId) => {
        const unit = get().units.find((u) => u.id === unitId);
        const lesson = get().lessons.find((l) => l.unitId === unitId);
        const skill = lesson
          ? get().skills.find((s) => s.lessonId === lesson.id)
          : undefined;
        set({
          selectedSubjectId: unit?.subjectId || get().selectedSubjectId,
          selectedUnitId: unitId,
          selectedLessonId: lesson?.id || get().selectedLessonId,
          selectedSkillId: skill?.id || get().selectedSkillId,
        });
      },

      openLesson: (lessonId) => {
        const lesson = get().lessons.find((l) => l.id === lessonId);
        if (!lesson) return;
        const firstSkillId = lesson.skillIds[0] || get().selectedSkillId;
        set({
          selectedSubjectId: lesson.subjectId,
          selectedUnitId: lesson.unitId,
          selectedLessonId: lesson.id,
          selectedSkillId: firstSkillId,
          activeTab: "lesson_viewer",
        });
      },

      startSkillPractice: (skillId) => {
        const skill = get().skills.find((s) => s.id === skillId);
        if (!skill) return;
        set({
          selectedSubjectId: skill.subjectId,
          selectedUnitId: skill.unitId,
          selectedLessonId: skill.lessonId,
          selectedSkillId: skill.id,
          activeTab: "skill_practice",
        });
      },

      toggleAccessibility: (key) =>
        set((state) => {
          const updatedStudent: StudentDoc = {
            ...state.student,
            accessibility: {
              ...state.student.accessibility,
              [key]: !state.student.accessibility[key],
            },
          };
          const updatedList = state.studentsList.map((s) =>
            s.id === updatedStudent.id ? updatedStudent : s
          );
          return {
            student: updatedStudent,
            studentsList: updatedList,
          };
        }),

      setEnableAi: (enabled) =>
        set((state) => ({
          enableAi: enabled,
          parent: { ...state.parent, enableAiFeatures: enabled },
        })),

      recordQuestionAttempt: ({
        skillId,
        questionId,
        selectedAnswer,
        isCorrect,
        timeSpentSeconds,
        usedHint,
      }) => {
        const state = get();
        const skill = state.skills.find((s) => s.id === skillId);
        const question = state.questions.find((q) => q.id === questionId);

        if (!skill || !question) {
          return {
            smartScoreBefore: 0,
            smartScoreAfter: 0,
            delta: 0,
            streakBonusAwarded: false,
            newlyEarnedBadges: [],
            needsRemediation: false,
          };
        }

        const existingProgress = state.progress[skillId];
        const smartScoreBefore = existingProgress
          ? existingProgress.smartScore
          : 0;
        const prevConsecutive = existingProgress
          ? existingProgress.consecutiveCorrect
          : 0;
        const newConsecutive = isCorrect ? prevConsecutive + 1 : 0;

        const { nextScore, delta, streakBonusAwarded } = calculateSmartScore(
          smartScoreBefore,
          isCorrect,
          newConsecutive
        );

        const attemptsCount = (existingProgress?.attemptsCount || 0) + 1;
        const correctCount =
          (existingProgress?.correctCount || 0) + (isCorrect ? 1 : 0);
        const totalTimeSeconds =
          (existingProgress?.totalTimeSeconds || 0) + timeSpentSeconds;

        const needsRemediation = nextScore < 60 && attemptsCount >= 2;
        const easierSkill = skill.easierSkillId
          ? state.skills.find((s) => s.id === skill.easierSkillId)
          : undefined;

        const updatedProgressDoc: SkillProgressDoc = {
          id: `${state.student.id}_${skill.id}`,
          studentId: state.student.id,
          subjectId: skill.subjectId,
          unitId: skill.unitId,
          lessonId: skill.lessonId,
          skillId: skill.id,
          skillCode: skill.code,
          skillTitle: skill.title,
          teks: skill.teks,
          smartScore: nextScore,
          level: getSmartScoreLevel(nextScore),
          attemptsCount,
          correctCount,
          consecutiveCorrect: newConsecutive,
          totalTimeSeconds,
          needsRemediation,
          recommendedEasierSkillId: skill.easierSkillId,
          retestScheduledAt: needsRemediation
            ? new Date(Date.now() + 86400000 * 2).toISOString()
            : existingProgress?.retestScheduledAt,
          lastPracticedAt: new Date().toISOString(),
        };

        const newAttempt: AttemptDoc = {
          id: `att-${Date.now()}`,
          studentId: state.student.id,
          subjectId: skill.subjectId,
          unitId: skill.unitId,
          lessonId: skill.lessonId,
          skillId: skill.id,
          questionId: question.id,
          questionType: question.type,
          isCorrect,
          selectedAnswer,
          smartScoreBefore,
          smartScoreAfter: nextScore,
          timeSpentSeconds,
          usedHint,
          timestamp: new Date().toISOString(),
          dateKey: new Date().toISOString().slice(0, 10),
        };

        const xpGain = isCorrect ? (streakBonusAwarded ? 25 : 15) : 5;
        const starGain =
          isCorrect && nextScore >= 81 && smartScoreBefore < 81
            ? 3
            : isCorrect
              ? 1
              : 0;
        const coinGain = isCorrect ? (streakBonusAwarded ? 10 : 5) : 1;

        const nextProgressMap = {
          ...state.progress,
          [skillId]: updatedProgressDoc,
        };

        const earnedSet = new Set(state.student.earnedBadgeIds);
        const newlyEarnedBadges: BadgeDoc[] = [];

        const awardIfEligible = (badgeId: string, condition: boolean) => {
          if (condition && !earnedSet.has(badgeId)) {
            earnedSet.add(badgeId);
            const foundBadge = state.badges.find((b) => b.id === badgeId);
            if (foundBadge) newlyEarnedBadges.push(foundBadge);
          }
        };

        awardIfEligible(
          "badge-multiplication-master",
          (nextProgressMap["math-m1-s1"]?.smartScore || 0) >= 80 ||
            (nextProgressMap["math-m3-s1"]?.smartScore || 0) >= 80
        );
        awardIfEligible(
          "badge-fraction-expert",
          (nextProgressMap["math-m5-s1"]?.smartScore || 0) >= 80
        );
        awardIfEligible(
          "badge-reading-champion",
          Object.values(nextProgressMap).filter(
            (p) => p.subjectId === "subj-rla" && p.smartScore >= 80
          ).length >= 2
        );
        awardIfEligible(
          "badge-vocabulary-hero",
          Object.values(nextProgressMap).filter((p) => p.smartScore >= 75)
            .length >= 4
        );
        awardIfEligible(
          "badge-phonics-explorer",
          Object.values(nextProgressMap).filter(
            (p) => p.subjectId === "subj-fs" && p.smartScore >= 80
          ).length >= 2
        );
        awardIfEligible("badge-perfect-100", nextScore === 100);

        const badgeXpBonus = newlyEarnedBadges.reduce(
          (acc, b) => acc + b.xpReward,
          0
        );
        const badgeCoinBonus = newlyEarnedBadges.reduce(
          (acc, b) => acc + b.coinReward,
          0
        );

        const updatedStudent: StudentDoc = {
          ...state.student,
          xp: state.student.xp + xpGain + badgeXpBonus,
          stars: state.student.stars + starGain,
          coins: state.student.coins + coinGain + badgeCoinBonus,
          todayQuestionsAnswered: state.student.todayQuestionsAnswered + 1,
          todayMinutesSpent:
            state.student.todayMinutesSpent +
            Math.max(1, Math.round(timeSpentSeconds / 60)),
          earnedBadgeIds: Array.from(earnedSet),
        };

        const updatedStudentsList = state.studentsList.map((s) =>
          s.id === updatedStudent.id ? updatedStudent : s
        );

        const updatedAllProgress = {
          ...state.allStudentsProgress,
          [updatedStudent.id]: nextProgressMap,
        };

        set({
          progress: nextProgressMap,
          allStudentsProgress: updatedAllProgress,
          attempts: [newAttempt, ...state.attempts.slice(0, 199)],
          student: updatedStudent,
          studentsList: updatedStudentsList,
        });

        // Background non-blocking Firestore sync if configured
        if (isFirebaseConfigured && db) {
          setDoc(
            doc(db, FIRESTORE_COLLECTIONS.PROGRESS, updatedProgressDoc.id),
            updatedProgressDoc
          ).catch(() => {});
          setDoc(
            doc(db, FIRESTORE_COLLECTIONS.ATTEMPTS, newAttempt.id),
            newAttempt
          ).catch(() => {});
          setDoc(
            doc(db, FIRESTORE_COLLECTIONS.STUDENTS, updatedStudent.id),
            updatedStudent
          ).catch(() => {});
        }

        return {
          smartScoreBefore,
          smartScoreAfter: nextScore,
          delta,
          streakBonusAwarded,
          newlyEarnedBadges,
          needsRemediation,
          easierSkill,
        };
      },

      addFluencyPracticeXP: (wpm, accuracy) => {
        set((state) => {
          const earnedSet = new Set(state.student.earnedBadgeIds);
          if (wpm >= 90 && accuracy >= 95) {
            earnedSet.add("badge-phonics-explorer");
          }
          const updatedStudent: StudentDoc = {
            ...state.student,
            xp: state.student.xp + 30,
            stars: state.student.stars + 2,
            coins: state.student.coins + 15,
            todayMinutesSpent: state.student.todayMinutesSpent + 3,
            earnedBadgeIds: Array.from(earnedSet),
          };
          const updatedList = state.studentsList.map((s) =>
            s.id === updatedStudent.id ? updatedStudent : s
          );
          if (isFirebaseConfigured && db) {
            setDoc(
              doc(db, FIRESTORE_COLLECTIONS.STUDENTS, updatedStudent.id),
              updatedStudent
            ).catch(() => {});
          }
          return {
            student: updatedStudent,
            studentsList: updatedList,
          };
        });
      },

      addBrainGameReward: (xp, coins, stars = 1) => {
        set((state) => {
          if (!state.student.id) return {};
          const updatedStudent: StudentDoc = {
            ...state.student,
            xp: state.student.xp + xp,
            stars: state.student.stars + stars,
            coins: state.student.coins + coins,
            todayMinutesSpent: state.student.todayMinutesSpent + 3,
          };
          const updatedList = state.studentsList.map((s) =>
            s.id === updatedStudent.id ? updatedStudent : s
          );
          if (isFirebaseConfigured && db) {
            setDoc(
              doc(db, FIRESTORE_COLLECTIONS.STUDENTS, updatedStudent.id),
              updatedStudent
            ).catch(() => {});
          }
          return {
            student: updatedStudent,
            studentsList: updatedList,
          };
        });
      },

      addCustomPracticeQuestions: (newQuestions) =>
        set((state) => ({
          questions: [...state.questions, ...newQuestions],
        })),

      importCustomCurriculumData: (payload) =>
        set((state) => ({
          units: payload.units ? [...state.units, ...payload.units] : state.units,
          lessons: payload.lessons
            ? [...state.lessons, ...payload.lessons]
            : state.lessons,
          skills: payload.skills
            ? [...state.skills, ...payload.skills]
            : state.skills,
          questions: payload.questions
            ? [...state.questions, ...payload.questions]
            : state.questions,
        })),

      generateDeterministicParentReport: (period) => {
        const state = get();
        const progressValues = Object.values(state.progress);
        const overallMasteryAvg =
          progressValues.length > 0
            ? Math.round(
                progressValues.reduce((sum, p) => sum + p.smartScore, 0) /
                  progressValues.length
              )
            : 0;

        const totalQuestionsAnswered = progressValues.reduce(
          (sum, p) => sum + p.attemptsCount,
          0
        );
        const totalCorrect = progressValues.reduce(
          (sum, p) => sum + p.correctCount,
          0
        );
        const overallAccuracy =
          totalQuestionsAnswered > 0
            ? Math.round((totalCorrect / totalQuestionsAnswered) * 100)
            : 0;
        const totalMinutesSpent = Math.max(
          state.student.todayMinutesSpent,
          Math.round(
            progressValues.reduce((sum, p) => sum + p.totalTimeSeconds, 0) / 60
          )
        );

        const strongSkills = progressValues
          .filter((p) => p.smartScore >= 75)
          .sort((a, b) => b.smartScore - a.smartScore)
          .map((p) => ({
            skillCode: p.skillCode,
            title: p.skillTitle,
            score: p.smartScore,
          }));

        const weakSkills = progressValues
          .filter((p) => p.smartScore < 60)
          .sort((a, b) => a.smartScore - b.smartScore)
          .map((p) => {
            const easierSkill = state.skills.find(
              (s) => s.id === p.recommendedEasierSkillId
            );
            return {
              skillCode: p.skillCode,
              title: p.skillTitle,
              score: p.smartScore,
              recommendedAction: easierSkill
                ? `Practice prerequisite skill ${easierSkill.code} (${easierSkill.title}) and review its worked example.`
                : `Review the worked example and guided practice in Lesson ${p.lessonId.toUpperCase()}.`,
            };
          });

        const report: ParentReportDoc = {
          id: `rep-${Date.now()}`,
          studentId: state.student.id,
          parentId: state.parent.id,
          generatedAt: new Date().toISOString(),
          period,
          generatedBy: "deterministic_engine",
          overallMasteryAvg,
          totalQuestionsAnswered,
          overallAccuracy,
          totalMinutesSpent,
          strongSkills,
          weakSkills,
          summaryText: `${state.student.name} has maintained a ${state.student.streakDays}-day learning streak with an average SmartScore of ${overallMasteryAvg}/100 (${overallAccuracy}% accuracy across ${totalQuestionsAnswered} Bluebonnet TEKS questions).`,
          actionableTips: [
            weakSkills.length > 0
              ? `Focus 10 minutes on ${weakSkills[0].skillCode}: ${weakSkills[0].title} (current SmartScore ${weakSkills[0].score}). Use the Adaptive Remediation link to practice the prerequisite skill first.`
              : `All active skills are above the 60 SmartScore remediation threshold! Encourage ${state.student.name} to push Proficient skills (51–80) into Mastered (81–100).`,
            `Ask ${state.student.name} to read aloud today's Bluebonnet Reader passage in the Foundational Skills Lab to build 110+ WPM Grade 3 fluency.`,
            `Celebrate ${state.student.name}'s strong performance in ${strongSkills[0]?.title || "Multiplication & Equal Groups"}!`,
          ],
        };

        set({ reports: [report, ...state.reports] });
        return report;
      },

      syncAllToFirestore: async () => {
        if (!isFirebaseConfigured || !db) {
          return {
            synced: false,
            message:
              "Running in 100% Free Local/IndexedDB Cache Mode. Add Firebase keys to .env.local to enable live Cloud Firestore push.",
          };
        }
        try {
          const state = get();
          for (const stu of state.studentsList) {
            await setDoc(
              doc(db, FIRESTORE_COLLECTIONS.STUDENTS, stu.id),
              stu
            );
          }
          await setDoc(
            doc(db, FIRESTORE_COLLECTIONS.PARENTS, state.parent.id),
            state.parent
          );
          for (const progMap of Object.values(state.allStudentsProgress)) {
            for (const prog of Object.values(progMap)) {
              await setDoc(
                doc(db, FIRESTORE_COLLECTIONS.PROGRESS, prog.id),
                prog
              );
            }
          }
          return {
            synced: true,
            message: `Synced ${state.studentsList.length} child profile(s), Admin account, and all skill progress records to Cloud Firestore!`,
          };
        } catch (err) {
          return {
            synced: false,
            message: `Firestore sync error: ${err instanceof Error ? err.message : String(err)}`,
          };
        }
      },
    }),
    {
      name: "bluebonnet-grade3-learning-store-v3",
      version: 3,
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        loggedInAccountType: state.loggedInAccountType,
        studentsList: state.studentsList,
        allStudentsProgress: state.allStudentsProgress,
        activeRole: state.activeRole,
        selectedSubjectId: state.selectedSubjectId,
        selectedUnitId: state.selectedUnitId,
        selectedLessonId: state.selectedLessonId,
        selectedSkillId: state.selectedSkillId,
        enableAi: state.enableAi,
        student: state.student,
        parent: state.parent,
        progress: state.progress,
        attempts: state.attempts,
        reports: state.reports,
      }),
    }
  )
);
