"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useLearningStore } from "@/store/useLearningStore";
import {
  SCHOOL_TEST_QUESTIONS,
  SchoolTestQuestion,
  Base10ModelVisual,
} from "@/data/school-tests";
import { speakText } from "@/lib/utils";
import {
  CheckCircle2,
  AlertCircle,
  Volume2,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  PenTool,
  Eraser,
  Trash2,
  Shuffle,
  FileText,
  Trophy,
  Check,
  Calculator,
  Layers,
} from "lucide-react";

// Celebratory Web Audio Chime
function playSuccessSound() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + idx * 0.08 + 0.24
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.24);
    });
  } catch {
    // ignore
  }
}

// Visual Base-10 Block Component (renders flats, rods, and unit cubes)
function Base10Visualizer({ models }: { models: Base10ModelVisual[] }) {
  return (
    <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-3">
      {models.map((m) => (
        <div
          key={m.name}
          className="flex flex-col justify-between rounded-2xl border-2 border-indigo-200 bg-indigo-50/40 p-4 dark:border-slate-700 dark:bg-slate-800/60"
        >
          <div>
            <div className="text-center text-sm font-black text-indigo-950 dark:text-white">
              {m.name}
            </div>
            <div className="mt-1 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {m.hundreds > 0 && `${m.hundreds} hundred(s) `}
              {m.tens > 0 && `${m.tens} ten(s) `}
              {m.ones > 0 && `${m.ones} one(s)`}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {/* Hundreds Flats */}
              {Array.from({ length: m.hundreds }).map((_, idx) => (
                <div
                  key={`h-${idx}`}
                  title="1 Hundred Flat (100)"
                  className="grid h-14 w-14 grid-cols-5 grid-rows-5 gap-[1px] rounded border-2 border-indigo-600 bg-indigo-500 p-0.5 shadow-sm"
                >
                  {Array.from({ length: 25 }).map((__, cIdx) => (
                    <div key={cIdx} className="bg-indigo-100" />
                  ))}
                </div>
              ))}

              {/* Tens Rods */}
              {m.tens > 0 && (
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: Math.min(m.tens, 20) }).map((_, idx) => (
                    <div
                      key={`t-${idx}`}
                      title="1 Ten Rod (10)"
                      className="flex h-12 w-2.5 flex-col justify-between rounded-xs border border-emerald-700 bg-emerald-400 p-[1px]"
                    >
                      {Array.from({ length: 5 }).map((__, rIdx) => (
                        <div
                          key={rIdx}
                          className="h-1.5 w-full border-b border-emerald-700/40 bg-emerald-200"
                        />
                      ))}
                    </div>
                  ))}
                  {m.tens > 20 && (
                    <span className="self-center rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-black text-emerald-900">
                      ({m.tens} ten rods total)
                    </span>
                  )}
                </div>
              )}

              {/* Unit Ones */}
              {m.ones > 0 && (
                <div className="grid grid-cols-5 gap-1">
                  {Array.from({ length: m.ones }).map((_, idx) => (
                    <div
                      key={`o-${idx}`}
                      title="1 Unit Cube (1)"
                      className="h-3 w-3 rounded-xs border border-amber-600 bg-amber-300"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 border-t border-indigo-100 pt-2 text-center text-[11px] font-bold text-indigo-700 dark:border-slate-700 dark:text-indigo-300">
            Write total value in your Work Area below!
          </div>
        </div>
      ))}
    </div>
  );
}

// Interactive Place Value Chart Helper for Place Value Questions
function PlaceValueJumpChart({ numberStr }: { numberStr: string }) {
  const cleanDigits = numberStr.replace(/,/g, "").split("");
  const headers = [
    "Hundred Thousands",
    "Ten Thousands",
    "Thousands",
    "Hundreds",
    "Tens",
    "Ones",
  ];
  const padded =
    cleanDigits.length === 6
      ? cleanDigits
      : Array(6 - cleanDigits.length)
          .fill("")
          .concat(cleanDigits);

  return (
    <div className="my-4 overflow-x-auto rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/50 dark:bg-slate-800/60">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300">
          🔢 Interactive Place Value Jump Chart (Each step left = ×10)
        </span>
        <span className="rounded-full bg-amber-200 px-2.5 py-0.5 text-[11px] font-black text-amber-950">
          2 Jumps = 10 × 10 = 100 | 4 Jumps = 10,000
        </span>
      </div>
      <div className="grid min-w-[520px] grid-cols-6 gap-1.5 text-center">
        {headers.map((h, i) => (
          <div
            key={h}
            className="rounded-xl border border-amber-300 bg-white p-2 shadow-xs dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400">
              {h}
            </div>
            <div className="mt-1 text-2xl font-black text-indigo-700 dark:text-indigo-300">
              {padded[i] || "0"}
            </div>
            <div className="mt-1 text-[10px] font-bold text-amber-700 dark:text-amber-400">
              {padded[i]
                ? `${Number(padded[i]) * Math.pow(10, 5 - i)}`.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ","
                  )
                : "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SchoolTestHub() {
  const { student, addStaarTestReward } = useLearningStore();

  // Filter modes:
  // "original" = Exact 9 questions from school test
  // "twins" = 9 new Twin questions with same patterns
  // "all" = All 18 questions
  // "random_retake" = Randomly picks 1 question per pattern (9 questions total)
  const [filterMode, setFilterMode] = useState<
    "original" | "twins" | "random_retake" | "all"
  >("original");
  const [randomSeed, setRandomSeed] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // User selected answers
  const [answers, setAnswers] = useState<Record<string, string>>({});
  // User guided step inputs: `${questionId}-step-${stepNumber}` -> value
  const [stepInputs, setStepInputs] = useState<Record<string, string>>({});
  // Freeform text scratchpad per question
  const [scratchNotes, setScratchNotes] = useState<Record<string, string>>({});

  // Drawing Canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState<string>("#4f46e5");
  const [showDrawingPad, setShowDrawingPad] = useState<boolean>(true);

  const activeQuestions = useMemo(() => {
    if (filterMode === "original") {
      return SCHOOL_TEST_QUESTIONS.filter(
        (q) => q.sourceType === "original_school_test"
      );
    }
    if (filterMode === "twins") {
      return SCHOOL_TEST_QUESTIONS.filter(
        (q) => q.sourceType === "twin_practice"
      );
    }
    if (filterMode === "random_retake") {
      // Pick 1 question for each of the 9 patterns using randomSeed
      const picked: SchoolTestQuestion[] = [];
      for (let p = 1; p <= 9; p++) {
        const group = SCHOOL_TEST_QUESTIONS.filter(
          (q) => q.patternGroup === p
        );
        const idx = (randomSeed + p) % group.length;
        if (group[idx]) picked.push(group[idx]);
      }
      return picked;
    }
    return SCHOOL_TEST_QUESTIONS;
  }, [filterMode, randomSeed]);

  const currentQ: SchoolTestQuestion =
    activeQuestions[currentIndex] || activeQuestions[0];

  // Clear drawing canvas when switching questions
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    clearCanvas();
  }, [currentQ?.id]);

  // Drawing handlers
  const startDraw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const endDraw = () => {
    setIsDrawing(false);
  };

  // Check if a guided step is answered correctly
  const isStepCorrect = (
    qId: string,
    stepNum: number,
    expected: string,
    acceptable?: string[]
  ) => {
    const val = (stepInputs[`${qId}-step-${stepNum}`] || "")
      .trim()
      .toLowerCase();
    if (!val) return false;
    if (val === expected.trim().toLowerCase()) return true;
    if (
      acceptable &&
      acceptable.some((a) => a.trim().toLowerCase() === val)
    ) {
      return true;
    }
    return false;
  };

  const handleSelectOption = (optId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optId }));
    if (optId.toUpperCase() === currentQ.correctAnswer.toUpperCase()) {
      playSuccessSound();
      addStaarTestReward(20, 6, 1, 2);
    }
  };

  const userAnswer = answers[currentQ.id] || "";
  const isCorrect =
    Boolean(userAnswer) &&
    userAnswer.toUpperCase() === currentQ.correctAnswer.toUpperCase();

  // Score calculation
  const scoreSummary = useMemo(() => {
    let correct = 0;
    let answered = 0;
    activeQuestions.forEach((q) => {
      const a = answers[q.id];
      if (a) {
        answered++;
        if (a.toUpperCase() === q.correctAnswer.toUpperCase()) {
          correct++;
        }
      }
    });
    const pct =
      activeQuestions.length > 0
        ? Math.round((correct / activeQuestions.length) * 100)
        : 0;
    return { correct, answered, total: activeQuestions.length, pct };
  }, [activeQuestions, answers]);

  return (
    <div className="space-y-6">
      {/* ============================================================
          TOP BANNER: MODULE 3 TOPIC A DAILY GRADE & TWIN GENERATOR
         ============================================================ */}
      <div className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 p-6 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-400 px-3 py-0.5 text-xs font-black uppercase text-slate-950">
                School Test & Twin Generator
              </span>
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold">
                Module 3 Topic A Daily Grade • Cambium / TFAR Bank
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-black">
              School Test Practice + Step-by-Step Working Area ✏️
            </h2>
            <p className="mt-1 text-xs text-emerald-100 leading-relaxed">
              This test comes from the <strong>Texas Formative Assessment Resource (TFAR / Cambium Bank)</strong> where teachers select specific STAAR-style questions for Module 3 Topic A (Multiplication Comparisons, 3-Factor Equations, Input-Output Tables) + Spiral Place Value Review. Use the <strong>Guided Step-by-Step Working Area</strong> below each question before choosing your final answer!
            </p>
          </div>

          <div className="rounded-2xl bg-white/15 p-4 text-center backdrop-blur-md">
            <div className="text-[11px] font-bold uppercase text-emerald-200">
              Current Score
            </div>
            <div className="text-2xl font-black">
              {scoreSummary.correct} / {scoreSummary.total} ({scoreSummary.pct}%)
            </div>
            <div className="text-[11px] text-emerald-100">
              {scoreSummary.answered} Answered
            </div>
          </div>
        </div>

        {/* Test Set Mode Selector */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/15 pt-4">
          <button
            onClick={() => {
              setFilterMode("original");
              setCurrentIndex(0);
            }}
            className={`rounded-xl px-4 py-2 text-xs font-black transition ${
              filterMode === "original"
                ? "bg-white text-emerald-950 shadow-md"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            📄 Exact School Test (9 Questions)
          </button>

          <button
            onClick={() => {
              setFilterMode("twins");
              setCurrentIndex(0);
            }}
            className={`rounded-xl px-4 py-2 text-xs font-black transition ${
              filterMode === "twins"
                ? "bg-white text-emerald-950 shadow-md"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            ✨ Twin Practice Set (9 New Numbers, Same Patterns)
          </button>

          <button
            onClick={() => {
              setFilterMode("random_retake");
              setRandomSeed((s) => s + 1);
              setAnswers({});
              setCurrentIndex(0);
            }}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black transition ${
              filterMode === "random_retake"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "bg-amber-400/90 text-slate-950 hover:bg-amber-300"
            }`}
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span>Generate Fresh 9-Question Retake</span>
          </button>

          <button
            onClick={() => {
              setFilterMode("all");
              setCurrentIndex(0);
            }}
            className={`rounded-xl px-4 py-2 text-xs font-black transition ${
              filterMode === "all"
                ? "bg-white text-emerald-950 shadow-md"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            📚 All 18 Questions
          </button>
        </div>
      </div>

      {/* ============================================================
          QUESTION NUMBER PILLS BAR
         ============================================================ */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-2">
          {activeQuestions.map((q, idx) => {
            const ans = answers[q.id];
            const right =
              ans && ans.toUpperCase() === q.correctAnswer.toUpperCase();
            const isCurr = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black transition ${
                  isCurr
                    ? "ring-2 ring-indigo-600 ring-offset-2 bg-indigo-600 text-white"
                    : right
                    ? "bg-emerald-500 text-white"
                    : ans
                    ? "bg-rose-500 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            setAnswers({});
            setStepInputs({});
            clearCanvas();
          }}
          className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Answers</span>
        </button>
      </div>

      {/* ============================================================
          MAIN 2-COLUMN QUESTION + WORKING AREA LAYOUT
         ============================================================ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN (7 Cols): Question Prompt, Visuals & Answer Options */}
        <div className="space-y-5 lg:col-span-7">
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-xl bg-emerald-600 px-3 py-1 text-xs font-black text-white">
                  Question #{currentIndex + 1}
                </span>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {currentQ.patternTitle}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  TEKS {currentQ.teks}
                </span>
              </div>

              <button
                onClick={() => speakText(currentQ.prompt)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-extrabold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Volume2 className="h-4 w-4 text-indigo-600" />
                <span>Read Aloud</span>
              </button>
            </div>

            {/* Prompt */}
            <div className="mt-4">
              <p className="whitespace-pre-line text-base font-bold leading-relaxed text-slate-900 dark:text-white">
                {currentQ.prompt}
              </p>
            </div>

            {/* SPECIAL VISUALS */}
            {/* 1. Place Value Interactive Chart */}
            {currentQ.visualType === "place_value_number" &&
              currentQ.highlightedNumber && (
                <PlaceValueJumpChart numberStr={currentQ.highlightedNumber} />
              )}

            {/* 2. Base-10 Block Models */}
            {currentQ.visualType === "base10_models" &&
              currentQ.base10Models && (
                <Base10Visualizer models={currentQ.base10Models} />
              )}

            {/* 3. Single Input-Output Table */}
            {currentQ.visualType === "single_table" && currentQ.tableData && (
              <div className="my-4 overflow-hidden rounded-2xl border-2 border-indigo-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                <div className="bg-indigo-600 px-4 py-2 text-center text-xs font-black text-white">
                  {currentQ.tableData.title}
                </div>
                <table className="w-full text-center text-xs font-bold">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      <th className="py-2.5 px-3">
                        {currentQ.tableData.headers[0]}
                      </th>
                      <th className="py-2.5 px-3 text-indigo-600">
                        Rule (× ?)
                      </th>
                      <th className="py-2.5 px-3">
                        {currentQ.tableData.headers[1]}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {currentQ.tableData.rows.map((r, rIdx) => (
                      <tr key={rIdx}>
                        <td className="py-2.5 text-sm font-black">{r[0]}</td>
                        <td className="py-2.5 text-xs font-extrabold text-amber-600">
                          → × ? →
                        </td>
                        <td className="py-2.5 text-sm font-black">{r[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 4. Four Tables Comparison */}
            {currentQ.visualType === "four_tables" && currentQ.fourTables && (
              <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {currentQ.fourTables.map((t) => (
                  <div
                    key={t.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="bg-slate-200 px-3 py-1.5 text-xs font-black text-slate-800 dark:bg-slate-700 dark:text-white">
                      ({t.id}) {t.title}
                    </div>
                    <table className="w-full text-center text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500">
                          <th className="py-1.5">{t.headers[0]}</th>
                          <th className="py-1.5">{t.headers[1]}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-bold">
                        {t.rows.map((r, i) => (
                          <tr key={i}>
                            <td className="py-1">{r[0]}</td>
                            <td className="py-1">{r[1]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}

            {/* Answer Choices */}
            <div className="mt-5 space-y-2.5">
              <div className="text-xs font-black uppercase tracking-wider text-slate-400">
                Step 2: Choose Your Final Answer After Completing the Work Area →
              </div>
              {currentQ.options.map((opt) => {
                const isSelected = userAnswer === opt.id;
                const isRightChoice =
                  opt.id.toUpperCase() ===
                  currentQ.correctAnswer.toUpperCase();

                let style =
                  "border-slate-200 bg-slate-50/70 hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-800 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-100";

                if (userAnswer) {
                  if (isRightChoice) {
                    style =
                      "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-100";
                  } else if (isSelected && !isRightChoice) {
                    style =
                      "border-rose-400 bg-rose-50 text-rose-950 font-bold dark:border-rose-600 dark:bg-rose-950/50 dark:text-rose-100";
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`flex w-full items-start gap-3.5 rounded-2xl border-2 p-3.5 text-left transition ${style}`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
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

            {/* Teacher Explanation & Paper Test Coaching Feedback */}
            {userAnswer && (
              <div
                className={`mt-5 rounded-2xl border-2 p-4 ${
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
                  <h4 className="text-sm font-black">
                    {isCorrect
                      ? "Awesome Job! You nailed this step-by-step! (+20 XP)"
                      : `Keep Going! The correct answer is (${currentQ.correctAnswer})`}
                  </h4>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                  <strong>Step-by-Step Solution:</strong>{" "}
                  {currentQ.workedExplanation}
                </p>
                <div className="mt-2 rounded-xl bg-white/80 p-3 text-xs font-bold text-indigo-950 dark:bg-slate-900/70 dark:text-indigo-200">
                  👩‍🏫 <strong>Teacher Note from Your School Paper Test:</strong>{" "}
                  {currentQ.teacherFeedbackOnMistake}
                </div>
              </div>
            )}

            {/* Prev / Next Footer */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <span className="text-xs font-bold text-slate-400">
                Question {currentIndex + 1} of {activeQuestions.length}
              </span>

              <button
                disabled={currentIndex === activeQuestions.length - 1}
                onClick={() =>
                  setCurrentIndex((i) =>
                    Math.min(activeQuestions.length - 1, i + 1)
                  )
                }
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-black text-white shadow-sm hover:bg-indigo-700 disabled:opacity-40"
              >
                <span>Next Question</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 Cols): INTERACTIVE STEP-BY-STEP WORKING AREA & SCRATCHPAD */}
        <div className="space-y-5 lg:col-span-5">
          <div className="rounded-3xl border-2 border-indigo-200 bg-indigo-50/40 p-5 shadow-sm dark:border-indigo-900/60 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-indigo-600" />
                <h3 className="text-sm font-black text-indigo-950 dark:text-white">
                  Step 1: Interactive Working Area ✍️
                </h3>
              </div>
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-black text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                Follow Steps First!
              </span>
            </div>

            <p className="mt-2 text-xs font-bold text-slate-600 dark:text-slate-300">
              Complete these guided thinking steps before picking your answer—just like showing your work on paper in class!
            </p>

            {/* Guided Step Checkboxes / Inputs */}
            <div className="mt-4 space-y-3">
              {currentQ.guidedSteps.map((step) => {
                const key = `${currentQ.id}-step-${step.stepNumber}`;
                const val = stepInputs[key] || "";
                const stepRight = isStepCorrect(
                  currentQ.id,
                  step.stepNumber,
                  step.expectedValue,
                  step.acceptableValues
                );

                return (
                  <div
                    key={step.stepNumber}
                    className={`rounded-2xl border-2 p-3.5 transition ${
                      stepRight
                        ? "border-emerald-400 bg-emerald-50/90 dark:border-emerald-700 dark:bg-emerald-950/30"
                        : "border-white bg-white shadow-xs dark:border-slate-800 dark:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <label className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                        <span className="mr-1.5 inline-block rounded-md bg-indigo-600 px-1.5 py-0.5 text-[10px] font-black text-white">
                          Step {step.stepNumber}
                        </span>
                        {step.label}
                      </label>
                      {stepRight && (
                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-white">
                          <Check className="h-3 w-3" /> Great!
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) =>
                          setStepInputs((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        placeholder={step.placeholder}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="mt-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      💡 {step.helperText}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Equation & Scratch Notes Textbox */}
            <div className="mt-4">
              <label className="block text-xs font-black text-slate-700 dark:text-slate-200">
                📝 Type Your Equations & Scratch Notes:
              </label>
              <textarea
                rows={2}
                value={scratchNotes[currentQ.id] || ""}
                onChange={(e) =>
                  setScratchNotes((prev) => ({
                    ...prev,
                    [currentQ.id]: e.target.value,
                  }))
                }
                placeholder="Type your math work here (e.g. 8 × 3 = 24, or 10 × 10 = 100)..."
                className="mt-1.5 w-full rounded-2xl border border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Freehand Drawing Pad (For circling numbers, drawing groups or jumps) */}
            <div className="mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-xs font-black text-slate-700 dark:text-slate-200">
                  <PenTool className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Draw Groups, Jumps, or Arrays:</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {[
                    { color: "#4f46e5", label: "Blue" },
                    { color: "#e11d48", label: "Red" },
                    { color: "#059669", label: "Green" },
                  ].map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setPenColor(c.color)}
                      className={`h-5 w-5 rounded-full border-2 ${
                        penColor === c.color
                          ? "scale-110 border-slate-900"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                    />
                  ))}
                  <button
                    onClick={clearCanvas}
                    className="ml-1 flex items-center gap-1 rounded-lg bg-slate-200 px-2 py-1 text-[10px] font-black text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Clear Pad</span>
                  </button>
                </div>
              </div>

              {showDrawingPad && (
                <div className="mt-2 overflow-hidden rounded-2xl border-2 border-dashed border-indigo-300 bg-white dark:border-slate-700">
                  <canvas
                    ref={canvasRef}
                    width={380}
                    height={190}
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={endDraw}
                    onMouseLeave={endDraw}
                    onTouchStart={startDraw}
                    onTouchMove={draw}
                    onTouchEnd={endDraw}
                    className="h-[190px] w-full cursor-crosshair touch-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
