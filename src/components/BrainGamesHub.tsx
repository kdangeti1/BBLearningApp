"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLearningStore } from "@/store/useLearningStore";
import { speakText } from "@/lib/utils";
import {
  Sparkles,
  Trophy,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Brain,
  Hash,
  Shuffle,
  Volume2,
} from "lucide-react";

// Web Audio celebratory chime for puzzle victories
function playVictoryChime() {
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
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + idx * 0.12 + 0.35
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.4);
    });
  } catch {
    // Audio context unavailable or blocked
  }
}

/* =====================================================================
   KENKEN / MATHDOKU TYPES & DATA
   ===================================================================== */
export interface KenKenCage {
  id: string;
  target: number;
  op: "+" | "-" | "×" | "÷" | "=";
  cells: [number, number][]; // [row, col]
  color: string;
}

export interface KenKenLevel {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Expert";
  size: 3 | 4;
  description: string;
  solution: number[][];
  cages: KenKenCage[];
  freebies?: { row: number; col: number; val: number }[];
}

export const KENKEN_LEVELS: KenKenLevel[] = [
  // Level 1: 3x3 Beginner (Addition only)
  {
    id: "kenken-1",
    title: "Sunny Meadow (3x3 Addition)",
    difficulty: "Beginner",
    size: 3,
    description: "Use digits 1, 2, and 3. Each row and column must contain 1, 2, 3 without repeating!",
    solution: [
      [1, 2, 3],
      [2, 3, 1],
      [3, 1, 2],
    ],
    cages: [
      { id: "c1", target: 3, op: "+", cells: [[0, 0], [0, 1]], color: "#fef3c7" },
      { id: "c2", target: 4, op: "+", cells: [[0, 2], [1, 2]], color: "#e0e7ff" },
      { id: "c3", target: 5, op: "+", cells: [[1, 0], [2, 0]], color: "#dcfce7" },
      { id: "c4", target: 3, op: "=", cells: [[1, 1]], color: "#fce7f3" },
      { id: "c5", target: 3, op: "+", cells: [[2, 1], [2, 2]], color: "#ffedd5" },
    ],
    freebies: [{ row: 1, col: 1, val: 3 }],
  },

  // Level 2: 3x3 Forest Explorer (Addition & Subtraction)
  {
    id: "kenken-2",
    title: "Forest Explorer (3x3 Add & Subtract)",
    difficulty: "Beginner",
    size: 3,
    description: "Use digits 1, 2, 3. The '-' symbol means the difference between the 2 numbers.",
    solution: [
      [2, 1, 3],
      [3, 2, 1],
      [1, 3, 2],
    ],
    cages: [
      { id: "c1", target: 1, op: "-", cells: [[0, 0], [1, 0]], color: "#dbeafe" },
      { id: "c2", target: 4, op: "+", cells: [[0, 1], [0, 2]], color: "#fef3c7" },
      { id: "c3", target: 5, op: "+", cells: [[1, 1], [2, 1]], color: "#dcfce7" },
      { id: "c4", target: 1, op: "-", cells: [[1, 2], [2, 2]], color: "#fce7f3" },
      { id: "c5", target: 1, op: "=", cells: [[2, 0]], color: "#ffedd5" },
    ],
    freebies: [{ row: 2, col: 0, val: 1 }],
  },

  // Level 3: 3x3 Mountain Peak (Multiplication & Division)
  {
    id: "kenken-3",
    title: "Mountain Peak (3x3 Multiply & Divide)",
    difficulty: "Intermediate",
    size: 3,
    description: "Multiply factors or divide pairs to reach each cage's target!",
    solution: [
      [3, 1, 2],
      [1, 2, 3],
      [2, 3, 1],
    ],
    cages: [
      { id: "c1", target: 3, op: "×", cells: [[0, 0], [1, 0]], color: "#fef3c7" },
      { id: "c2", target: 2, op: "×", cells: [[0, 1], [0, 2]], color: "#e0e7ff" },
      { id: "c3", target: 6, op: "×", cells: [[1, 1], [1, 2]], color: "#dcfce7" },
      { id: "c4", target: 1, op: "-", cells: [[2, 0], [2, 1]], color: "#fce7f3" },
      { id: "c5", target: 1, op: "=", cells: [[2, 2]], color: "#ffedd5" },
    ],
    freebies: [{ row: 2, col: 2, val: 1 }],
  },

  // Level 4: 4x4 Space Odyssey (All 4 Operations)
  {
    id: "kenken-4",
    title: "Space Odyssey (4x4 All Operations)",
    difficulty: "Intermediate",
    size: 4,
    description: "Use digits 1, 2, 3, and 4. All four Grade 3 operations (+, -, ×, ÷) are active!",
    solution: [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1],
    ],
    cages: [
      { id: "c1", target: 3, op: "×", cells: [[0, 0], [1, 0]], color: "#fef3c7" },
      { id: "c2", target: 5, op: "+", cells: [[0, 1], [0, 2]], color: "#e0e7ff" },
      { id: "c3", target: 2, op: "÷", cells: [[0, 3], [1, 3]], color: "#dcfce7" },
      { id: "c4", target: 3, op: "-", cells: [[1, 1], [1, 2]], color: "#fce7f3" },
      { id: "c5", target: 2, op: "÷", cells: [[2, 0], [3, 0]], color: "#ffedd5" },
      { id: "c6", target: 2, op: "-", cells: [[2, 1], [3, 1]], color: "#e0f2fe" },
      { id: "c7", target: 12, op: "×", cells: [[2, 2], [2, 3]], color: "#f3e8ff" },
      { id: "c8", target: 1, op: "-", cells: [[3, 2], [3, 3]], color: "#ecfdf5" },
    ],
  },

  // Level 5: 4x4 Bluebonnet Master
  {
    id: "kenken-5",
    title: "Texas Bluebonnet Master (4x4 Challenge)",
    difficulty: "Expert",
    size: 4,
    description: "The ultimate Grade 3 logic challenge! Think carefully about rows, columns, and cages.",
    solution: [
      [2, 4, 1, 3],
      [4, 2, 3, 1],
      [1, 3, 2, 4],
      [3, 1, 4, 2],
    ],
    cages: [
      { id: "c1", target: 8, op: "×", cells: [[0, 0], [0, 1]], color: "#fef3c7" },
      { id: "c2", target: 3, op: "×", cells: [[0, 2], [1, 2]], color: "#e0e7ff" },
      { id: "c3", target: 2, op: "-", cells: [[0, 3], [1, 3]], color: "#dcfce7" },
      { id: "c4", target: 5, op: "+", cells: [[1, 0], [2, 0]], color: "#fce7f3" },
      { id: "c5", target: 6, op: "×", cells: [[1, 1], [2, 1]], color: "#ffedd5" },
      { id: "c6", target: 2, op: "÷", cells: [[2, 2], [3, 2]], color: "#e0f2fe" },
      { id: "c7", target: 2, op: "-", cells: [[2, 3], [3, 3]], color: "#f3e8ff" },
      { id: "c8", target: 4, op: "+", cells: [[3, 0], [3, 1]], color: "#ecfdf5" },
    ],
  },
];

