"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLearningStore } from "@/store/useLearningStore";
import {
  STAAR_2022_GRADE3_MATH,
  STAAR_REPORTING_CATEGORIES,
  STAARQuestion,
} from "@/data/staar-tests";
import { speakText } from "@/lib/utils";
import {
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Volume2,
  RotateCcw,
  Flag,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Award,
  Sparkles,
  Clock,
  Filter,
  BarChart3,
  Lightbulb,
  Check,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

// Web Audio synthesizer chime for correct answers
function playCorrectChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + idx * 0.08 + 0.25
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
    });
  } catch {
    // AudioContext blocked or not supported
  }
}

type HubMode = "practice" | "mock_exam" | "results";

export function STAARTestHub() {
  const { student, addStaarTestReward } = useLearningStore();

  const test = STAAR_2022_GRADE3_MATH;
  const [mode, setMode] = useState<HubMode>("practice");
  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all"
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  // User answers state: questionId -> answer string
  const [answers, setAnswers] = useState<Record<string, string>>({});
  // Flagged questions in mock exam
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  // Show explanation / rationale in practice mode
  const [showRationale, setShowRationale] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [griddableInput, setGriddableInput] = useState("");

  // Mock test timer (60 minutes = 3600 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(3600);
  const [timerActive, setTimerActive] = useState(false);

  // Filtered question set
  const filteredQuestions = useMemo(() => {
    if (selectedCategory === "all") return test.questions;
    return test.questions.filter(
      (q) => q.reportingCategory === selectedCategory
    );
  }, [test.questions, selectedCategory]);

  const currentQ: STAARQuestion =
    filteredQuestions[currentIndex] || filteredQuestions[0];

  // Reset question-specific states when navigating
  useEffect(() => {
    setShowRationale(false);
    setShowHint(false);
    const existingAnswer = answers[currentQ.id] || "";
    setGriddableInput(currentQ.isGriddable ? existingAnswer : "");
  }, [currentIndex, currentQ.id, currentQ.isGriddable, answers]);

  // Mock Exam Timer effect
  useEffect(() => {
    if (mode !== "mock_exam" || !timerActive) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setMode("results");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mode, timerActive]);

  // Handle option select
  const handleSelectOption = (optId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optId }));
    if (mode === "practice") {
      setShowRationale(true);
      if (optId.toUpperCase() === currentQ.correctAnswer.toUpperCase()) {
        playCorrectChime();
        addStaarTestReward(15, 5, 0, 1);
      }
    }
  };

  // Handle Griddable submit
  const handleGriddableSubmit = () => {
    const clean = griddableInput.trim();
    if (!clean) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: clean }));
    if (mode === "practice") {
      setShowRationale(true);
      if (clean === currentQ.correctAnswer) {
        playCorrectChime();
        addStaarTestReward(20, 6, 0, 1);
      }
    }
  };

  // Toggle flag
  const toggleFlag = (qId: string) => {
    setFlaggedIds((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  // Finish exam
  const handleFinishExam = useCallback(() => {
    setMode("results");
    // Calculate final scores and rewards
    let correct = 0;
    test.questions.forEach((q) => {
      if (
        (answers[q.id] || "").trim().toUpperCase() ===
        q.correctAnswer.trim().toUpperCase()
      ) {
        correct++;
      }
    });
    const pct = Math.round((correct / test.questions.length) * 100);
    // Award XP, coins, stars
    const xpReward = correct * 25 + (pct >= 85 ? 200 : pct >= 70 ? 100 : 50);
    const coinReward = correct * 8 + (pct >= 85 ? 50 : 25);
    const starsReward = pct >= 85 ? 3 : pct >= 70 ? 2 : 1;
    addStaarTestReward(xpReward, coinReward, starsReward, 25);
  }, [test.questions, answers, addStaarTestReward]);

  // Score statistics
  const stats = useMemo(() => {
    let correct = 0;
    const catStats: Record<number, { correct: number; total: number }> = {
      1: { correct: 0, total: 0 },
      2: { correct: 0, total: 0 },
      3: { correct: 0, total: 0 },
      4: { correct: 0, total: 0 },
    };

    test.questions.forEach((q) => {
      const cat = q.reportingCategory;
      catStats[cat].total++;
      const userAns = (answers[q.id] || "").trim().toUpperCase();
      if (userAns && userAns === q.correctAnswer.trim().toUpperCase()) {
        correct++;
        catStats[cat].correct++;
      }
    });

    const total = test.questions.length;
    const pct = Math.round((correct / total) * 100);
    let level = "Did Not Meet Grade Level";
    let levelColor = "text-rose-600 bg-rose-50 border-rose-300";
    if (pct >= 85) {
      level = "Masters Grade Level 🏆";
      levelColor = "text-purple-700 bg-purple-50 border-purple-300";
    } else if (pct >= 70) {
      level = "Meets Grade Level ⭐";
      levelColor = "text-emerald-700 bg-emerald-50 border-emerald-300";
    } else if (pct >= 55) {
      level = "Approaches Grade Level 👍";
      levelColor = "text-amber-700 bg-amber-50 border-amber-300";
    }

    return { correct, total, pct, level, levelColor, catStats };
  }, [test.questions, answers]);

  const userAnswer = answers[currentQ?.id] || "";
  const isAnswered = Boolean(userAnswer);
  const isCorrect =
    isAnswered &&
    userAnswer.trim().toUpperCase() ===
      currentQ?.correctAnswer.trim().toUpperCase();

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* ============================================================
          TOP HERO HEADER & NAVIGATION
         ============================================================ */}
      <div className="overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-6 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-400 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-slate-950">
                Official TEA Test Bank
              </span>
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold text-white">
                Grade 3 Mathematics • TEKS Aligned
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-black md:text-3xl">
              Texas STAAR Grade 3 Exam Prep 📝
            </h1>
            <p className="mt-1 text-xs text-indigo-100 md:text-sm">
              Practice all 32 questions from the authentic 2022 Texas STAAR
              released test with official TEA rationale explanations!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 backdrop-blur-md">
              <Trophy className="h-5 w-5 text-amber-300" />
              <div>
                <div className="text-[10px] font-bold uppercase text-indigo-200">
                  Practicing As
                </div>
                <div className="text-sm font-black">{student.name}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-amber-400 px-4 py-2 text-slate-950 font-black">
              <Sparkles className="h-5 w-5" />
              <span>+{student.xp} XP</span>
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setMode("practice");
                setTimerActive(false);
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition ${
                mode === "practice"
                  ? "bg-white text-indigo-900 shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <span>Practice Mode (Instant Feedback)</span>
            </button>
            <button
              onClick={() => {
                setMode("mock_exam");
                setTimerActive(true);
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition ${
                mode === "mock_exam"
                  ? "bg-white text-indigo-900 shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Clock className="h-4 w-4 text-indigo-600" />
              <span>Mock STAAR Exam (60 Min Timer)</span>
            </button>
            <button
              onClick={() => setMode("results")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition ${
                mode === "results"
                  ? "bg-white text-indigo-900 shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <BarChart3 className="h-4 w-4 text-emerald-600" />
              <span>Score & Mastery Report</span>
            </button>
          </div>

          {mode === "mock_exam" && (
            <div className="flex items-center gap-3 rounded-xl bg-rose-500/80 px-4 py-1.5 text-xs font-black text-white shadow-sm">
              <Clock className="h-4 w-4 animate-pulse" />
              <span>Time Left: {timeFormatted}</span>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================
          MAIN BODY: PRACTICE OR MOCK EXAM MODE
         ============================================================ */}
      {mode !== "results" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Left / Main Question Area (3 Cols) */}
          <div className="space-y-5 lg:col-span-3">
            {/* Category Filter Pills (Only in Practice Mode) */}
            {mode === "practice" && (
              <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                  <Filter className="h-3.5 w-3.5" /> Category:
                </span>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setCurrentIndex(0);
                  }}
                  className={`rounded-xl px-3 py-1 text-xs font-extrabold transition ${
                    selectedCategory === "all"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  All 32 Questions
                </button>
                {STAAR_REPORTING_CATEGORIES.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => {
                      setSelectedCategory(cat.category);
                      setCurrentIndex(0);
                    }}
                    className={`rounded-xl px-3 py-1 text-xs font-extrabold transition ${
                      selectedCategory === cat.category
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    Cat {cat.category} ({cat.title.split(" ")[0]})
                  </button>
                ))}
              </div>
            )}

            {/* Question Card */}
            <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {/* Question Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-sm font-black text-white">
                    {currentQ.questionNumber}
                  </span>
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    Category {currentQ.reportingCategory}:{" "}
                    {currentQ.reportingCategoryTitle}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    TEKS {currentQ.teks} •{" "}
                    {currentQ.isReadiness ? "Readiness" : "Supporting"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => speakText(currentQ.prompt)}
                    className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-extrabold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    title="Read Question Aloud"
                  >
                    <Volume2 className="h-4 w-4 text-indigo-600" />
                    <span>Read to Me</span>
                  </button>
                  <button
                    onClick={() => toggleFlag(currentQ.id)}
                    className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold transition ${
                      flaggedIds.has(currentQ.id)
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <Flag className="h-3.5 w-3.5" />
                    <span>
                      {flaggedIds.has(currentQ.id) ? "Flagged" : "Flag"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="mt-5 space-y-4">
                <p className="whitespace-pre-line text-base font-bold leading-relaxed text-slate-800 dark:text-slate-100">
                  {currentQ.prompt}
                </p>

                {/* Multiple Choice Options */}
                {!currentQ.isGriddable && (
                  <div className="mt-6 space-y-3">
                    {currentQ.options.map((opt) => {
                      const isSelected = userAnswer === opt.id;
                      const isOptCorrect =
                        opt.id.toUpperCase() ===
                        currentQ.correctAnswer.toUpperCase();

                      let cardStyle =
                        "border-slate-200 bg-slate-50/70 hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-800 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-100";

                      if (isSelected) {
                        cardStyle =
                          "border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold dark:border-indigo-500 dark:bg-indigo-950/60 dark:text-white";
                      }

                      // In practice mode, after selection, color-code right/wrong
                      if (mode === "practice" && showRationale) {
                        if (isOptCorrect) {
                          cardStyle =
                            "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-100";
                        } else if (isSelected && !isOptCorrect) {
                          cardStyle =
                            "border-rose-400 bg-rose-50 text-rose-950 font-bold dark:border-rose-600 dark:bg-rose-950/50 dark:text-rose-100";
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectOption(opt.id)}
                          className={`flex w-full items-start gap-4 rounded-2xl border-2 p-4 text-left transition active:scale-[0.99] ${cardStyle}`}
                        >
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                              isSelected
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                            }`}
                          >
                            {opt.id}
                          </span>
                          <span className="pt-0.5 text-sm leading-relaxed">
                            {opt.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Griddable Number Input */}
                {currentQ.isGriddable && (
                  <div className="mt-6 rounded-2xl border-2 border-indigo-100 bg-indigo-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/30">
                    <div className="text-xs font-black uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
                      STAAR Griddable Math Item (Enter Number)
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        value={griddableInput}
                        onChange={(e) => setGriddableInput(e.target.value)}
                        placeholder="Type answer (e.g. 64)"
                        className="w-48 rounded-xl border-2 border-slate-300 bg-white px-4 py-2.5 text-lg font-black text-slate-900 shadow-sm focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                      <button
                        onClick={handleGriddableSubmit}
                        className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-black text-white shadow-md hover:bg-indigo-700"
                      >
                        Submit Grid Answer
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Hint Accordion */}
              {mode === "practice" && (
                <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="flex items-center gap-1.5 text-xs font-extrabold text-amber-600 hover:underline dark:text-amber-400"
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span>{showHint ? "Hide Hint" : "Need a Hint?"}</span>
                    </button>
                  </div>
                  {showHint && (
                    <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs font-bold text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                      💡 <strong>Hint:</strong> {currentQ.hint}
                    </div>
                  )}
                </div>
              )}

              {/* Official TEA Rationale Card (Practice Mode) */}
              {mode === "practice" && showRationale && (
                <div
                  className={`mt-6 rounded-2xl border-2 p-5 ${
                    isCorrect
                      ? "border-emerald-300 bg-emerald-50/90 dark:border-emerald-800 dark:bg-emerald-950/40"
                      : "border-amber-300 bg-amber-50/90 dark:border-amber-800 dark:bg-amber-950/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    )}
                    <h4
                      className={`text-sm font-black ${
                        isCorrect
                          ? "text-emerald-900 dark:text-emerald-200"
                          : "text-amber-900 dark:text-amber-200"
                      }`}
                    >
                      {isCorrect
                        ? "Outstanding! That is Correct! (+15 XP)"
                        : `Not quite! The correct answer is Option ${currentQ.correctAnswer}`}
                    </h4>
                  </div>

                  <div className="mt-3 space-y-2 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                    <div>
                      <strong>Official Texas Education Agency Explanation:</strong>{" "}
                      {currentQ.teaRationale.correctRationale}
                    </div>

                    {/* Show why the user's picked distractor is incorrect if wrong */}
                    {!isCorrect &&
                      currentQ.teaRationale.distractorRationales &&
                      currentQ.teaRationale.distractorRationales[userAnswer] && (
                        <div className="mt-2 rounded-xl bg-white/70 p-3 text-rose-900 dark:bg-slate-900/60 dark:text-rose-200">
                          <strong>Why Option {userAnswer} was incorrect:</strong>{" "}
                          {currentQ.teaRationale.distractorRationales[userAnswer]}
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* Bottom Nav Bar */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  disabled={currentIndex === 0}
                  onClick={() =>
                    setCurrentIndex((prev) => Math.max(0, prev - 1))
                  }
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <div className="text-xs font-extrabold text-slate-500">
                  Question {currentIndex + 1} of {filteredQuestions.length}
                </div>

                {currentIndex < filteredQuestions.length - 1 ? (
                  <button
                    onClick={() =>
                      setCurrentIndex((prev) =>
                        Math.min(filteredQuestions.length - 1, prev + 1)
                      )
                    }
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-black text-white shadow-md hover:bg-indigo-700"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishExam}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-black text-white shadow-md hover:bg-emerald-700"
                  >
                    <Trophy className="h-4 w-4" />
                    <span>Submit & View Results</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Question Grid Navigator (1 Col) */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Question Navigator
                </h3>
                <span className="text-xs font-bold text-slate-400">
                  {Object.keys(answers).length}/{test.questions.length} Answered
                </span>
              </div>

              {/* 32 Question Buttons */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                {filteredQuestions.map((q, idx) => {
                  const hasAnswer = Boolean(answers[q.id]);
                  const isCurrent = idx === currentIndex;
                  const isFlagged = flaggedIds.has(q.id);

                  let btnColor =
                    "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300";
                  if (hasAnswer) {
                    btnColor = "bg-indigo-600 text-white font-black";
                  }
                  if (isFlagged) {
                    btnColor =
                      "bg-amber-400 text-slate-950 font-black border-2 border-amber-500";
                  }
                  if (isCurrent) {
                    btnColor += " ring-2 ring-indigo-500 ring-offset-2";
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative flex h-10 w-full items-center justify-center rounded-xl text-xs font-extrabold transition ${btnColor}`}
                    >
                      <span>{q.questionNumber}</span>
                      {isFlagged && (
                        <Flag className="absolute -top-1 -right-1 h-3 w-3 fill-amber-500 text-amber-700" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-5 space-y-1.5 border-t border-slate-100 pt-3 text-[11px] font-bold text-slate-500 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-md bg-indigo-600"></span>
                  <span>Answered Question</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-md bg-amber-400"></span>
                  <span>Flagged for Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-md bg-slate-200 dark:bg-slate-700"></span>
                  <span>Unanswered</span>
                </div>
              </div>

              {mode === "mock_exam" && (
                <button
                  onClick={handleFinishExam}
                  className="mt-5 w-full rounded-2xl bg-emerald-600 py-3 text-xs font-black text-white shadow-md hover:bg-emerald-700 transition"
                >
                  Submit STAAR Exam Now 🏁
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          RESULTS & MASTERY SCORE REPORT VIEW
         ============================================================ */}
      {mode === "results" && (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="rounded-3xl border-2 border-indigo-200 bg-white p-6 shadow-md dark:border-indigo-900 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-black uppercase text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  STAAR Grade 3 Score Report
                </span>
                <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {stats.pct}% Scaled Mastery
                </h2>
                <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">
                  {student.name} answered {stats.correct} of {stats.total}{" "}
                  questions correctly.
                </p>
                <div className="mt-3">
                  <span
                    className={`inline-block rounded-2xl border px-4 py-1.5 text-sm font-black ${stats.levelColor}`}
                  >
                    Texas STAAR Benchmark: {stats.level}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setMode("practice");
                    setCurrentIndex(0);
                  }}
                  className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-xs font-black text-white shadow-md hover:bg-indigo-700"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Review All Questions</span>
                </button>
                <button
                  onClick={() => {
                    setAnswers({});
                    setFlaggedIds(new Set());
                    setSecondsRemaining(3600);
                    setMode("mock_exam");
                    setCurrentIndex(0);
                  }}
                  className="flex items-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-xs font-black text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                >
                  <span>Retake Full Test</span>
                </button>
              </div>
            </div>

            {/* Performance by Reporting Category */}
            <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Performance by Reporting Category:
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {STAAR_REPORTING_CATEGORIES.map((cat) => {
                  const cStat = stats.catStats[cat.category] || {
                    correct: 0,
                    total: 1,
                  };
                  const cPct = Math.round((cStat.correct / cStat.total) * 100);

                  return (
                    <div
                      key={cat.category}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                          Category {cat.category}: {cat.title}
                        </span>
                        <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-black text-indigo-700 shadow-sm dark:bg-slate-800 dark:text-indigo-300">
                          {cStat.correct}/{cStat.total} ({cPct}%)
                        </span>
                      </div>
                      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            cPct >= 85
                              ? "bg-purple-600"
                              : cPct >= 70
                              ? "bg-emerald-500"
                              : cPct >= 55
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${cPct}%` }}
                        />
                      </div>
                      <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                        {cat.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Full Item Breakdown Table */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Full Test Item Review (32 Questions)
            </h3>
            <p className="text-xs text-slate-500">
              Click any question to inspect the official Texas Education Agency
              rationale and explanation.
            </p>

            <div className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
              {test.questions.map((q) => {
                const uAns = (answers[q.id] || "").trim().toUpperCase();
                const isItemCorrect = uAns === q.correctAnswer.toUpperCase();

                return (
                  <div
                    key={q.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-black ${
                          isItemCorrect
                            ? "bg-emerald-100 text-emerald-800"
                            : uAns
                            ? "bg-rose-100 text-rose-800"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {isItemCorrect ? "✓" : uAns ? "✗" : "–"}
                      </span>
                      <div>
                        <div className="text-xs font-black text-slate-900 dark:text-white">
                          Question {q.questionNumber}: {q.teks} • Cat{" "}
                          {q.reportingCategory}
                        </div>
                        <div className="line-clamp-1 text-[11px] text-slate-500">
                          {q.prompt.replace(/\n/g, " ")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Your: <strong>{uAns || "None"}</strong> | Correct:{" "}
                        <strong className="text-emerald-600">
                          {q.correctAnswer}
                        </strong>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentIndex(q.questionNumber - 1);
                          setMode("practice");
                          setShowRationale(true);
                        }}
                        className="rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-extrabold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
                      >
                        Review Rationale →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
