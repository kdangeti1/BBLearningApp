"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useLearningStore } from "@/store/useLearningStore";
import {
  getSmartScoreLevel,
  getSmartScoreColor,
  speakText,
} from "@/lib/utils";
import {
  Volume2,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Flame,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Award,
  Layers,
} from "lucide-react";

export function SkillPracticeEngine() {
  const {
    skills,
    questions,
    units,
    lessons,
    selectedSkillId,
    progress,
    student,
    enableAi,
    startSkillPractice,
    openLesson,
    recordQuestionAttempt,
  } = useLearningStore();

  const currentSkill = useMemo(
    () => skills.find((s) => s.id === selectedSkillId) || skills[0],
    [skills, selectedSkillId]
  );

  const currentUnit = useMemo(
    () => units.find((u) => u.id === currentSkill?.unitId),
    [units, currentSkill]
  );

  const currentLesson = useMemo(
    () => lessons.find((l) => l.id === currentSkill?.lessonId),
    [lessons, currentSkill]
  );

  const skillQuestions = useMemo(() => {
    const direct = questions.filter((q) => q.skillId === currentSkill?.id);
    if (direct.length > 0) return direct;
    const byUnit = questions.filter((q) => q.unitId === currentSkill?.unitId);
    return byUnit.length > 0 ? byUnit : questions.slice(0, 5);
  }, [questions, currentSkill]);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [fillBlankInput, setFillBlankInput] = useState<string>("");
  const [sequenceOrder, setSequenceOrder] = useState<string[]>([]);
  const [matchingSelections, setMatchingSelections] = useState<Record<string, string>>({});
  const [dragDropBuckets, setDragDropBuckets] = useState<Record<string, string>>({});

  const [showHint, setShowHint] = useState(false);
  const [showWorkedExample, setShowWorkedExample] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{
    isCorrect: boolean;
    delta: number;
    streakBonus: boolean;
    smartScoreAfter: number;
    earnedBadges: string[];
  } | null>(null);

  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const currentQuestion = skillQuestions[questionIndex % skillQuestions.length];
  const skillProgress = progress[currentSkill?.id || ""] || {
    smartScore: 0,
    level: "Beginner",
    attemptsCount: 0,
    correctCount: 0,
    consecutiveCorrect: 0,
    needsRemediation: false,
  };

  const easierSkill = useMemo(
    () =>
      currentSkill?.easierSkillId
        ? skills.find((s) => s.id === currentSkill.easierSkillId)
        : undefined,
    [skills, currentSkill]
  );

  // Reset question state when question or skill changes
  useEffect(() => {
    setSelectedOption("");
    setFillBlankInput("");
    setShowHint(false);
    setSubmittedResult(null);
    setAiExplanation(null);
    setQuestionStartTime(Date.now());

    if (currentQuestion?.type === "sequencing" && currentQuestion.sequenceItems) {
      // Deterministically scramble sequence items so student can order them
      const items = [...currentQuestion.sequenceItems];
      if (items.length > 1) {
        const first = items.shift()!;
        items.push(first);
      }
      setSequenceOrder(items);
    } else {
      setSequenceOrder([]);
    }

    if (currentQuestion?.type === "matching" && currentQuestion.matchingPairs) {
      const init: Record<string, string> = {};
      currentQuestion.matchingPairs.forEach((p) => {
        init[p.left] = "";
      });
      setMatchingSelections(init);
    } else {
      setMatchingSelections({});
    }

    if (currentQuestion?.type === "drag_drop" && currentQuestion.dragDropItems) {
      const init: Record<string, string> = {};
      currentQuestion.dragDropItems.forEach((item) => {
        init[item.id] = "";
      });
      setDragDropBuckets(init);
    } else {
      setDragDropBuckets({});
    }
  }, [currentQuestion, currentSkill?.id]);

  if (!currentSkill || !currentQuestion) {
    return null;
  }

  const moveSequenceItem = (idx: number, direction: "up" | "down") => {
    if (submittedResult) return;
    const copy = [...sequenceOrder];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= copy.length) return;
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    setSequenceOrder(copy);
  };

  const evaluateAnswer = (): { isCorrect: boolean; answerDisplay: string } => {
    const q = currentQuestion;
    if (
      q.type === "multiple_choice" ||
      q.type === "reading_comprehension" ||
      q.type === "vocabulary"
    ) {
      return {
        isCorrect: selectedOption.trim() === q.correctAnswer.trim(),
        answerDisplay: selectedOption,
      };
    }

    if (q.type === "fill_blank") {
      const normalized = fillBlankInput.trim().toLowerCase();
      const acceptable = [
        q.correctAnswer.trim().toLowerCase(),
        ...(q.acceptableAnswers || []).map((a) => a.trim().toLowerCase()),
      ];
      return {
        isCorrect: acceptable.includes(normalized),
        answerDisplay: fillBlankInput.trim(),
      };
    }

    if (q.type === "sequencing" && q.sequenceItems) {
      const isCorrect =
        JSON.stringify(sequenceOrder) === JSON.stringify(q.sequenceItems);
      return {
        isCorrect,
        answerDisplay: sequenceOrder.join(" → "),
      };
    }

    if (q.type === "matching" && q.matchingPairs) {
      const allCorrect = q.matchingPairs.every(
        (pair) => matchingSelections[pair.left] === pair.right
      );
      return {
        isCorrect: allCorrect,
        answerDisplay: JSON.stringify(matchingSelections),
      };
    }

    if (q.type === "drag_drop" && q.dragDropItems) {
      const allCorrect = q.dragDropItems.every(
        (item) => dragDropBuckets[item.id] === item.category
      );
      return {
        isCorrect: allCorrect,
        answerDisplay: JSON.stringify(dragDropBuckets),
      };
    }

    return {
      isCorrect: selectedOption === q.correctAnswer,
      answerDisplay: selectedOption,
    };
  };

  const handleSubmit = () => {
    if (submittedResult) return;
    const { isCorrect, answerDisplay } = evaluateAnswer();
    const elapsedSeconds = Math.max(
      3,
      Math.round((Date.now() - questionStartTime) / 1000)
    );

    const res = recordQuestionAttempt({
      skillId: currentSkill.id,
      questionId: currentQuestion.id,
      selectedAnswer: answerDisplay || "Answered",
      isCorrect,
      timeSpentSeconds: elapsedSeconds,
      usedHint: showHint,
    });

    setSubmittedResult({
      isCorrect,
      delta: res.delta,
      streakBonus: res.streakBonusAwarded,
      smartScoreAfter: res.smartScoreAfter,
      earnedBadges: res.newlyEarnedBadges.map((b) => b.title),
    });

    if (student.accessibility.audioInstructions) {
      if (isCorrect) {
        speakText(
          `Awesome job! Correct answer! Your SmartScore is now ${res.smartScoreAfter}.`
        );
      } else {
        speakText(
          `Not quite! Let's look at the step-by-step worked explanation together.`
        );
      }
    }
  };

  const handleNextQuestion = () => {
    setQuestionIndex((prev) => prev + 1);
  };

  const handleExplainProblem = async () => {
    setLoadingAi(true);
    try {
      const response = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "explain_problem",
          questionPrompt: currentQuestion.prompt,
          correctAnswer: currentQuestion.correctAnswer,
          workedExplanation: currentQuestion.workedExplanation,
          teks: currentQuestion.teks,
          skillTitle: currentSkill.title,
          enableAiClientFlag: enableAi,
        }),
      });
      const data = await response.json();
      setAiExplanation(data.explanation);
    } catch {
      setAiExplanation(
        `🌟 **Step-by-Step Guide (TEKS ${currentQuestion.teks})**: ${currentQuestion.workedExplanation}`
      );
    } finally {
      setLoadingAi(false);
    }
  };

  const canSubmit = () => {
    if (
      currentQuestion.type === "multiple_choice" ||
      currentQuestion.type === "reading_comprehension" ||
      currentQuestion.type === "vocabulary"
    ) {
      return Boolean(selectedOption);
    }
    if (currentQuestion.type === "fill_blank") {
      return Boolean(fillBlankInput.trim());
    }
    if (currentQuestion.type === "sequencing") {
      return sequenceOrder.length > 0;
    }
    if (currentQuestion.type === "matching") {
      return Object.values(matchingSelections).every((v) => Boolean(v));
    }
    if (currentQuestion.type === "drag_drop") {
      return Object.values(dragDropBuckets).every((v) => Boolean(v));
    }
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Top Skill Selector & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-extrabold text-white">
              Skill {currentSkill.code}
            </span>
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              TEKS {currentSkill.teks}
            </span>
            {currentUnit && (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {currentUnit.code}: {currentUnit.title}
              </span>
            )}
          </div>
          <h2 className="mt-1.5 text-xl font-extrabold text-slate-900 dark:text-white">
            {currentSkill.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {currentSkill.description}
          </p>
        </div>

        {/* Switch Skill Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={currentSkill.id}
            onChange={(e) => startSkillPractice(e.target.value)}
            aria-label="Select Bluebonnet Grade 3 Skill"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                [{s.code}] {s.title} (SmartScore: {progress[s.id]?.smartScore || 0})
              </option>
            ))}
          </select>

          {currentLesson && (
            <button
              onClick={() => openLesson(currentLesson.id)}
              className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300"
            >
              <BookOpen className="h-4 w-4" />
              <span>7-Part Lesson</span>
            </button>
          )}
        </div>
      </div>

      {/* Deterministic Adaptive Learning Alert Banner (Triggers when Mastery < 60) */}
      {(skillProgress.smartScore < 60 && skillProgress.attemptsCount >= 2) && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/90 p-5 dark:border-amber-800 dark:bg-amber-950/40">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-amber-500 p-2.5 text-white">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-amber-950 dark:text-amber-200">
                    Adaptive Learning Path Active (Mastery {skillProgress.smartScore}/100 &lt; 60)
                  </h3>
                  <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                    100% Rule-Based • Zero AI Cost
                  </span>
                </div>
                <p className="mt-1 text-xs text-amber-900 dark:text-amber-300">
                  Let&apos;s build confidence step-by-step! Review the worked example below or practice the recommended prerequisite skill before your scheduled retest.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowWorkedExample(true)}
                className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-amber-900 shadow-sm hover:bg-amber-100 dark:bg-slate-800 dark:text-amber-200"
              >
                📖 View Worked Example
              </button>
              {easierSkill && (
                <button
                  onClick={() => startSkillPractice(easierSkill.id)}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-700"
                >
                  <span>Practice Easier Skill ({easierSkill.code})</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Left Question Arena (8 cols) + Right IXL SmartScore Sidebar (4 cols) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Question Arena */}
        <div className="space-y-4 lg:col-span-8">
          {/* Worked Example Collapsible Drawer */}
          {showWorkedExample && (
            <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/70 p-5 dark:border-indigo-900 dark:bg-indigo-950/40">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-extrabold text-indigo-950 dark:text-indigo-200">
                  <BookOpen className="h-4 w-4 text-indigo-600" />
                  <span>Worked Example: {currentSkill.workedExample.title}</span>
                </h3>
                <button
                  onClick={() => setShowWorkedExample(false)}
                  className="text-xs font-bold text-indigo-700 hover:underline dark:text-indigo-300"
                >
                  Hide Example
                </button>
              </div>
              <p className="mt-2 rounded-xl bg-white p-3 text-sm font-semibold text-slate-800 dark:bg-slate-900 dark:text-slate-200">
                <strong>Problem:</strong> {currentSkill.workedExample.problem}
              </p>
              <ol className="mt-3 list-inside list-decimal space-y-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                {currentSkill.workedExample.steps.map((step, i) => (
                  <li key={i} className="rounded-lg bg-white/80 px-3 py-1.5 dark:bg-slate-900/70">
                    {step}
                  </li>
                ))}
              </ol>
              <div className="mt-3 rounded-xl bg-emerald-100/80 px-3.5 py-2 text-xs font-extrabold text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
                ✅ Solution: {currentSkill.workedExample.solution}
              </div>
            </div>
          )}

          {/* Question Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* Question Metadata Bar */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {currentQuestion.type.replace("_", " ")}
                </span>
                {currentQuestion.readingSubType && (
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    Reading Skill: {currentQuestion.readingSubType}
                  </span>
                )}
                {currentQuestion.foundationalActivityType && (
                  <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                    Phonics Lab: {currentQuestion.foundationalActivityType}
                  </span>
                )}
                <span className="text-xs font-semibold text-slate-400">
                  Question {(questionIndex % skillQuestions.length) + 1} of{" "}
                  {skillQuestions.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    speakText(
                      `${currentQuestion.passageExcerpt ? currentQuestion.passageExcerpt + ". " : ""}${currentQuestion.prompt}`
                    )
                  }
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
                >
                  <Volume2 className="h-4 w-4" />
                  <span>Read Aloud</span>
                </button>
                <button
                  onClick={() => setShowWorkedExample(!showWorkedExample)}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Worked Example</span>
                </button>
              </div>
            </div>

            {/* Optional Reading Excerpt Box */}
            {currentQuestion.passageExcerpt && (
              <div className="mb-5 rounded-2xl border-l-4 border-indigo-500 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
                <div className="mb-1 text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  📖 Bluebonnet Reader Excerpt
                </div>
                <p className="italic">&ldquo;{currentQuestion.passageExcerpt}&rdquo;</p>
              </div>
            )}

            {/* Question Prompt */}
            <h3 className="mb-5 text-lg font-extrabold leading-snug text-slate-900 dark:text-white">
              {currentQuestion.prompt}
            </h3>

            {/* Question Input Renderer by QuestionType */}
            {/* 1. Multiple Choice / Reading Comprehension / Vocabulary */}
            {(currentQuestion.type === "multiple_choice" ||
              currentQuestion.type === "reading_comprehension" ||
              currentQuestion.type === "vocabulary") &&
              currentQuestion.options && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = selectedOption === opt;
                    const isCorrectOpt =
                      submittedResult && opt === currentQuestion.correctAnswer;
                    const isWrongSelected =
                      submittedResult && isSelected && !submittedResult.isCorrect;

                    return (
                      <button
                        key={idx}
                        disabled={Boolean(submittedResult)}
                        onClick={() => setSelectedOption(opt)}
                        className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left text-sm font-bold transition ${
                          isCorrectOpt
                            ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200"
                            : isWrongSelected
                              ? "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/50 dark:text-rose-200"
                              : isSelected
                                ? "border-indigo-600 bg-indigo-50 text-indigo-950 shadow-sm dark:bg-indigo-950/60 dark:text-indigo-200"
                                : "border-slate-200 bg-slate-50/70 text-slate-800 hover:border-indigo-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
                        }`}
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-extrabold text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

            {/* 2. Fill in the Blank */}
            {currentQuestion.type === "fill_blank" && (
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Type Your Answer:
                </label>
                <input
                  type="text"
                  disabled={Boolean(submittedResult)}
                  value={fillBlankInput}
                  onChange={(e) => setFillBlankInput(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full max-w-md rounded-2xl border-2 border-indigo-200 bg-slate-50 px-4 py-3 text-base font-bold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            )}

            {/* 3. Sequencing */}
            {currentQuestion.type === "sequencing" && (
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Use the Up and Down arrows to arrange the events or steps in the exact order:
                </p>
                {sequenceOrder.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-extrabold text-white">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {item}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0 || Boolean(submittedResult)}
                        onClick={() => moveSequenceItem(idx, "up")}
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                        aria-label="Move step up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled={
                          idx === sequenceOrder.length - 1 || Boolean(submittedResult)
                        }
                        onClick={() => moveSequenceItem(idx, "down")}
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                        aria-label="Move step down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Matching */}
            {currentQuestion.type === "matching" &&
              currentQuestion.matchingPairs && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-500">
                    Match each item on the left with its partner on the right:
                  </p>
                  {currentQuestion.matchingPairs.map((pair, idx) => (
                    <div
                      key={idx}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-800"
                    >
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {pair.left}
                      </span>
                      <select
                        disabled={Boolean(submittedResult)}
                        value={matchingSelections[pair.left] || ""}
                        onChange={(e) =>
                          setMatchingSelections((prev) => ({
                            ...prev,
                            [pair.left]: e.target.value,
                          }))
                        }
                        className="rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      >
                        <option value="">Select match...</option>
                        {currentQuestion.matchingPairs?.map((p, i) => (
                          <option key={i} value={p.right}>
                            {p.right}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}

            {/* 5. Drag and Drop Categorization */}
            {currentQuestion.type === "drag_drop" &&
              currentQuestion.dragDropItems &&
              currentQuestion.dragDropCategories && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-500">
                    Sort each item into the correct Bluebonnet category bucket:
                  </p>
                  {currentQuestion.dragDropItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-800"
                    >
                      <span className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                        <Layers className="h-4 w-4 text-indigo-500" />
                        {item.label}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {currentQuestion.dragDropCategories?.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            disabled={Boolean(submittedResult)}
                            onClick={() =>
                              setDragDropBuckets((prev) => ({
                                ...prev,
                                [item.id]: cat,
                              }))
                            }
                            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                              dragDropBuckets[item.id] === cat
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "bg-white text-slate-700 hover:bg-indigo-50 dark:bg-slate-900 dark:text-slate-300"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            {/* Hint Box */}
            {showHint && (
              <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                <Lightbulb className="h-4 w-4 shrink-0 text-amber-500" />
                <div>
                  <strong>Bluebonnet Hint:</strong> {currentQuestion.hint}
                </div>
              </div>
            )}

            {/* Action Bar: Submit / Next / Hint / Optional AI Explain */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                >
                  <Lightbulb className="h-4 w-4" />
                  <span>{showHint ? "Hide Hint" : "Need a Hint?"}</span>
                </button>

                {/* Optional AI Feature: "Explain This Problem" button */}
                <button
                  type="button"
                  onClick={handleExplainProblem}
                  disabled={loadingAi}
                  className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-2 text-xs font-bold text-purple-700 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>
                    {loadingAi
                      ? "Thinking..."
                      : enableAi
                        ? "Explain This Problem (AI Tutor)"
                        : "Explain This Problem (Step-by-Step)"}
                  </span>
                </button>
              </div>

              {!submittedResult ? (
                <button
                  type="button"
                  disabled={!canSubmit()}
                  onClick={handleSubmit}
                  className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-2.5 text-sm font-extrabold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-700 disabled:opacity-40"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Submit Answer</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-extrabold text-white shadow-md shadow-emerald-500/20 transition hover:bg-emerald-700"
                >
                  <span>Next Question</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Post-Submission Feedback & Worked Explanation */}
            {submittedResult && (
              <div
                className={`mt-5 rounded-2xl border-2 p-5 ${
                  submittedResult.isCorrect
                    ? "border-emerald-300 bg-emerald-50/90 dark:border-emerald-800 dark:bg-emerald-950/40"
                    : "border-rose-300 bg-rose-50/90 dark:border-rose-800 dark:bg-rose-950/40"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {submittedResult.isCorrect ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-rose-600" />
                    )}
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      {submittedResult.isCorrect
                        ? "Terrific Job! That is Correct!"
                        : `Keep Trying! Correct Answer: ${currentQuestion.correctAnswer}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                        submittedResult.delta >= 0
                          ? "bg-emerald-200 text-emerald-900"
                          : "bg-rose-200 text-rose-900"
                      }`}
                    >
                      SmartScore {submittedResult.delta >= 0 ? `+${submittedResult.delta}` : submittedResult.delta} (
                      {submittedResult.smartScoreAfter}/100)
                    </span>
                    {submittedResult.streakBonus && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-300 px-3 py-1 text-xs font-extrabold text-amber-950">
                        <Flame className="h-3.5 w-3.5 fill-orange-600" /> 3-In-A-Row Bonus (+2)!
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                  <strong>Curriculum Explanation:</strong>{" "}
                  {currentQuestion.workedExplanation}
                </p>

                {submittedResult.earnedBadges.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-100 p-3 text-xs font-extrabold text-amber-900">
                    <Award className="h-5 w-5 text-amber-600" />
                    <span>
                      🎉 New Badge Unlocked: {submittedResult.earnedBadges.join(", ")}!
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Optional AI / Step-by-Step Tutor Output Box */}
            {aiExplanation && (
              <div className="mt-4 rounded-2xl border border-purple-200 bg-purple-50/80 p-4 text-xs leading-relaxed text-purple-950 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-200">
                <div className="mb-1 flex items-center justify-between font-extrabold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    Bluebonnet Grade 3 Tutor Explanation
                  </span>
                  <button
                    onClick={() => speakText(aiExplanation)}
                    className="text-purple-700 underline dark:text-purple-300"
                  >
                    🔊 Listen
                  </button>
                </div>
                <div className="whitespace-pre-line">{aiExplanation}</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: IXL-Style SmartScore Meter & Mastery Rules */}
        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                IXL SmartScore Meter
              </span>
              <span
                className={`rounded-full border px-3 py-0.5 text-xs font-extrabold ${getSmartScoreColor(
                  skillProgress.smartScore
                )}`}
              >
                {getSmartScoreLevel(skillProgress.smartScore)}
              </span>
            </div>

            <div className="my-4 flex items-baseline justify-center gap-1">
              <span className="text-5xl font-black text-indigo-600 dark:text-indigo-400">
                {skillProgress.smartScore}
              </span>
              <span className="text-lg font-bold text-slate-400">/ 100</span>
            </div>

            {/* Progress Bar */}
            <div className="h-3.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-indigo-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${skillProgress.smartScore}%` }}
              />
            </div>

            {/* 4 SmartScore Bands */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-bold">
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-2 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
                0–20: Beginner
              </div>
              <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-2 text-sky-800 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-300">
                21–50: Developing
              </div>
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-2 text-indigo-800 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300">
                51–80: Proficient
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-2 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                81–100: Mastered
              </div>
            </div>

            {/* Current Streak & Scoring Rules */}
            <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-3.5 text-xs dark:bg-slate-800/60">
              <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-200">
                <span>Consecutive Correct:</span>
                <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                  <Flame className="h-4 w-4 fill-orange-500" />
                  {skillProgress.consecutiveCorrect} in a row
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Correct Answer:</span>
                <span className="font-bold text-emerald-600">+5 pts</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>3 Consecutive Correct:</span>
                <span className="font-bold text-amber-600">+2 bonus pts</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Wrong Answer:</span>
                <span className="font-bold text-rose-600">-3 pts</span>
              </div>
            </div>

            {/* Mini Assessment Summary */}
            <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-3.5 text-xs dark:border-indigo-900/50 dark:bg-indigo-950/30">
              <div className="font-extrabold text-indigo-900 dark:text-indigo-300">
                🎯 Mini-Assessment Target
              </div>
              <p className="mt-1 text-slate-600 dark:text-slate-300">
                {currentSkill.miniAssessmentSummary}
              </p>
            </div>

            <button
              onClick={() => setQuestionIndex((prev) => prev + 1)}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Try Another Question Variant</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

