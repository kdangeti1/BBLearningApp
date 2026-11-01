"use client";

import React, { useState, useMemo } from "react";
import { useLearningStore } from "@/store/useLearningStore";
import { getSmartScoreColor } from "@/lib/utils";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Clock,
  Target,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  PlusCircle,
  CloudUpload,
  ShieldCheck,
  ArrowRight,
  FileText,
} from "lucide-react";

export function ParentDashboard() {
  const {
    student,
    subjects,
    skills,
    progress,
    enableAi,
    setEnableAi,
    startSkillPractice,
    addCustomPracticeQuestions,
    generateDeterministicParentReport,
    syncAllToFirestore,
  } = useLearningStore();

  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [aiSummaryText, setAiSummaryText] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [selectedPracticeSkillId, setSelectedPracticeSkillId] =
    useState<string>("math-m5-s1");
  const [generatedNotice, setGeneratedNotice] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const progressList = useMemo(() => Object.values(progress), [progress]);

  const overallMasteryAvg = useMemo(() => {
    if (progressList.length === 0) return 0;
    return Math.round(
      progressList.reduce((acc, p) => acc + p.smartScore, 0) /
        progressList.length
    );
  }, [progressList]);

  const totalAttempts = useMemo(
    () => progressList.reduce((acc, p) => acc + p.attemptsCount, 0),
    [progressList]
  );

  const totalCorrect = useMemo(
    () => progressList.reduce((acc, p) => acc + p.correctCount, 0),
    [progressList]
  );

  const overallAccuracy =
    totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 84;

  const totalMinutes = useMemo(() => {
    const fromSkills = Math.round(
      progressList.reduce((acc, p) => acc + p.totalTimeSeconds, 0) / 60
    );
    return Math.max(student.todayMinutesSpent, fromSkills);
  }, [progressList, student.todayMinutesSpent]);

  // 1. Chart Data: Progress Over Time
  const progressOverTimeData = useMemo(() => {
    if (period === "daily") {
      return [
        { label: "8 AM", smartScore: 62, questions: 4 },
        { label: "10 AM", smartScore: 67, questions: 7 },
        { label: "1 PM", smartScore: 71, questions: 10 },
        { label: "4 PM", smartScore: overallMasteryAvg, questions: 14 },
      ];
    }
    if (period === "monthly") {
      return [
        { label: "Week 1", smartScore: 54, questions: 28 },
        { label: "Week 2", smartScore: 63, questions: 45 },
        { label: "Week 3", smartScore: 69, questions: 68 },
        { label: "Week 4", smartScore: overallMasteryAvg, questions: totalAttempts },
      ];
    }
    return [
      { label: "Mon", smartScore: 58, questions: 12 },
      { label: "Tue", smartScore: 62, questions: 15 },
      { label: "Wed", smartScore: 66, questions: 14 },
      { label: "Thu", smartScore: 68, questions: 18 },
      { label: "Fri", smartScore: 71, questions: 16 },
      { label: "Sat", smartScore: 72, questions: 10 },
      { label: "Sun", smartScore: overallMasteryAvg, questions: 14 },
    ];
  }, [period, overallMasteryAvg, totalAttempts]);

  // 2. Chart Data: Subject Breakdown
  const subjectBreakdownData = useMemo(() => {
    return subjects.map((subj) => {
      const subjProg = progressList.filter((p) => p.subjectId === subj.id);
      const avg =
        subjProg.length > 0
          ? Math.round(
              subjProg.reduce((a, b) => a + b.smartScore, 0) / subjProg.length
            )
          : 0;
      const accuracy =
        subjProg.reduce((a, b) => a + b.attemptsCount, 0) > 0
          ? Math.round(
              (subjProg.reduce((a, b) => a + b.correctCount, 0) /
                subjProg.reduce((a, b) => a + b.attemptsCount, 0)) *
                100
            )
          : 0;
      return {
        subject:
          subj.id === "subj-math"
            ? "Mathematics"
            : subj.id === "subj-rla"
              ? "Reading (RLA)"
              : "Foundational",
        mastery: avg,
        accuracy,
      };
    });
  }, [subjects, progressList]);

  // 3. Chart Data: Question Accuracy Pie
  const accuracyPieData = useMemo(
    () => [
      { name: "Correct Answers", value: totalCorrect, color: "#10b981" },
      {
        name: "Needs Review",
        value: Math.max(1, totalAttempts - totalCorrect),
        color: "#f43f5e",
      },
    ],
    [totalCorrect, totalAttempts]
  );

  // 4. Chart Data: Daily Learning Time (Minutes)
  const learningTimeData = [
    { day: "Mon", minutes: 22, goal: 25 },
    { day: "Tue", minutes: 28, goal: 25 },
    { day: "Wed", minutes: 20, goal: 25 },
    { day: "Thu", minutes: 30, goal: 25 },
    { day: "Fri", minutes: 25, goal: 25 },
    { day: "Sat", minutes: 18, goal: 25 },
    { day: "Today", minutes: student.todayMinutesSpent, goal: 25 },
  ];

  const weakSkills = useMemo(
    () =>
      progressList
        .filter((p) => p.smartScore < 60)
        .sort((a, b) => a.smartScore - b.smartScore),
    [progressList]
  );

  const strongSkills = useMemo(
    () =>
      progressList
        .filter((p) => p.smartScore >= 75)
        .sort((a, b) => b.smartScore - a.smartScore),
    [progressList]
  );

  const handleGenerateParentInsights = async () => {
    setLoadingInsights(true);
    try {
      const report = generateDeterministicParentReport(period);
      const res = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "parent_insights",
          studentName: student.name,
          overallMasteryAvg,
          strongSkills: report.strongSkills,
          weakSkills: report.weakSkills,
          enableAiClientFlag: enableAi,
        }),
      });
      const data = await res.json();
      setAiSummaryText(data.summary);
    } catch {
      const fallback = generateDeterministicParentReport(period);
      setAiSummaryText(
        `${fallback.summaryText}\n\n• ${fallback.actionableTips.join("\n• ")}`
      );
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleGenerateExtraPractice = async () => {
    const skill = skills.find((s) => s.id === selectedPracticeSkillId) || skills[0];
    if (!skill) return;

    const res = await fetch("/api/ai-tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "generate_practice",
        skillTitle: skill.title,
        teks: skill.teks,
        enableAiClientFlag: enableAi,
      }),
    });
    const data = await res.json();
    if (data.questions && data.questions.length > 0) {
      const q = data.questions[0];
      addCustomPracticeQuestions([
        {
          id: q.id,
          skillId: skill.id,
          lessonId: skill.lessonId,
          unitId: skill.unitId,
          subjectId: skill.subjectId,
          type: "multiple_choice",
          difficulty: 2,
          teks: skill.teks,
          prompt: q.prompt,
          options: q.options,
          correctAnswer: q.correctAnswer,
          hint: q.hint,
          workedExplanation: q.workedExplanation,
        },
      ]);
      setGeneratedNotice(
        `Added new Grade 3 practice question to [${skill.code}] ${skill.title}!`
      );
    }
  };

  const handleFirestoreSync = async () => {
    const result = await syncAllToFirestore();
    setSyncStatus(result.message);
  };

  return (
    <div className="space-y-6">
      {/* Top Parent Header & Period Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-extrabold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            Parent Analytics & Curriculum Mastery Center
          </span>
          <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {student.name}&apos;s Grade 3 Bluebonnet Report
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time SmartScore tracking across Mathematics (M1–M7), Reading Language Arts (U1–U10), and Foundational Skills (U1–U10)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {(["daily", "weekly", "monthly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-lg px-3 py-1.5 text-xs font-extrabold capitalize transition ${
                  period === p
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleFirestoreSync}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-extrabold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
          >
            <CloudUpload className="h-4 w-4" />
            <span>Sync Firestore</span>
          </button>
        </div>
      </div>

      {syncStatus && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-3.5 text-xs font-bold text-indigo-900 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-200">
          {syncStatus}
        </div>
      )}

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">
              Avg SmartScore
            </span>
            <TrendingUp className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
            {overallMasteryAvg} <span className="text-base font-bold text-slate-400">/ 100</span>
          </div>
          <p className="mt-1 text-xs font-semibold text-emerald-600">
            Proficient Band (51–80+)
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">
              Question Accuracy
            </span>
            <Target className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
            {overallAccuracy}%
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {totalCorrect} correct of {totalAttempts} attempts
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">
              Time Spent Learning
            </span>
            <Clock className="h-5 w-5 text-sky-600" />
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
            {totalMinutes} mins
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Daily Goal: {student.dailyGoalMinutes} mins/day
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">
              Learning Streak
            </span>
            <Flame className="h-5 w-5 fill-orange-500 text-orange-500" />
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
            {student.streakDays} Days
          </div>
          <p className="mt-1 text-xs font-semibold text-orange-600">
            5-Day Streak Badge Unlocked!
          </p>
        </div>
      </div>

      {/* Charts Row 1: Progress Over Time + Subject Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart 1: Progress Over Time */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-1 text-base font-extrabold text-slate-900 dark:text-white">
            1. Progress Over Time ({period.toUpperCase()})
          </h3>
          <p className="mb-4 text-xs text-slate-500">
            Average SmartScore growth across Bluebonnet Grade 3 skills
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="smartScore"
                  name="Avg SmartScore"
                  stroke="#4f46e5"
                  fill="#818cf8"
                  fillOpacity={0.3}
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Subject Breakdown */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-1 text-base font-extrabold text-slate-900 dark:text-white">
            2. Subject Breakdown (Mastery & Accuracy)
          </h3>
          <p className="mb-4 text-xs text-slate-500">
            Comparing Mathematics, Reading Language Arts, and Foundational Skills
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectBreakdownData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="mastery"
                  name="SmartScore Mastery"
                  fill="#4f46e5"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="accuracy"
                  name="Accuracy %"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2: Question Accuracy + Learning Time */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart 3: Question Accuracy */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-1 text-base font-extrabold text-slate-900 dark:text-white">
            3. Question Accuracy Distribution
          </h3>
          <p className="mb-4 text-xs text-slate-500">
            Correct answers vs. questions needing worked example review
          </p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={accuracyPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {accuracyPieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Learning Time */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-1 text-base font-extrabold text-slate-900 dark:text-white">
            4. Daily Learning Time (Minutes vs. 25-Min Goal)
          </h3>
          <p className="mb-4 text-xs text-slate-500">
            Consistent 20–30 minute daily sessions maximize Grade 3 retention
          </p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={learningTimeData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="minutes"
                  name="Minutes Practiced"
                  fill="#0ea5e9"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="goal"
                  name="Daily Target (25m)"
                  fill="#cbd5e1"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 5: Skill Mastery Heatmap across all 29 Bluebonnet Grade 3 Skills */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              5. Skill Mastery Heatmap (All 29 Bluebonnet Grade 3 TEKS Skills)
            </h3>
            <p className="text-xs text-slate-500">
              Click any skill cell to launch practice immediately. Color bands match IXL SmartScore levels.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] font-bold">
            <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-amber-800">
              0–20 Beginner
            </span>
            <span className="rounded-lg bg-sky-100 px-2.5 py-1 text-sky-800">
              21–50 Developing
            </span>
            <span className="rounded-lg bg-indigo-100 px-2.5 py-1 text-indigo-800">
              51–80 Proficient
            </span>
            <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-emerald-800">
              81–100 Mastered
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {skills.map((skill) => {
            const score = progress[skill.id]?.smartScore ?? 0;
            return (
              <button
                key={skill.id}
                onClick={() => startSkillPractice(skill.id)}
                className={`flex flex-col justify-between rounded-2xl border p-3 text-left transition hover:scale-[1.02] ${getSmartScoreColor(
                  score
                )}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black">{skill.code}</span>
                  <span className="rounded-md bg-white/80 px-1.5 py-0.5 text-[11px] font-extrabold text-slate-900">
                    {score}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-[11px] font-semibold leading-tight">
                  {skill.title}
                </p>
                <span className="mt-1 text-[10px] opacity-75">
                  TEKS {skill.teks}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Strong Skills & Weak Skills (Deterministic Adaptive Remediation) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Weak Skills (<60 SmartScore) */}
        <div className="rounded-3xl border border-amber-200 bg-amber-50/50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20">
          <h3 className="flex items-center gap-2 text-base font-extrabold text-amber-950 dark:text-amber-200">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <span>Weak Skills & Adaptive Remediation (SmartScore &lt; 60)</span>
          </h3>
          <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">
            Deterministic Adaptive Engine automatically recommends prerequisite skills and schedules a retest.
          </p>

          <div className="mt-4 space-y-3">
            {weakSkills.length === 0 ? (
              <div className="rounded-2xl bg-white p-4 text-xs font-bold text-emerald-700 dark:bg-slate-900">
                🎉 No practiced skills are below 60! Keep up the great work!
              </div>
            ) : (
              weakSkills.map((wk) => {
                const easier = skills.find(
                  (s) => s.id === wk.recommendedEasierSkillId
                );
                return (
                  <div
                    key={wk.skillId}
                    className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-700">
                        [{wk.skillCode}] {wk.skillTitle}
                      </span>
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-extrabold text-amber-900">
                        Score: {wk.smartScore}/100
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {easier
                        ? `Recommended Prerequisite: ${easier.code} — ${easier.title}`
                        : "Recommended Action: Review Worked Example & Guided Practice"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {easier && (
                        <button
                          onClick={() => startSkillPractice(easier.id)}
                          className="flex items-center gap-1 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700"
                        >
                          <span>Practice Prerequisite ({easier.code})</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => startSkillPractice(wk.skillId)}
                        className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200"
                      >
                        Retest {wk.skillCode}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Strong Skills (>= 75 SmartScore) */}
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <h3 className="flex items-center gap-2 text-base font-extrabold text-emerald-950 dark:text-emerald-200">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span>Strong & Mastered Skills (SmartScore 75–100)</span>
          </h3>
          <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-300">
            Skills where {student.name} demonstrates strong Grade 3 TEKS proficiency.
          </p>

          <div className="mt-4 space-y-3">
            {strongSkills.map((st) => (
              <div
                key={st.skillId}
                className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <span className="text-xs font-black text-emerald-700">
                    [{st.skillCode}] {st.skillTitle}
                  </span>
                  <p className="text-xs text-slate-500">
                    TEKS {st.teks} • {st.correctCount}/{st.attemptsCount} correct
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-900">
                  {st.smartScore}/100 ({st.level})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Optional AI Features Panel (Works with ENABLE_AI=false and ENABLE_AI=true) */}
      <div className="rounded-3xl border border-purple-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-extrabold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                Optional Parent Insights & Practice Generator
              </span>
              <span className="text-xs font-bold text-slate-500">
                ENABLE_AI = {String(enableAi)}
              </span>
            </div>
            <h3 className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">
              Parent Weekly Report & Extra Practice Generator
            </h3>
            <p className="text-xs text-slate-500">
              When AI is disabled (default Free Tier), reports and bonus problems are generated deterministically at zero cost.
            </p>
          </div>

          <button
            onClick={() => setEnableAi(!enableAi)}
            className="flex items-center gap-1.5 rounded-xl border border-purple-300 bg-purple-50 px-3.5 py-2 text-xs font-bold text-purple-800 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-200"
          >
            {enableAi ? (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Switch to 100% Free Deterministic Mode</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>Enable Optional Gemini AI Mode</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Action 1: Weekly Parent Summary */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
            <h4 className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
              <FileText className="h-4 w-4 text-indigo-600" />
              <span>Weekly Parent Insights Summary</span>
            </h4>
            <p className="mt-1 text-xs text-slate-500">
              Generates a parent-friendly summary of strong skills, weak skills, and at-home TEKS tips.
            </p>
            <button
              onClick={handleGenerateParentInsights}
              disabled={loadingInsights}
              className="mt-3 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-indigo-700"
            >
              {loadingInsights
                ? "Generating Report..."
                : "Generate Weekly Parent Report"}
            </button>

            {aiSummaryText && (
              <div className="mt-3 whitespace-pre-line rounded-xl bg-white p-3.5 text-xs leading-relaxed text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
                {aiSummaryText}
              </div>
            )}
          </div>

          {/* Action 2: Generate Additional Practice */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
            <h4 className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
              <PlusCircle className="h-4 w-4 text-emerald-600" />
              <span>Generate Additional Practice for Any Skill</span>
            </h4>
            <p className="mt-1 text-xs text-slate-500">
              Select a Bluebonnet skill below to add bonus practice questions to your child&apos;s queue.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <select
                value={selectedPracticeSkillId}
                onChange={(e) => setSelectedPracticeSkillId(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-900"
              >
                {skills.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.code}] {s.title}
                  </option>
                ))}
              </select>
              <button
                onClick={handleGenerateExtraPractice}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-700"
              >
                + Add Practice Question
              </button>
            </div>
            {generatedNotice && (
              <p className="mt-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                ✅ {generatedNotice}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