/* =====================================================================
   WORD LADDER (MORPH) DATA
   ===================================================================== */
export interface WordLadderPuzzle {
  id: string;
  title: string;
  startWord: string;
  targetWord: string;
  rungs: {
    clue: string;
    answer: string;
  }[];
}

export const WORD_LADDER_PUZZLES: WordLadderPuzzle[] = [
  {
    id: "ladder-1",
    title: "Puppy Path (3-Letter Ladder)",
    startWord: "CAT",
    targetWord: "DOG",
    rungs: [
      { clue: "A small bed for a baby or toddler", answer: "COT" },
      { clue: "A tiny round mark, like at the end of a sentence", answer: "DOT" },
      { clue: "A loyal pet that barks and wags its tail", answer: "DOG" },
    ],
  },
  {
    id: "ladder-2",
    title: "Weather Morph (4-Letter Ladder)",
    startWord: "COLD",
    targetWord: "WARM",
    rungs: [
      { clue: "A thick rope, wire, or string", answer: "CORD" },
      { clue: "A unit of language spoken or written", answer: "WORD" },
      { clue: "A little creature that wriggles in garden soil", answer: "WORM" },
      { clue: "Not cold, comfortable and cozy like sunshine", answer: "WARM" },
    ],
  },
  {
    id: "ladder-3",
    title: "Ocean Voyage",
    startWord: "FISH",
    targetWord: "WASH",
    rungs: [
      { clue: "Something you make when blowing out birthday candles", answer: "WISH" },
      { clue: "To clean with soap and water", answer: "WASH" },
    ],
  },
];

