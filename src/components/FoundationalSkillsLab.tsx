"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useLearningStore } from "@/store/useLearningStore";
import { speakText, stopSpeaking } from "@/lib/utils";
import { FoundationalActivityType } from "@/types/curriculum";
import {
  Volume2,
  Puzzle,
  Mic,
  Headphones,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Play,
  Square,
  ArrowRight,
} from "lucide-react";

export function FoundationalSkillsLab() {
  const {
    units,
    lessons,
    selectedUnitId,
    selectUnit,
    startSkillPractice,
    addFluencyPracticeXP,
  } = useLearningStore();

  const fsUnits = useMemo(
    () => units.filter((u) => u.subjectId === "subj-fs"),
    [units]
  );

  const activeFsUnit = useMemo(
    () =>
      fsUnits.find((u) => u.id === selectedUnitId) ||
      fsUnits[0],
    [fsUnits, selectedUnitId]
  );

  const activeLesson = useMemo(
    () => lessons.find((l) => l.unitId === activeFsUnit?.id),
    [lessons, activeFsUnit]
  );

  const extras = activeLesson?.foundationalExtras;

  const [activeActivity, setActiveActivity] =
    useState<FoundationalActivityType>("Match Sound");

  // 1. Match Sound State
  const [soundMatchIdx, setSoundMatchIdx] = useState(0);
  const [selectedSoundWord, setSelectedSoundWord] = useState<string | null>(
    null
  );

  // 2. Build Word State
  const [wordBuildIdx, setWordBuildIdx] = useState(0);
  const [builtSyllables, setBuiltSyllables] = useState<string[]>([]);

  // 3. Read Aloud Tracking State
  const [isTrackingReadAloud, setIsTrackingReadAloud] = useState(false);
  const [highlightedWordIdx, setHighlightedWordIdx] = useState<number>(-1);
  const [readingWpm, setReadingWpm] = useState<number>(105);
  const [fluencyCompleted, setFluencyCompleted] = useState(false);

  // 4. Listening Activity State
  const [listeningTargetIdx, setListeningTargetIdx] = useState(0);
  const [listeningChoice, setListeningChoice] = useState<string | null>(null);

  const passageWords = useMemo(() => {
    const text =
      extras?.fluencyPassage ||
      activeLesson?.readingPassage?.paragraphs.join(" ") ||
      "Read aloud smoothly with expression and accuracy.";
    return text.split(/\s+/);
  }, [extras, activeLesson]);

  useEffect(() => {
    setSelectedSoundWord(null);
    setBuiltSyllables([]);
    setIsTrackingReadAloud(false);
    setHighlightedWordIdx(-1);
    setFluencyCompleted(false);
    setListeningChoice(null);
  }, [activeFsUnit?.id, activeActivity]);

  // Read Aloud Word-by-Word Tracker Timer
  useEffect(() => {
    if (!isTrackingReadAloud) return;
    const msPerWord = Math.round((60 / readingWpm) * 1000);
    const interval = setInterval(() => {
      setHighlightedWordIdx((prev) => {
        if (prev + 1 >= passageWords.length) {
          setIsTrackingReadAloud(false);
          setFluencyCompleted(true);
          addFluencyPracticeXP(readingWpm, 98);
          return prev;
        }
        return prev + 1;
      });
    }, msPerWord);

    return () => clearInterval(interval);
  }, [isTrackingReadAloud, readingWpm, passageWords.length, addFluencyPracticeXP]);

  if (!activeFsUnit || !activeLesson || !extras) {
    return null;
  }

  const currentSoundMatch =
    extras.soundMatches[soundMatchIdx % extras.soundMatches.length];
  const soundOptions = [
    currentSoundMatch.correctWord,
    ...currentSoundMatch.distractors,
  ];

  const currentWordBuild =
    extras.wordBuildingTiles[wordBuildIdx % extras.wordBuildingTiles.length];
  const scrambledTiles = [...currentWordBuild.syllables].reverse();

  const listeningWords = [
    ...(extras.sightWords || []),
    ...(extras.trickyWords || []),
  ];
  const targetListeningWord =
    listeningWords[listeningTargetIdx % Math.max(1, listeningWords.length)] ||
    "together";

  const startReadAloudTracker = () => {
    setFluencyCompleted(false);
    setHighlightedWordIdx(0);
    setIsTrackingReadAloud(true);
    speakText(passageWords.join(" "), readingWpm / 115);
  };

  const stopReadAloudTracker = () => {
    setIsTrackingReadAloud(false);
    stopSpeaking();
  };

  return (
    <div className="space-y-6">
      {/* Top Unit Selector Banner */}
      <div className="rounded-3xl border border-teal-200 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 p-6 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-extrabold uppercase tracking-wider">
                Foundational Skills • {activeFsUnit.code}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold">
                Reader: {activeFsUnit.readerTitle}
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-black">{activeFsUnit.title}</h2>
            <p className="mt-1 text-sm text-teal-50">
              {extras.phonicsFocus} • {activeFsUnit.weekRange}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={activeFsUnit.id}
              onChange={(e) => selectUnit(e.target.value)}
              aria-label="Select Foundational Skills Unit"
              className="rounded-xl bg-white px-3.5 py-2 text-xs font-extrabold text-slate-900 shadow-sm"
            >
              {fsUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  Unit {u.unitNumber}: {u.title} ({u.readerTitle})
                </option>
              ))}
            </select>
            <button
              onClick={() =>
                startSkillPractice(activeLesson.skillIds[0] || "fs-u1-s1")
              }
              className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-xs font-extrabold text-slate-950 shadow-sm hover:bg-amber-300"
            >
              <span>Unit Skill Quiz</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sight Words & Tricky Words Interactive Soundboard */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
            <Sparkles className="h-4 w-4 text-teal-600" />
            <span>High-Frequency Sight Words (Click to Hear)</span>
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {extras.sightWords.map((word) => (
              <button
                key={word}
                onClick={() => speakText(word, 0.85)}
                className="flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-2 text-sm font-extrabold text-teal-900 transition hover:scale-105 hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-200"
              >
                <Volume2 className="h-3.5 w-3.5 text-teal-600" />
                <span>{word}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
            <Puzzle className="h-4 w-4 text-amber-600" />
            <span>Bluebonnet Tricky Words & Multi-Syllable Words</span>
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {extras.trickyWords.map((word) => (
              <button
                key={word}
                onClick={() => speakText(word, 0.82)}
                className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-sm font-extrabold text-amber-900 transition hover:scale-105 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200"
              >
                <Volume2 className="h-3.5 w-3.5 text-amber-600" />
                <span>{word}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Foundational Activity Mode Tabs */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: "Match Sound", icon: <Volume2 className="h-4 w-4" />, label: "1. Match Sound (Phonics)" },
            { id: "Build Word", icon: <Puzzle className="h-4 w-4" />, label: "2. Build Word (Syllables)" },
            { id: "Read Aloud Tracking", icon: <Mic className="h-4 w-4" />, label: "3. Read Aloud Tracking (Fluency)" },
            { id: "Listening Activities", icon: <Headphones className="h-4 w-4" />, label: "4. Listening Lab" },
          ] as { id: FoundationalActivityType; icon: React.ReactNode; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveActivity(tab.id)}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition ${
              activeActivity === tab.id
                ? "bg-teal-600 text-white shadow-md shadow-teal-500/20"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Activity 1: Match Sound */}
      {activeActivity === "Match Sound" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-extrabold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                Phoneme & Pattern Match ({ currentSoundMatch.phoneme })
              </span>
              <h3 className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">
                {currentSoundMatch.soundPrompt}
              </h3>
            </div>
            <button
              onClick={() => speakText(currentSoundMatch.soundPrompt)}
              className="flex items-center gap-1.5 rounded-xl bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-700 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-300"
            >
              <Volume2 className="h-4 w-4" />
              <span>Hear Prompt</span>
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {soundOptions.map((word) => {
              const isSelected = selectedSoundWord === word;
              const isCorrect = word === currentSoundMatch.correctWord;
              return (
                <button
                  key={word}
                  onClick={() => {
                    setSelectedSoundWord(word);
                    speakText(word);
                  }}
                  className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left text-base font-extrabold transition ${
                    isSelected
                      ? isCorrect
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200"
                        : "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/50 dark:text-rose-200"
                      : "border-slate-200 bg-slate-50 hover:border-teal-400 dark:border-slate-700 dark:bg-slate-800"
                  }`}
                >
                  <span>{word}</span>
                  <Volume2 className="h-4 w-4 text-slate-400" />
                </button>
              );
            })}
          </div>

          {selectedSoundWord && (
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-100 p-4 text-xs font-bold dark:bg-slate-800">
              <span>
                {selectedSoundWord === currentSoundMatch.correctWord
                  ? `✅ Correct! "${currentSoundMatch.correctWord}" uses the ${currentSoundMatch.phoneme} pattern.`
                  : `💡 Try again! Listen closely for the ${currentSoundMatch.phoneme} sound pattern.`}
              </span>
              <button
                onClick={() => {
                  setSelectedSoundWord(null);
                  setSoundMatchIdx((i) => i + 1);
                }}
                className="rounded-xl bg-teal-600 px-3.5 py-1.5 text-white"
              >
                Next Pattern
              </button>
            </div>
          )}
        </div>
      )}

      {/* Activity 2: Build Word (Syllable Tiles) */}
      {activeActivity === "Build Word" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-extrabold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                Syllable Division & Word Building
              </span>
              <h3 className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">
                Click the syllable chunks in order to build the word:{" "}
                <button
                  onClick={() => speakText(currentWordBuild.targetWord, 0.8)}
                  className="inline-flex items-center gap-1 text-indigo-600 underline dark:text-indigo-400"
                >
                  🔊 Hear Target Word
                </button>
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Clue: {currentWordBuild.hint}
              </p>
            </div>
            <button
              onClick={() => setBuiltSyllables([])}
              className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear Tiles</span>
            </button>
          </div>

          {/* Assembled Word Tray */}
          <div className="my-5 flex min-h-16 flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50/50 p-4 dark:border-indigo-800 dark:bg-indigo-950/30">
            {builtSyllables.length === 0 ? (
              <span className="text-xs font-semibold text-slate-400">
                Click the syllable tiles below to assemble the word...
              </span>
            ) : (
              builtSyllables.map((syl, idx) => (
                <span
                  key={idx}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-base font-black text-white shadow-sm"
                >
                  {syl}
                </span>
              ))
            )}
          </div>

          {/* Scrambled Syllable Tiles */}
          <div className="flex flex-wrap justify-center gap-3">
            {scrambledTiles.map((tile, idx) => (
              <button
                key={idx}
                onClick={() => {
                  speakText(tile, 0.85);
                  setBuiltSyllables((prev) => [...prev, tile]);
                }}
                className="rounded-2xl border-2 border-slate-200 bg-white px-5 py-3 text-base font-extrabold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {tile}
              </button>
            ))}
          </div>

          {builtSyllables.length >= currentWordBuild.syllables.length && (
            <div className="mt-5 flex items-center justify-between rounded-2xl bg-emerald-50 p-4 text-xs font-extrabold text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">
              <span>
                {builtSyllables.join("") === currentWordBuild.targetWord
                  ? `🎉 Awesome! You built "${currentWordBuild.targetWord}" (${currentWordBuild.syllables.join(" • ")})!`
                  : `Check the syllable order! Target is ${currentWordBuild.syllables.join(" - ")}.`}
              </span>
              <button
                onClick={() => {
                  setBuiltSyllables([]);
                  setWordBuildIdx((i) => i + 1);
                }}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-white"
              >
                Next Word
              </button>
            </div>
          )}
        </div>
      )}

      {/* Activity 3: Read Aloud Tracking (Fluency WPM Tracker) */}
      {activeActivity === "Read Aloud Tracking" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Grade 3 Fluency Tracker • Target: 110 WPM
              </span>
              <h3 className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">
                Decodable Reader Passage: {activeFsUnit.readerTitle}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-bold">
                <span>Pacing Speed:</span>
                <select
                  value={readingWpm}
                  onChange={(e) => setReadingWpm(Number(e.target.value))}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-extrabold dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value={85}>85 WPM (Careful Decoding)</option>
                  <option value={105}>105 WPM (Grade 3 Mid-Year)</option>
                  <option value={120}>120 WPM (Grade 3 Mastery)</option>
                </select>
              </div>

              {!isTrackingReadAloud ? (
                <button
                  onClick={startReadAloudTracker}
                  className="flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-emerald-700"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>Start Guided Read-Aloud</span>
                </button>
              ) : (
                <button
                  onClick={stopReadAloudTracker}
                  className="flex items-center gap-1.5 rounded-2xl bg-rose-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-rose-700"
                >
                  <Square className="h-4 w-4 fill-white" />
                  <span>Stop Tracker</span>
                </button>
              )}
            </div>
          </div>

          {/* Synchronized Word-by-Word Highlighted Passage */}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-lg leading-loose dark:border-slate-800 dark:bg-slate-800/60">
            {passageWords.map((word, idx) => {
              const isCurrent = idx === highlightedWordIdx;
              const isPast = idx < highlightedWordIdx;
              return (
                <span
                  key={idx}
                  onClick={() => speakText(word)}
                  className={`mr-2 inline-block cursor-pointer rounded-lg px-1.5 py-0.5 font-bold transition ${
                    isCurrent
                      ? "scale-110 bg-amber-300 text-slate-950 shadow-sm"
                      : isPast
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-slate-800 hover:bg-indigo-100 dark:text-slate-200"
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </div>

          {fluencyCompleted && (
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-emerald-100 p-4 text-xs font-extrabold text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-200">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Great reading! You completed the passage at {readingWpm} WPM and earned +30 XP & +15 Coins!
              </span>
              <button
                onClick={startReadAloudTracker}
                className="rounded-xl bg-emerald-700 px-3 py-1.5 text-white"
              >
                Read Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Activity 4: Listening Lab */}
      {activeActivity === "Listening Activities" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-extrabold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
            Auditory Discrimination & Spelling Check
          </span>
          <h3 className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">
            Click &ldquo;Play Mystery Word&rdquo; and select the exact word you hear:
          </h3>

          <div className="my-5 flex justify-center">
            <button
              onClick={() =>
                speakText(
                  `Listen carefully. The word is: ${targetListeningWord}.`,
                  0.85
                )
              }
              className="flex items-center gap-3 rounded-2xl bg-purple-600 px-6 py-4 text-base font-extrabold text-white shadow-lg shadow-purple-500/25 hover:bg-purple-700"
            >
              <Headphones className="h-6 w-6" />
              <span>🔊 Play Mystery Word</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {listeningWords.slice(0, 6).map((word) => {
              const isPicked = listeningChoice === word;
              const isRight = word === targetListeningWord;
              return (
                <button
                  key={word}
                  onClick={() => setListeningChoice(word)}
                  className={`rounded-2xl border-2 p-4 text-center text-sm font-extrabold transition ${
                    isPicked
                      ? isRight
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                        : "border-rose-500 bg-rose-50 text-rose-900"
                      : "border-slate-200 bg-slate-50 hover:border-purple-400 dark:border-slate-700 dark:bg-slate-800"
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>

          {listeningChoice && (
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-100 p-4 text-xs font-extrabold dark:bg-slate-800">
              <span>
                {listeningChoice === targetListeningWord
                  ? `✅ Spot on! You heard and spelled "${targetListeningWord}"!`
                  : `Try again! Click "Play Mystery Word" to listen closely.`}
              </span>
              <button
                onClick={() => {
                  setListeningChoice(null);
                  setListeningTargetIdx((i) => i + 1);
                }}
                className="rounded-xl bg-purple-600 px-4 py-1.5 text-white"
              >
                Next Mystery Word
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

