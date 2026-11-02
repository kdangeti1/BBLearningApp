"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useLearningStore } from "@/store/useLearningStore";
import { Navbar } from "@/components/Navbar";
import { LoginScreen } from "@/components/LoginScreen";
import { ChildProfileManager } from "@/components/ChildProfileManager";
import { SkillPracticeEngine } from "@/components/SkillPracticeEngine";
import { FoundationalSkillsLab } from "@/components/FoundationalSkillsLab";
import { BrainGamesHub } from "@/components/BrainGamesHub";
import { ParentDashboard } from "@/components/ParentDashboard";
import { CurriculumImportEngine } from "@/components/CurriculumImportModal";
import { BLUEBONNET_36_WEEK_PACING } from "@/data/scope-and-sequence";
import { getSmartScoreColor, speakText } from "@/lib/utils";
import {
  BookOpen,
  CheckCircle2,
  Flame,
  Star,
  Coins,
  Trophy,
  ArrowRight,
  Volume2,
  GraduationCap,
  Calendar,
  Award,
  AlertTriangle,
  Layers,
  FileText,
  Compass,
  Headphones,
} from "lucide-react";

export default function HomePage() {
  const {
    isAuthenticated,
    activeTab,
    subjects,
    units,
    lessons,
    skills,
    questions,
    badges,
    student,
    progress,
    selectedSubjectId,
    selectedUnitId,
    selectedLessonId,
    setActiveTab,
    selectSubject,
    selectUnit,
    openLesson,
    startSkillPractice,
    loadProfilesFromFirestore,
  } = useLearningStore();

  const [mounted, setMounted] = useState(false);
  const [revealedGuidedCheck, setRevealedGuidedCheck] = useState(false);
  const [quarterFilter, setQuarterFilter] = useState<string>("All");
  const [readingSkillFilter, setReadingSkillFilter] = useState<string>("All");

  useEffect(() => {
    setMounted(true);
    loadProfilesFromFirestore();
  }, [loadProfilesFromFirestore]);

  // Sync Dark Mode class to document root
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (student.accessibility.darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [mounted, student.accessibility.darkMode]);

  const currentSubject = useMemo(
    () => subjects.find((s) => s.id === selectedSubjectId) || subjects[0],
    [subjects, selectedSubjectId]
  );

  const subjectUnits = useMemo(
    () => units.filter((u) => u.subjectId === currentSubject?.id),
    [units, currentSubject]
  );

  const currentUnit = useMemo(
    () => units.find((u) => u.id === selectedUnitId) || subjectUnits[0],
    [units, selectedUnitId, subjectUnits]
  );

  const currentLesson = useMemo(
    () =>
      lessons.find((l) => l.id === selectedLessonId) ||
      lessons.find((l) => l.unitId === currentUnit?.id) ||
      lessons[0],
    [lessons, selectedLessonId, currentUnit]
  );

  const remediationSkills = useMemo(
    () =>
      Object.values(progress).filter(
        (p) => p.smartScore < 60 && p.attemptsCount >= 2
      ),
    [progress]
  );

  const rlaUnits = useMemo(
    () => units.filter((u) => u.subjectId === "subj-rla"),
    [units]
  );

  const activeRlaUnit = useMemo(
    () =>
      rlaUnits.find((u) => u.id === selectedUnitId) || rlaUnits[0],
    [rlaUnits, selectedUnitId]
  );

  const activeRlaLesson = useMemo(
    () => lessons.find((l) => l.unitId === activeRlaUnit?.id),
    [lessons, activeRlaUnit]
  );

  const rlaQuestions = useMemo(() => {
    const allRla = questions.filter((q) => q.subjectId === "subj-rla");
    if (readingSkillFilter === "All") return allRla;
    return allRla.filter((q) => q.readingSubType === readingSkillFilter);
  }, [questions, readingSkillFilter]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl text-white shadow-lg">
            🌸
          </div>
          <p className="text-sm font-extrabold text-slate-700">
            Loading Bluebonnet Grade 3 Learning Platform...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const wrapperClasses = [
    student.accessibility.dyslexiaFont ? "dyslexia-font" : "",
    student.accessibility.largeButtons ? "large-buttons-mode" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const dailyGoalPct = Math.min(
    100,
    Math.round(
      (student.todayQuestionsAnswered / student.dailyGoalTargetQuestions) * 100
    )
  );

  return (
    <div className={`min-h-screen ${wrapperClasses}`}>
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* ============================================================
            TAB 1: STUDENT QUEST HOME DASHBOARD
           ============================================================ */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Hero Welcome & Daily Goal Card */}
            <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 p-6 text-white shadow-lg">
              <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold">
                    <span>{student.avatar} Welcome back, {student.name}!</span>
                    <span>•</span>
                    <span>Grade 3 Bluebonnet Scholar</span>
                  </div>
                  <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                    Ready for Today&apos;s Texas Bluebonnet Quest?
                  </h2>
                  <p className="mt-1.5 text-sm text-indigo-100">
                    Follow your personalized learning path: Subject → Unit → 7-Part Lesson → Skill Practice → Quiz → SmartScore Mastery!
                  </p>

                  {/* Interactive Learning Path Stepper */}
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setActiveTab("subjects")}
                      className="rounded-xl bg-white/15 px-3 py-2 text-xs font-extrabold text-white hover:bg-white/25"
                    >
                      1. Choose Subject & Unit
                    </button>
                    <ArrowRight className="h-4 w-4 text-indigo-200" />
                    <button
                      onClick={() => setActiveTab("lesson_viewer")}
                      className="rounded-xl bg-white/15 px-3 py-2 text-xs font-extrabold text-white hover:bg-white/25"
                    >
                      2. Study 7-Part Lesson
                    </button>
                    <ArrowRight className="h-4 w-4 text-indigo-200" />
                    <button
                      onClick={() => setActiveTab("skill_practice")}
                      className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-black text-slate-950 shadow-md hover:bg-amber-300"
                    >
                      3. Practice & Boost SmartScore →
                    </button>
                  </div>
                </div>

                {/* Daily Goal & Streak Meter */}
                <div className="rounded-2xl bg-white/15 p-5 backdrop-blur-md lg:col-span-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-100">
                      Daily Learning Goal
                    </span>
                    <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-black text-slate-950">
                      {student.todayQuestionsAnswered} /{" "}
                      {student.dailyGoalTargetQuestions} Questions
                    </span>
                  </div>

                  <div className="my-3 h-3.5 w-full overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${dailyGoalPct}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                    <div className="rounded-xl bg-white/10 p-2">
                      <Flame className="mx-auto h-4 w-4 text-amber-300" />
                      <div className="mt-1 font-black">{student.streakDays} Days</div>
                      <div className="text-[10px] text-indigo-100">Streak</div>
                    </div>
                    <div className="rounded-xl bg-white/10 p-2">
                      <Star className="mx-auto h-4 w-4 text-amber-300" />
                      <div className="mt-1 font-black">{student.stars} Stars</div>
                      <div className="text-[10px] text-indigo-100">Mastery</div>
                    </div>
                    <div className="rounded-xl bg-white/10 p-2">
                      <Coins className="mx-auto h-4 w-4 text-emerald-300" />
                      <div className="mt-1 font-black">{student.coins} Coins</div>
                      <div className="text-[10px] text-indigo-100">Treasure</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deterministic Adaptive Learning Recommendation (When Mastery < 60) */}
            {remediationSkills.length > 0 && (
              <div className="rounded-3xl border-2 border-amber-300 bg-amber-50/90 p-5 dark:border-amber-800 dark:bg-amber-950/30">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-amber-500 p-3 text-white">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="rounded-full bg-amber-200 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-950">
                        Adaptive Learning Quest Recommendation
                      </span>
                      <h3 className="mt-1 text-base font-extrabold text-slate-900 dark:text-white">
                        Boost {remediationSkills[0].skillCode}:{" "}
                        {remediationSkills[0].skillTitle} (Current SmartScore:{" "}
                        {remediationSkills[0].smartScore}/100)
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Because this skill is below 60, we unlocked a step-by-step Worked Example and a prerequisite warm-up skill for you!
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {remediationSkills[0].recommendedEasierSkillId && (
                      <button
                        onClick={() =>
                          startSkillPractice(
                            remediationSkills[0].recommendedEasierSkillId!
                          )
                        }
                        className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-amber-700"
                      >
                        Warm Up Prerequisite Skill
                      </button>
                    )}
                    <button
                      onClick={() =>
                        startSkillPractice(remediationSkills[0].skillId)
                      }
                      className="rounded-xl bg-white px-4 py-2 text-xs font-extrabold text-amber-900 shadow-sm hover:bg-amber-100 dark:bg-slate-800 dark:text-amber-200"
                    >
                      Practice {remediationSkills[0].skillCode} Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3 Core Bluebonnet Subject Worlds */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Explore the 3 Bluebonnet Grade 3 Learning Worlds
                </h3>
                <button
                  onClick={() => setActiveTab("pacing_calendar")}
                  className="flex items-center gap-1 text-xs font-extrabold text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>View 36-Week Pacing Calendar</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {subjects.map((subj) => {
                  const subjUnits = units.filter((u) => u.subjectId === subj.id);
                  const subjSkills = skills.filter((s) => s.subjectId === subj.id);
                  const masteredCount = subjSkills.filter(
                    (s) => (progress[s.id]?.smartScore || 0) >= 80
                  ).length;

                  const gradientClass =
                    subj.id === "subj-math"
                      ? "from-blue-600 to-indigo-700"
                      : subj.id === "subj-rla"
                        ? "from-purple-600 to-fuchsia-700"
                        : "from-emerald-600 to-teal-700";

                  return (
                    <div
                      key={subj.id}
                      className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className={`bg-gradient-to-r ${gradientClass} p-5 text-white`}>
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-extrabold">
                            {subjUnits.length} Units • {subjSkills.length} Skills
                          </span>
                          <span className="text-xs font-bold">
                            {masteredCount}/{subjSkills.length} Mastered
                          </span>
                        </div>
                        <h4 className="mt-3 text-xl font-black">{subj.title}</h4>
                        <p className="mt-1 line-clamp-2 text-xs text-white/90">
                          {subj.description}
                        </p>
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div className="space-y-2">
                          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                            Featured Units:
                          </div>
                          {subjUnits.slice(0, 3).map((u) => (
                            <button
                              key={u.id}
                              onClick={() => {
                                selectUnit(u.id);
                                setActiveTab("lesson_viewer");
                              }}
                              className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-200"
                            >
                              <span className="truncate">
                                <strong>{u.code}:</strong> {u.title}
                              </span>
                              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                            </button>
                          ))}
                        </div>

                        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                          <button
                            onClick={() => {
                              selectSubject(subj.id);
                              setActiveTab("subjects");
                            }}
                            className="flex-1 rounded-xl bg-indigo-600 py-2 text-xs font-extrabold text-white hover:bg-indigo-700"
                          >
                            Browse All {subjUnits.length} Units
                          </button>
                          {subj.id === "subj-rla" && (
                            <button
                              onClick={() => setActiveTab("reading_studio")}
                              className="rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-xs font-extrabold text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300"
                            >
                              Reading Studio
                            </button>
                          )}
                          {subj.id === "subj-fs" && (
                            <button
                              onClick={() => setActiveTab("foundational_lab")}
                              className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-extrabold text-teal-700 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-300"
                            >
                              Phonics Lab
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Relaxation & Brain Break Banner */}
            <div className="overflow-hidden rounded-3xl border-2 border-indigo-200 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 p-6 text-white shadow-md dark:border-indigo-800">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="max-w-xl">
                  <span className="rounded-full bg-white/20 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider">
                    Relaxation & Critical Thinking
                  </span>
                  <h3 className="mt-2 text-xl font-black">
                    Need a Brain Break? Play KenKen Math Puzzles & Word Ladders! 🧩
                  </h3>
                  <p className="mt-1 text-xs text-indigo-100">
                    Relax with fun 3×3 & 4×4 KenKen cages, word morphing, and pattern mysteries. Test your logic, earn bonus XP & Treasure Coins!
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("brain_games")}
                  className="rounded-2xl bg-amber-400 px-5 py-3 text-xs font-black text-slate-950 shadow-md transition hover:bg-amber-300 active:scale-95"
                >
                  Play Brain Games Now 🎮
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 2: SUBJECTS & 27 BLUEBONNET UNITS BROWSER
           ============================================================ */}
        {activeTab === "subjects" && (
          <div className="space-y-6">
            {/* Subject Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap gap-2">
                {subjects.map((subj) => (
                  <button
                    key={subj.id}
                    onClick={() => selectSubject(subj.id)}
                    className={`rounded-2xl px-4 py-2.5 text-xs font-extrabold transition ${
                      selectedSubjectId === subj.id
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {subj.title} ({subj.totalUnits} Units)
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-500">
                Source Folder: <code>downloads/{currentSubject.sourcePdfFolder}</code>
              </span>
            </div>

            {/* Units Grid for Selected Subject */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {subjectUnits.map((unit) => {
                const unitLesson = lessons.find((l) => l.unitId === unit.id);
                const unitSkills = skills.filter((s) => s.unitId === unit.id);

                return (
                  <div
                    key={unit.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-extrabold text-white">
                          {unit.code} • {unit.nineWeeks}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {unit.weekRange} ({unit.instructionalDays} Days)
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-extrabold text-slate-900 dark:text-white">
                        {unit.title}
                      </h3>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {unit.subtitle}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        {unit.overview}
                      </p>

                      {/* TEKS Badges */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {unit.teksStandards.map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            TEKS {t}
                          </span>
                        ))}
                      </div>

                      {/* Skills inside this Unit */}
                      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                          IXL-Style Skills in {unit.code}:
                        </div>
                        {unitSkills.map((sk) => {
                          const score = progress[sk.id]?.smartScore || 0;
                          return (
                            <div
                              key={sk.id}
                              className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs dark:bg-slate-800/70"
                            >
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                <strong>{sk.code}:</strong> {sk.title}
                              </span>
                              <button
                                onClick={() => startSkillPractice(sk.id)}
                                className={`rounded-lg border px-2.5 py-1 text-[11px] font-extrabold ${getSmartScoreColor(
                                  score
                                )}`}
                              >
                                Practice ({score}/100)
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Unit Footer Actions */}
                    <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                      {unitLesson && (
                        <button
                          onClick={() => openLesson(unitLesson.id)}
                          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-indigo-700"
                        >
                          <GraduationCap className="h-4 w-4" />
                          <span>Open 7-Part Lesson</span>
                        </button>
                      )}
                      {unitSkills[0] && (
                        <button
                          onClick={() => startSkillPractice(unitSkills[0].id)}
                          className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-extrabold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Start Skill Quiz</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 3: 36-WEEK BLUEBONNET PACING CALENDAR (from 3rd_Grade_Curriculum.xlsx)
           ============================================================ */}
        {activeTab === "pacing_calendar" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-extrabold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Authoritative 2026–27 Scope & Sequence
                </span>
                <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                  36-Week Grade 3 Bluebonnet Curriculum Pacing Calendar
                </h2>
                <p className="text-xs text-slate-500">
                  Directly mapped from <code>3rd_Grade_Curriculum.xlsx</code>. Click any unit cell to launch its 7-Part Lesson or SmartScore Practice.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  "All",
                  "1st Nine Weeks",
                  "2nd Nine Weeks",
                  "3rd Nine Weeks",
                  "4th Nine Weeks",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuarterFilter(q)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition ${
                      quarterFilter === q
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-extrabold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <tr>
                      <th className="p-3.5">Grading Period</th>
                      <th className="p-3.5">Week</th>
                      <th className="p-3.5">Dates</th>
                      <th className="p-3.5">Reading Language Arts (Units 1–10)</th>
                      <th className="p-3.5">Foundational Skills (Units 1–10)</th>
                      <th className="p-3.5">Mathematics (Modules 1–7)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {BLUEBONNET_36_WEEK_PACING.filter(
                      (r) => quarterFilter === "All" || r.quarter === quarterFilter
                    ).map((row) => (
                      <tr
                        key={row.week}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                      >
                        <td className="p-3.5 font-bold text-indigo-600 dark:text-indigo-400">
                          {row.quarter}
                        </td>
                        <td className="p-3.5 font-black">Week {row.week}</td>
                        <td className="p-3.5 text-slate-500">{row.dateRange}</td>
                        <td className="p-3.5">
                          <button
                            onClick={() => {
                              selectUnit(row.rlaUnitId);
                              setActiveTab("lesson_viewer");
                            }}
                            className="text-left font-bold text-purple-700 hover:underline dark:text-purple-300"
                          >
                            {row.rlaText}
                          </button>
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => {
                              selectUnit(row.foundationalUnitId);
                              setActiveTab("foundational_lab");
                            }}
                            className="text-left font-bold text-teal-700 hover:underline dark:text-teal-300"
                          >
                            {row.foundationalText}
                          </button>
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => {
                              selectUnit(row.mathUnitId);
                              setActiveTab("lesson_viewer");
                            }}
                            className="text-left font-bold text-blue-700 hover:underline dark:text-blue-300"
                          >
                            {row.mathText}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 4: 7-PART LESSON VIEWER
           ============================================================ */}
        {activeTab === "lesson_viewer" && currentLesson && (
          <div className="space-y-6">
            {/* Lesson Switcher Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-extrabold text-white">
                    {currentLesson.topicCode || "Lesson"}
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    TEKS {currentLesson.teks.join(", ")}
                  </span>
                  <span className="text-xs text-slate-400">
                    Source PDF: {currentLesson.sourcePdf}
                  </span>
                </div>
                <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                  {currentLesson.title}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={currentLesson.id}
                  onChange={(e) => openLesson(e.target.value)}
                  aria-label="Select Bluebonnet Lesson"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  {lessons.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() =>
                    startSkillPractice(
                      currentLesson.skillIds[0] || "math-m1-s1"
                    )
                  }
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-emerald-700"
                >
                  <span>Practice Lesson Skill</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 7 Required Lesson Content Sections */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              <div className="space-y-5 lg:col-span-8">
                {/* Section 1 & 2: Introduction & Learning Objective */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-extrabold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      1. Introduction & 2. Learning Objective
                    </span>
                    <button
                      onClick={() =>
                        speakText(
                          `${currentLesson.sections.introduction} Learning Objective: ${currentLesson.sections.learningObjective}`
                        )
                      }
                      className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      <Volume2 className="h-4 w-4" /> Read Aloud
                    </button>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                    {currentLesson.sections.introduction}
                  </p>
                  <div className="mt-4 rounded-2xl border-l-4 border-indigo-600 bg-indigo-50/70 p-4 text-xs font-bold text-indigo-950 dark:bg-indigo-950/40 dark:text-indigo-200">
                    🎯 <strong>Learning Objective:</strong>{" "}
                    {currentLesson.sections.learningObjective}
                  </div>
                </div>

                {/* Section 3: Worked Examples */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    3. Step-by-Step Worked Examples
                  </span>
                  {currentLesson.sections.examples.map((ex) => (
                    <div key={ex.id} className="mt-4 space-y-3">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {ex.title}
                      </h3>
                      <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                        Problem: {ex.problem}
                      </div>
                      <ol className="list-inside list-decimal space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {ex.steps.map((step, i) => (
                          <li
                            key={i}
                            className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40"
                          >
                            {step}
                          </li>
                        ))}
                      </ol>
                      <div className="rounded-2xl bg-emerald-50 p-3.5 text-xs font-extrabold text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">
                        ✅ Solution: {ex.solution}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Section 4: Guided Practice */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    4. Guided Practice
                  </span>
                  {currentLesson.sections.guidedPractice.map((gp, idx) => (
                    <div key={idx} className="mt-3 space-y-3">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {gp.prompt}
                      </p>
                      <ul className="list-inside list-disc space-y-1 text-xs text-slate-600 dark:text-slate-300">
                        {gp.scaffoldSteps.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
                        <p className="text-xs font-extrabold text-amber-950 dark:text-amber-200">
                          Check Understanding: {gp.checkQuestion}
                        </p>
                        <button
                          onClick={() =>
                            setRevealedGuidedCheck(!revealedGuidedCheck)
                          }
                          className="mt-2 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white"
                        >
                          {revealedGuidedCheck
                            ? "Hide Guided Check Answer"
                            : "Reveal Guided Check Answer"}
                        </button>
                        {revealedGuidedCheck && (
                          <p className="mt-2 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                            ✅ {gp.checkAnswer}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Section 5, 6, 7: Independent Practice, Assessment & Summary */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="space-y-4">
                    <div>
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-extrabold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                        5. Independent Practice Tasks
                      </span>
                      <ul className="mt-2 list-inside list-disc space-y-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                        {currentLesson.sections.independentPractice.map(
                          (item, i) => (
                            <li key={i}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-extrabold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                        6. Lesson Assessment Check
                      </span>
                      <p className="mt-2 text-xs text-slate-700 dark:text-slate-300">
                        {currentLesson.sections.assessment}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-extrabold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                        7. Lesson Summary
                      </span>
                      <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {currentLesson.sections.summary}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar: Academic Vocabulary Builder & Reader Passage Preview */}
              <div className="space-y-5 lg:col-span-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    📚 Bluebonnet Vocabulary Builder
                  </h3>
                  <p className="text-xs text-slate-500">
                    Click any term to hear its pronunciation and definition
                  </p>
                  <div className="mt-3 space-y-2.5">
                    {currentLesson.vocabulary.map((v) => (
                      <div
                        key={v.term}
                        onClick={() =>
                          speakText(`${v.term}. ${v.definition}. Example: ${v.exampleSentence}`)
                        }
                        className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-3.5 transition hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-800/60"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-indigo-700 dark:text-indigo-300">
                            {v.term}
                          </span>
                          <Volume2 className="h-3.5 w-3.5 text-slate-400" />
                        </div>
                        <p className="mt-1 text-xs text-slate-700 dark:text-slate-200">
                          {v.definition}
                        </p>
                        <p className="mt-1 text-[11px] italic text-slate-500">
                          &ldquo;{v.exampleSentence}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {currentLesson.readingPassage && (
                  <div className="rounded-3xl border border-purple-200 bg-purple-50/60 p-5 dark:border-purple-900/50 dark:bg-purple-950/30">
                    <span className="rounded-full bg-purple-200 px-2.5 py-0.5 text-[11px] font-extrabold text-purple-900">
                      Reader Passage Included
                    </span>
                    <h4 className="mt-2 text-sm font-extrabold text-slate-900 dark:text-white">
                      {currentLesson.readingPassage.title}
                    </h4>
                    <p className="mt-1 line-clamp-3 text-xs text-slate-600 dark:text-slate-300">
                      {currentLesson.readingPassage.paragraphs[0]}
                    </p>
                    <button
                      onClick={() => setActiveTab("reading_studio")}
                      className="mt-3 w-full rounded-xl bg-purple-600 py-2 text-xs font-extrabold text-white hover:bg-purple-700"
                    >
                      Open in Reading Studio
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 5: IXL-STYLE SKILL PRACTICE ENGINE
           ============================================================ */}
        {activeTab === "skill_practice" && <SkillPracticeEngine />}

        {/* ============================================================
            TAB 6: READING LANGUAGE ARTS STUDIO (Passages, Vocabulary, Story Questions)
           ============================================================ */}
        {activeTab === "reading_studio" && activeRlaUnit && activeRlaLesson && (
          <div className="space-y-6">
            {/* Top RLA Reader Selector */}
            <div className="rounded-3xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 p-6 text-white shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-extrabold">
                    Reading Language Arts • {activeRlaUnit.code}
                  </span>
                  <h2 className="mt-2 text-2xl font-black">
                    {activeRlaUnit.title}
                  </h2>
                  <p className="text-sm text-purple-100">
                    Reader: {activeRlaUnit.readerTitle} • {activeRlaUnit.weekRange}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={activeRlaUnit.id}
                    onChange={(e) => selectUnit(e.target.value)}
                    aria-label="Select Reading Language Arts Unit"
                    className="rounded-xl bg-white px-3.5 py-2 text-xs font-extrabold text-slate-900"
                  >
                    {rlaUnits.map((u) => (
                      <option key={u.id} value={u.id}>
                        Unit {u.unitNumber}: {u.title}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() =>
                      startSkillPractice(
                        activeRlaLesson.skillIds[0] || "rla-u1-s1"
                      )
                    }
                    className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-black text-slate-950 hover:bg-amber-300"
                  >
                    Launch Reading Quiz →
                  </button>
                </div>
              </div>
            </div>

            {/* Reader Passage + Vocabulary Builder */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-8">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                  <div>
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-extrabold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      {activeRlaLesson.readingPassage?.genre} •{" "}
                      {activeRlaLesson.readingPassage?.lexileOrGrade}
                    </span>
                    <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                      {activeRlaLesson.readingPassage?.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Source: {activeRlaLesson.readingPassage?.authorOrSource}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      speakText(
                        activeRlaLesson.readingPassage?.paragraphs.join(" ") ||
                          ""
                      )
                    }
                    className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-purple-700"
                  >
                    <Volume2 className="h-4 w-4" />
                    <span>Read Passage Aloud</span>
                  </button>
                </div>

                <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-800 dark:text-slate-200">
                  {activeRlaLesson.readingPassage?.paragraphs.map((para, i) => (
                    <p
                      key={i}
                      className="rounded-2xl bg-slate-50/80 p-4 dark:bg-slate-800/50"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Right Column: Unit Vocabulary Builder */}
              <div className="space-y-4 lg:col-span-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    📖 Unit Vocabulary Builder
                  </h3>
                  <div className="mt-3 space-y-2.5">
                    {activeRlaUnit.vocabulary.map((voc) => (
                      <div
                        key={voc.term}
                        onClick={() =>
                          speakText(`${voc.term}: ${voc.definition}`)
                        }
                        className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-3.5 hover:border-purple-400 dark:border-slate-800 dark:bg-slate-800"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-purple-700 dark:text-purple-300">
                            {voc.term}{" "}
                            {voc.partOfSpeech ? `(${voc.partOfSpeech})` : ""}
                          </span>
                          <Volume2 className="h-3.5 w-3.5 text-slate-400" />
                        </div>
                        <p className="mt-1 text-xs text-slate-700 dark:text-slate-200">
                          {voc.definition}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reading Comprehension & Story Questions Filter across all 6 Reading Domains */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Comprehension & Story Questions by TEKS Reading Skill
                  </h3>
                  <p className="text-xs text-slate-500">
                    Filter across Main Idea, Theme, Inference, Context Clues, Author Purpose, and Sequencing
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    "All",
                    "Main Idea",
                    "Theme",
                    "Inference",
                    "Context Clues",
                    "Author Purpose",
                    "Sequencing",
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setReadingSkillFilter(cat)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition ${
                        readingSkillFilter === cat
                          ? "bg-purple-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                {rlaQuestions.map((rq) => (
                  <div
                    key={rq.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[11px] font-extrabold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                          {rq.readingSubType || "Reading Skill"} • TEKS {rq.teks}
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-100">
                        {rq.prompt}
                      </p>
                    </div>
                    <button
                      onClick={() => startSkillPractice(rq.skillId)}
                      className="mt-3 self-start rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-extrabold text-white hover:bg-purple-700"
                    >
                      Answer in SmartScore Practice →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 7: FOUNDATIONAL SKILLS LAB
           ============================================================ */}
        {activeTab === "foundational_lab" && <FoundationalSkillsLab />}

        {/* ============================================================
            TAB 8: BADGES TROPHY ROOM
           ============================================================ */}
        {activeTab === "badges" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 p-6 text-white shadow-md">
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-extrabold">
                Student Gamification & Rewards
              </span>
              <h2 className="mt-2 text-2xl font-black">
                {student.name}&apos;s Bluebonnet Trophy Room
              </h2>
              <p className="text-sm text-amber-50">
                Earned {student.earnedBadgeIds.length} of {badges.length} Grade 3 Badges • {student.xp.toLocaleString()} Total XP • {student.coins} Treasure Coins
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {badges.map((badge) => {
                const isEarned = student.earnedBadgeIds.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`flex flex-col justify-between rounded-3xl border-2 p-5 transition ${
                      isEarned
                        ? "border-amber-300 bg-white shadow-sm dark:border-amber-700 dark:bg-slate-900"
                        : "border-slate-200 bg-slate-50/70 opacity-75 dark:border-slate-800 dark:bg-slate-900/50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl dark:bg-amber-950">
                          {isEarned ? "🏆" : "🔒"}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
                            isEarned
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {isEarned ? "Unlocked!" : "In Progress"}
                        </span>
                      </div>
                      <h3 className="mt-3 text-base font-extrabold text-slate-900 dark:text-white">
                        {badge.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                        {badge.description}
                      </p>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-3 text-[11px] font-bold text-slate-500 dark:border-slate-800">
                      <div>Goal: {badge.criteriaText}</div>
                      <div className="mt-1 text-indigo-600 dark:text-indigo-400">
                        Reward: +{badge.xpReward} XP & +{badge.coinReward} Coins
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 8.5: BRAIN GAMES & KENKEN PUZZLES
           ============================================================ */}
        {activeTab === "brain_games" && <BrainGamesHub />}

        {/* ============================================================
            TAB 9: PARENT DASHBOARD & RECHARTS ANALYTICS
           ============================================================ */}
        {activeTab === "parent_dashboard" && <ParentDashboard />}

        {/* ============================================================
            TAB 10: CURRICULUM IMPORT ENGINE & 11 FIRESTORE COLLECTIONS
           ============================================================ */}
        {activeTab === "curriculum_import" && <CurriculumImportEngine />}

        {/* ============================================================
            TAB 11: ADMIN CHILD PROFILE & PASSWORD MANAGER
           ============================================================ */}
        {activeTab === "manage_children" && <ChildProfileManager />}
      </main>
    </div>
  );
}