/* =====================================================================
   PATTERN DETECTIVE DATA
   ===================================================================== */
export interface PatternPuzzle {
  id: string;
  title: string;
  sequence: string[];
  options: string[];
  correctAnswer: string;
  ruleExplanation: string;
}

export const PATTERN_PUZZLES: PatternPuzzle[] = [
  {
    id: "pat-1",
    title: "Skip Counting Stars",
    sequence: ["6", "12", "18", "24", "?"],
    options: ["28", "30", "32", "36"],
    correctAnswer: "30",
    ruleExplanation: "Skip counting by 6s (+6 each step): 6, 12, 18, 24, 30!",
  },
  {
    id: "pat-2",
    title: "Geometric Shape Parade",
    sequence: ["🔺", "🔷", "🔺", "🔷", "🔷", "🔺", "🔷", "🔷", "?"],
    options: ["🔺", "🔷", "⭐", "🟣"],
    correctAnswer: "🔷",
    ruleExplanation: "Growing pattern: 1 triangle + 1 diamond, 1 triangle + 2 diamonds, 1 triangle + 3 diamonds (so another 🔷)!",
  },
  {
    id: "pat-3",
    title: "Power Multiplication Leap",
    sequence: ["3", "6", "12", "24", "?"],
    options: ["36", "48", "30", "42"],
    correctAnswer: "48",
    ruleExplanation: "Doubling rule (×2 each step): 3 × 2 = 6, 6 × 2 = 12, 12 × 2 = 24, 24 × 2 = 48!",
  },
];

/* =====================================================================
   MAIN COMPONENT: BRAIN GAMES HUB
   ===================================================================== */
