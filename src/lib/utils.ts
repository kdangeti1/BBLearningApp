import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SmartScoreLevel } from "@/types/curriculum";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Exact IXL-style SmartScore calculation required by platform specification:
 * - Score Range: 0 - 100
 * - Correct Answer = +5 points
 * - 3 Consecutive Correct = +2 bonus points
 * - Wrong Answer = -3 points
 */
export function calculateSmartScore(
  currentScore: number,
  isCorrect: boolean,
  newConsecutiveCorrect: number
): { nextScore: number; delta: number; streakBonusAwarded: boolean } {
  if (isCorrect) {
    const streakBonusAwarded =
      newConsecutiveCorrect > 0 && newConsecutiveCorrect % 3 === 0;
    const delta = 5 + (streakBonusAwarded ? 2 : 0);
    const nextScore = Math.min(100, currentScore + delta);
    return { nextScore, delta, streakBonusAwarded };
  } else {
    const delta = -3;
    const nextScore = Math.max(0, currentScore + delta);
    return { nextScore, delta, streakBonusAwarded: false };
  }
}

/**
 * SmartScore Mastery Level Bands:
 * - 0–20: Beginner
 * - 21–50: Developing
 * - 51–80: Proficient
 * - 81–100: Mastered
 */
export function getSmartScoreLevel(score: number): SmartScoreLevel {
  if (score <= 20) return "Beginner";
  if (score <= 50) return "Developing";
  if (score <= 80) return "Proficient";
  return "Mastered";
}

export function getSmartScoreColor(score: number): string {
  if (score <= 20) return "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800";
  if (score <= 50) return "text-sky-600 bg-sky-50 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800";
  if (score <= 80) return "text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800";
  return "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800";
}

/**
 * Browser-native Web Speech API Text-to-Speech (100% Free Tier, works offline).
 */
export function speakText(text: string, rate = 0.92) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[_*#`~]/g, " ");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;
    utterance.pitch = 1.05;
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("Speech synthesis unavailable:", err);
  }
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
}