export function BrainGamesHub() {
  const { student, addBrainGameReward } = useLearningStore();

  const [activeGame, setActiveGame] = useState<"kenken" | "wordladder" | "pattern">("kenken");

  // KenKen State
  const [kenkenLevelIdx, setKenkenLevelIdx] = useState(0);
  const currentKenken = KENKEN_LEVELS[kenkenLevelIdx];
  const [gridValues, setGridValues] = useState<number[][]>(() =>
    Array(currentKenken.size)
      .fill(0)
      .map(() => Array(currentKenken.size).fill(0))
  );
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>([0, 0]);
  const [kenkenSolved, setKenkenSolved] = useState(false);
  const [showKenkenRules, setShowKenkenRules] = useState(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  // Initialize KenKen puzzle when level changes
  useEffect(() => {
    const fresh = Array(currentKenken.size)
      .fill(0)
      .map(() => Array(currentKenken.size).fill(0));
    if (currentKenken.freebies) {
      currentKenken.freebies.forEach((f) => {
        fresh[f.row][f.col] = f.val;
      });
    }
    setGridValues(fresh);
    setSelectedCell([0, 0]);
    setKenkenSolved(false);
    setHintMessage(null);
  }, [kenkenLevelIdx, currentKenken]);

  // Word Ladder State
  const [ladderIdx, setLadderIdx] = useState(0);
  const currentLadder = WORD_LADDER_PUZZLES[ladderIdx];
  const [ladderGuesses, setLadderGuesses] = useState<string[]>(() =>
    Array(currentLadder.rungs.length).fill("")
  );
  const [ladderSolved, setLadderSolved] = useState(false);

  useEffect(() => {
    setLadderGuesses(Array(currentLadder.rungs.length).fill(""));
    setLadderSolved(false);
  }, [ladderIdx, currentLadder]);

  // Pattern Detective State
  const [patternIdx, setPatternIdx] = useState(0);
  const currentPattern = PATTERN_PUZZLES[patternIdx];
  const [selectedPatternOption, setSelectedPatternOption] = useState<string | null>(null);
  const [patternSolved, setPatternSolved] = useState(false);

  useEffect(() => {
    setSelectedPatternOption(null);
    setPatternSolved(false);
  }, [patternIdx]);

  // Check KenKen Cage Validity
  const checkCage = useCallback((cage: KenKenCage, grid: number[][]): boolean => {
    const vals = cage.cells.map(([r, c]) => grid[r][c]);
    if (vals.some((v) => v === 0)) return true; // not fully filled yet

    if (cage.op === "=") {
      return vals[0] === cage.target;
    }
    if (cage.op === "+") {
      const sum = vals.reduce((a, b) => a + b, 0);
      return sum === cage.target;
    }
    if (cage.op === "×") {
      const prod = vals.reduce((a, b) => a * b, 1);
      return prod === cage.target;
    }
    if (cage.op === "-") {
      if (vals.length !== 2) return false;
      return Math.abs(vals[0] - vals[1]) === cage.target;
    }
    if (cage.op === "÷") {
      if (vals.length !== 2) return false;
      const max = Math.max(vals[0], vals[1]);
      const min = Math.min(vals[0], vals[1]);
      return min > 0 && max / min === cage.target;
    }
    return true;
  }, []);

  // Validate entire KenKen board
  const checkKenKenSolution = useCallback((grid: number[][]) => {
    const N = currentKenken.size;
    // Check if fully filled
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (grid[r][c] === 0) return false;
      }
    }
    // Check Rows
    for (let r = 0; r < N; r++) {
      const rowSet = new Set<number>();
      for (let c = 0; c < N; c++) {
        rowSet.add(grid[r][c]);
      }
      if (rowSet.size !== N) return false;
    }
    // Check Columns
    for (let c = 0; c < N; c++) {
      const colSet = new Set<number>();
      for (let r = 0; r < N; r++) {
        colSet.add(grid[r][c]);
      }
      if (colSet.size !== N) return false;
    }
    // Check all cages
    for (const cage of currentKenken.cages) {
      if (!checkCage(cage, grid)) return false;
    }
    return true;
  }, [currentKenken, checkCage]);

  // Handle digit input in KenKen
  const handleInputDigit = useCallback((digit: number) => {
    if (kenkenSolved || !selectedCell) return;
    const [r, c] = selectedCell;

    const copy = gridValues.map((row) => [...row]);
    copy[r][c] = digit;
    setGridValues(copy);

    if (checkKenKenSolution(copy)) {
      setKenkenSolved(true);
      playVictoryChime();
      addBrainGameReward(40, 15, 1);
      speakText("Awesome job! You solved the KenKen puzzle!");
    }
  }, [kenkenSolved, selectedCell, gridValues, checkKenKenSolution, addBrainGameReward]);

  // Clear current cell
  const handleClearCell = () => {
    if (kenkenSolved || !selectedCell) return;
    const [r, c] = selectedCell;
    const copy = gridValues.map((row) => [...row]);
    copy[r][c] = 0;
    setGridValues(copy);
  };

  // Keyboard controls for KenKen
  useEffect(() => {
    if (activeGame !== "kenken") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "1" && Number(e.key) <= currentKenken.size) {
        handleInputDigit(Number(e.key));
      } else if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
        handleClearCell();
      } else if (e.key === "ArrowUp" && selectedCell && selectedCell[0] > 0) {
        setSelectedCell([selectedCell[0] - 1, selectedCell[1]]);
      } else if (
        e.key === "ArrowDown" &&
        selectedCell &&
        selectedCell[0] < currentKenken.size - 1
      ) {
        setSelectedCell([selectedCell[0] + 1, selectedCell[1]]);
      } else if (e.key === "ArrowLeft" && selectedCell && selectedCell[1] > 0) {
        setSelectedCell([selectedCell[0], selectedCell[1] - 1]);
      } else if (
        e.key === "ArrowRight" &&
        selectedCell &&
        selectedCell[1] < currentKenken.size - 1
      ) {
        setSelectedCell([selectedCell[0], selectedCell[1] + 1]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeGame, currentKenken.size, selectedCell, handleInputDigit]);

  // Find cage for a cell
  const getCageForCell = useCallback((r: number, c: number) => {
    return currentKenken.cages.find((cage) =>
      cage.cells.some(([cr, cc]) => cr === r && cc === c)
    );
  }, [currentKenken]);

  // Identify top-left cell of cage to show the target math label
  const isTopLeftOfCage = useCallback((r: number, c: number, cage: KenKenCage) => {
    const sorted = [...cage.cells].sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));
    return sorted[0][0] === r && sorted[0][1] === c;
  }, []);

  // KenKen Hint
  const handleKenKenHint = () => {
    const N = currentKenken.size;
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (gridValues[r][c] !== currentKenken.solution[r][c]) {
          const copy = gridValues.map((row) => [...row]);
          copy[r][c] = currentKenken.solution[r][c];
          setGridValues(copy);
          setSelectedCell([r, c]);
          setHintMessage(
            `💡 Hint revealed: Row ${r + 1}, Col ${c + 1} is ${currentKenken.solution[r][c]}!`
          );
          if (checkKenKenSolution(copy)) {
            setKenkenSolved(true);
            playVictoryChime();
            addBrainGameReward(25, 10, 1);
          }
          return;
        }
      }
    }
  };

  // Word Ladder submission check
  const handleCheckLadder = () => {
    const isAllCorrect = currentLadder.rungs.every(
      (rung, i) => ladderGuesses[i].trim().toUpperCase() === rung.answer.toUpperCase()
    );
    if (isAllCorrect) {
      setLadderSolved(true);
      playVictoryChime();
      addBrainGameReward(35, 15, 1);
      speakText(`Splendid! You completed the ${currentLadder.title} Word Ladder!`);
    }
  };

  // Pattern Detective option click
  const handleSelectPatternOption = (opt: string) => {
    setSelectedPatternOption(opt);
    if (opt === currentPattern.correctAnswer) {
      setPatternSolved(true);
      playVictoryChime();
      addBrainGameReward(30, 10, 1);
      speakText("Correct pattern found! Great thinking!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-extrabold">
              <span>🧩 Brain Break & Relaxation Zone</span>
              <span>•</span>
              <span>Grade 3 Thinking Games</span>
            </div>
            <h2 className="mt-3 text-2xl font-black sm:text-3xl">
              Fun Logic Puzzles & Relaxation
            </h2>
            <p className="mt-1.5 text-sm text-amber-50">
              Sharpen your arithmetic, problem-solving, and vocabulary thinking with KenKen MathDoku, Word Ladders, and Logic Patterns!
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-3 text-xs font-bold backdrop-blur-md">
            <span>{student.avatar} {student.name}</span>
            <span>•</span>
            <span className="text-amber-200">Earn +XP & Treasure Coins for every solved puzzle!</span>
          </div>
        </div>

        {/* Game Mode Switcher Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveGame("kenken")}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition ${
              activeGame === "kenken"
                ? "bg-white text-slate-900 shadow-md"
                : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            <Hash className="h-4 w-4" />
            <span>1. KenKen MathDoku (Puzzles 1–5)</span>
          </button>

          <button
            onClick={() => setActiveGame("wordladder")}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition ${
              activeGame === "wordladder"
                ? "bg-white text-slate-900 shadow-md"
                : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            <Shuffle className="h-4 w-4" />
            <span>2. Word Ladder (Morph Puzzles)</span>
          </button>

          <button
            onClick={() => setActiveGame("pattern")}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition ${
              activeGame === "pattern"
                ? "bg-white text-slate-900 shadow-md"
                : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            <Brain className="h-4 w-4" />
            <span>3. Pattern Detective</span>
          </button>
        </div>
      </div>

      {/* ===============================================================
          GAME 1: KENKEN / MATHDOKU PUZZLE ARENA
         =============================================================== */}
      {activeGame === "kenken" && (
        <div className="space-y-6">
          {/* Level Switcher & Rules Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Puzzles:
              </span>
              {KENKEN_LEVELS.map((lvl, idx) => (
                <button
                  key={lvl.id}
                  onClick={() => setKenkenLevelIdx(idx)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition ${
                    kenkenLevelIdx === idx
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                >
                  Puzzle {idx + 1} ({lvl.size}×{lvl.size})
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowKenkenRules(!showKenkenRules)}
                className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
              >
                <HelpCircle className="h-4 w-4" />
                <span>How to Play</span>
              </button>
              <button
                onClick={handleKenKenHint}
                className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300"
              >
                <Lightbulb className="h-4 w-4" />
                <span>Hint</span>
              </button>
              <button
                onClick={() => {
                  const fresh = Array(currentKenken.size)
                    .fill(0)
                    .map(() => Array(currentKenken.size).fill(0));
                  if (currentKenken.freebies) {
                    currentKenken.freebies.forEach((f) => {
                      fresh[f.row][f.col] = f.val;
                    });
                  }
                  setGridValues(fresh);
                  setKenkenSolved(false);
                  setHintMessage(null);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Collapsible "How to Play KenKen" Guide */}
          {showKenkenRules && (
            <div className="rounded-3xl border-2 border-indigo-200 bg-indigo-50/70 p-5 text-xs leading-relaxed text-indigo-950 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200">
              <h4 className="flex items-center gap-2 font-black text-sm">
                <span>🧩 How to Play KenKen (MathDoku) in 3 Simple Rules:</span>
              </h4>
              <ul className="mt-2 list-inside list-disc space-y-1 font-medium">
                <li>
                  <strong>1. Rows & Columns:</strong> In a {currentKenken.size}×{currentKenken.size} grid, each row and column must contain digits 1 through {currentKenken.size} with <strong>no repeats</strong>.
                </li>
                <li>
                  <strong>2. Cages & Math Signs:</strong> Groups of cells surrounded by colored outlines are called <strong>cages</strong>. The tiny number and symbol in the top-left (e.g. <code>6+</code> or <code>12×</code>) tell you the target answer you must get using that math operation!
                </li>
                <li>
                  <strong>3. Relax & Deduce:</strong> Single cells with just a number (e.g. <code>3</code>) are freebies—just write that number in! Digits can repeat inside a cage as long as they are not in the same row or column.
                </li>
              </ul>
            </div>
          )}

          {hintMessage && (
            <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
              <Lightbulb className="h-4 w-4 shrink-0 text-amber-600" />
              <span>{hintMessage}</span>
            </div>
          )}

          {/* KenKen Puzzle Board Arena */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            {/* Left: Interactive Grid (7 cols) */}
            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-7">
              <div className="mb-4 text-center">
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-extrabold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {currentKenken.title} • {currentKenken.difficulty}
                </span>
                <p className="mt-1 text-xs text-slate-500">
                  {currentKenken.description}
                </p>
              </div>

              {/* The Grid */}
              <div
                className="inline-block rounded-2xl border-4 border-slate-800 bg-slate-900 p-1 shadow-xl dark:border-slate-600 dark:bg-slate-950"
                style={{
                  width: currentKenken.size === 3 ? "330px" : "380px",
                }}
              >
                <div
                  className="grid gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${currentKenken.size}, minmax(0, 1fr))`,
                  }}
                >
                  {Array.from({ length: currentKenken.size }).map((_, r) =>
                    Array.from({ length: currentKenken.size }).map((_, c) => {
                      const cage = getCageForCell(r, c);
                      const isTopLeft = cage ? isTopLeftOfCage(r, c, cage) : false;
                      const isSelected =
                        selectedCell?.[0] === r && selectedCell?.[1] === c;
                      const val = gridValues[r][c];

                      // Border styling to emphasize cages
                      const cageColor = cage?.color || "#ffffff";

                      return (
                        <div
                          key={`${r}-${c}`}
                          onClick={() => setSelectedCell([r, c])}
                          className={`relative flex h-24 cursor-pointer select-none flex-col items-center justify-center rounded-xl transition sm:h-28 ${
                            isSelected
                              ? "ring-4 ring-indigo-500 ring-offset-2 z-10"
                              : "hover:opacity-90"
                          }`}
                          style={{
                            backgroundColor: cageColor,
                            color: "#0f172a",
                          }}
                        >
                          {/* Top-left cage target math label */}
                          {cage && isTopLeft && (
                            <span className="absolute left-1.5 top-1 font-mono text-[11px] font-black leading-none text-slate-900">
                              {cage.target}
                              {cage.op !== "=" ? cage.op : ""}
                            </span>
                          )}

                          {/* Cell Value */}
                          <span className="text-3xl font-black sm:text-4xl">
                            {val > 0 ? val : ""}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* On-Screen Digit Keypad */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                {Array.from({ length: currentKenken.size }).map((_, i) => {
                  const num = i + 1;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleInputDigit(num)}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-indigo-200 bg-indigo-50 text-xl font-black text-indigo-900 shadow-sm transition hover:scale-105 hover:bg-indigo-600 hover:text-white dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-200"
                    >
                      {num}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={handleClearCell}
                  className="flex h-12 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-4 text-xs font-black text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300"
                >
                  ⌫ Clear
                </button>
              </div>
            </div>

            {/* Right: Cage Targets List & Victory Status (5 cols) */}
            <div className="space-y-4 lg:col-span-5">
              {kenkenSolved && (
                <div className="rounded-3xl border-2 border-emerald-400 bg-emerald-50 p-6 text-center shadow-lg dark:border-emerald-700 dark:bg-emerald-950/60">
                  <span className="text-4xl">🎉</span>
                  <h3 className="mt-2 text-xl font-black text-emerald-950 dark:text-emerald-100">
                    Puzzle Solved! Terrific Thinking!
                  </h3>
                  <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-300">
                    You satisfied all rows, columns, and arithmetic cages!
                  </p>
                  <div className="my-3 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 text-xs font-extrabold text-emerald-700 shadow-sm dark:bg-slate-900">
                    <Trophy className="h-4 w-4" />
                    <span>+40 XP & +15 Coins Awarded!</span>
                  </div>
                  <div>
                    {kenkenLevelIdx < KENKEN_LEVELS.length - 1 ? (
                      <button
                        onClick={() => setKenkenLevelIdx((prev) => prev + 1)}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-emerald-700"
                      >
                        <span>Next KenKen Puzzle ({KENKEN_LEVELS[kenkenLevelIdx + 1].size}×{KENKEN_LEVELS[kenkenLevelIdx + 1].size})</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setKenkenLevelIdx(0)}
                        className="rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-700"
                      >
                        Play From Beginning
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Cage Checklist */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    🎯 Cage Arithmetic Checklist
                  </h4>
                  <span className="text-xs text-slate-400">
                    {currentKenken.cages.length} Cages
                  </span>
                </div>

                <div className="space-y-2">
                  {currentKenken.cages.map((cage) => {
                    const vals = cage.cells.map(([r, c]) => gridValues[r][c]);
                    const isFilled = vals.every((v) => v > 0);
                    const isSatisfied = isFilled && checkCage(cage, gridValues);

                    return (
                      <div
                        key={cage.id}
                        className="flex items-center justify-between rounded-xl border border-slate-100 p-2.5 text-xs dark:border-slate-800"
                        style={{ backgroundColor: `${cage.color}40` }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg font-mono font-black text-slate-900" style={{ backgroundColor: cage.color }}>
                            {cage.target}{cage.op !== "=" ? cage.op : ""}
                          </span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {cage.cells.length} cells • {cage.op === "+" ? "Sum to" : cage.op === "×" ? "Multiply to" : cage.op === "-" ? "Difference of" : cage.op === "÷" ? "Divide to" : "Value"} {cage.target}
                          </span>
                        </div>
                        <span className="text-sm">
                          {isSatisfied ? "✅" : isFilled ? "❌" : "⏳"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===============================================================
          GAME 2: WORD LADDER (MORPH PUZZLE)
         =============================================================== */}
      {activeGame === "wordladder" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-extrabold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                Word Ladder • {currentLadder.title}
              </span>
              <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                Transform &ldquo;{currentLadder.startWord}&rdquo; into &ldquo;{currentLadder.targetWord}&rdquo;
              </h3>
              <p className="text-xs text-slate-500">
                Change exactly one letter at each step to form a new valid word!
              </p>
            </div>

            <div className="flex items-center gap-2">
              {WORD_LADDER_PUZZLES.map((lad, i) => (
                <button
                  key={lad.id}
                  onClick={() => setLadderIdx(i)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition ${
                    ladderIdx === i
                      ? "bg-purple-600 text-white"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                >
                  Ladder {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto max-w-lg space-y-4">
              {/* Start Word */}
              <div className="flex items-center justify-between rounded-2xl bg-indigo-50 p-4 dark:bg-indigo-950">
                <span className="text-xs font-bold uppercase text-indigo-700 dark:text-indigo-300">
                  Start Word:
                </span>
                <span className="font-mono text-2xl font-black tracking-widest text-indigo-900 dark:text-indigo-100">
                  {currentLadder.startWord}
                </span>
              </div>

              {/* Rungs */}
              {currentLadder.rungs.map((rung, i) => {
                const isCorrect =
                  ladderGuesses[i].trim().toUpperCase() === rung.answer.toUpperCase();
                return (
                  <div
                    key={i}
                    className={`rounded-2xl border-2 p-4 transition ${
                      isCorrect
                        ? "border-emerald-400 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40"
                        : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Step {i + 1}: {rung.clue}
                      </span>
                      {isCorrect && (
                        <span className="text-xs font-bold text-emerald-600">
                          ✅ Correct!
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <input
                        type="text"
                        maxLength={currentLadder.startWord.length}
                        value={ladderGuesses[i]}
                        onChange={(e) => {
                          const copy = [...ladderGuesses];
                          copy[i] = e.target.value.toUpperCase();
                          setLadderGuesses(copy);
                        }}
                        placeholder={`_ _ _ _`}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-lg font-black uppercase tracking-widest text-slate-900 focus:border-purple-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => speakText(rung.clue)}
                        className="rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                        title="Read Clue Aloud"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* End Word */}
              <div className="flex items-center justify-between rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950">
                <span className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300">
                  Target Word:
                </span>
                <span className="font-mono text-2xl font-black tracking-widest text-emerald-900 dark:text-emerald-100">
                  {currentLadder.targetWord}
                </span>
              </div>

              {/* Action Button */}
              <div className="pt-2 text-center">
                {!ladderSolved ? (
                  <button
                    onClick={handleCheckLadder}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 py-3 text-sm font-extrabold text-white shadow-md hover:bg-purple-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Check Word Ladder</span>
                  </button>
                ) : (
                  <div className="rounded-2xl bg-emerald-100 p-4 text-xs font-black text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
                    🎉 Excellent! You solved the Word Ladder and earned +35 XP & +15 Coins!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===============================================================
          GAME 3: PATTERN DETECTIVE
         =============================================================== */}
      {activeGame === "pattern" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-extrabold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                Pattern Detective • {currentPattern.title}
              </span>
              <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                Find the Missing Mystery Item!
              </h3>
              <p className="text-xs text-slate-500">
                Discover the mathematical or visual sequence rule.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {PATTERN_PUZZLES.map((pat, i) => (
                <button
                  key={pat.id}
                  onClick={() => setPatternIdx(i)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition ${
                    patternIdx === i
                      ? "bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                >
                  Pattern {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* Pattern Sequence Row */}
            <div className="my-6 flex flex-wrap items-center justify-center gap-3">
              {currentPattern.sequence.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 text-2xl font-black shadow-sm ${
                    item === "?"
                      ? "border-dashed border-amber-400 bg-amber-50 text-amber-600 animate-pulse dark:bg-amber-950 dark:text-amber-300"
                      : "border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>

            {/* Options */}
            <div className="mx-auto max-w-md">
              <span className="text-xs font-bold text-slate-500">
                Which one comes next in the pattern?
              </span>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {currentPattern.options.map((opt) => {
                  const isSelected = selectedPatternOption === opt;
                  const isCorrect = opt === currentPattern.correctAnswer;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectPatternOption(opt)}
                      className={`flex h-14 items-center justify-center rounded-2xl border-2 text-xl font-black transition ${
                        isSelected
                          ? isCorrect
                            ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                            : "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-200"
                          : "border-slate-200 bg-slate-50 hover:border-teal-400 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-800"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Solution Feedback */}
            {patternSolved && (
              <div className="mt-6 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">
                🎉 Great Detective Work! {currentPattern.ruleExplanation} (+30 XP & +10 Coins)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
