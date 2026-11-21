"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, Play, Pause, Square } from "lucide-react";

export const PREFERRED_VOICE_PRESET_KEY = "bb_preferred_voice_preset";

export type VoicePresetId =
  | "female_teacher"
  | "male_coach"
  | "female_cheerful"
  | "male_storyteller";

export interface VoicePreset {
  id: VoicePresetId;
  label: string;
  gender: "female" | "male";
  variantIndex: number;
  pitch: number;
  rate: number;
}

export const VOICE_PRESETS: VoicePreset[] = [
  {
    id: "female_teacher",
    label: "👩 Female Voice 1 (Teacher)",
    gender: "female",
    variantIndex: 0,
    pitch: 1.05,
    rate: 0.92,
  },
  {
    id: "male_coach",
    label: "👨 Male Voice 1 (Coach)",
    gender: "male",
    variantIndex: 0,
    pitch: 0.92,
    rate: 0.92,
  },
  {
    id: "female_cheerful",
    label: "👧 Female Voice 2 (Friendly)",
    gender: "female",
    variantIndex: 1,
    pitch: 1.2,
    rate: 0.96,
  },
  {
    id: "male_storyteller",
    label: "👦 Male Voice 2 (Storyteller)",
    gender: "male",
    variantIndex: 1,
    pitch: 0.82,
    rate: 0.88,
  },
];

const FEMALE_KEYWORDS = [
  "zira",
  "aria",
  "jenny",
  "michelle",
  "ana",
  "sara",
  "samantha",
  "victoria",
  "ava",
  "emma",
  "allison",
  "susan",
  "female",
  "google us english",
];

const MALE_KEYWORDS = [
  "david",
  "mark",
  "guy",
  "christopher",
  "eric",
  "roger",
  "steffan",
  "andrew",
  "brian",
  "alex",
  "fred",
  "male",
];

export function pickUSVoiceForPreset(
  voices: SpeechSynthesisVoice[],
  preset: VoicePreset
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // Prefer US English (en-US) voices first, fallback to any English voice
  const usVoices = voices.filter(
    (v) =>
      v.lang.toLowerCase() === "en-us" ||
      v.lang.toLowerCase().startsWith("en_us")
  );
  const pool =
    usVoices.length > 0
      ? usVoices
      : voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const activePool = pool.length > 0 ? pool : voices;

  const targetKeywords =
    preset.gender === "female" ? FEMALE_KEYWORDS : MALE_KEYWORDS;

  const genderMatches = activePool.filter((v) => {
    const lower = v.name.toLowerCase();
    return targetKeywords.some((kw) => lower.includes(kw));
  });

  if (genderMatches.length > 0) {
    return genderMatches[preset.variantIndex % genderMatches.length];
  }

  // Fallback if browser doesn't label gender keywords in voice names
  if (preset.gender === "male" && activePool.length > 1) {
    return activePool[(1 + preset.variantIndex) % activePool.length];
  }
  return activePool[preset.variantIndex % activePool.length];
}

interface ReadAloudControlsProps {
  text: string;
  rate?: number;
  className?: string;
}

export function ReadAloudControls({
  text,
  className = "",
}: ReadAloudControlsProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [presetId, setPresetId] = useState<VoicePresetId>("female_teacher");
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");

  // Exact character offset tracking so Pause & Resume works 100% reliably across all Chrome/Edge/Windows voices
  const cleanTextRef = useRef<string>("");
  const currentOffsetRef = useRef<number>(0);
  const pausedOffsetRef = useRef<number>(0);
  const isPausingRef = useRef<boolean>(false);
  const fallbackTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearFallbackTimer = () => {
    if (fallbackTimerRef.current) {
      clearInterval(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  };

  // Load voices and saved preset
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const saved = localStorage.getItem(
      PREFERRED_VOICE_PRESET_KEY
    ) as VoicePresetId | null;
    if (saved && VOICE_PRESETS.some((p) => p.id === saved)) {
      setPresetId(saved);
    }

    const loadVoices = () => {
      const all = window.speechSynthesis.getVoices();
      if (all.length > 0) setVoices(all);
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  // Reset when question text changes or component unmounts
  useEffect(() => {
    cleanTextRef.current = text.replace(/[_*#`~]/g, " ").replace(/\s+/g, " ").trim();
    currentOffsetRef.current = 0;
    pausedOffsetRef.current = 0;
    isPausingRef.current = false;
    clearFallbackTimer();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setStatus("idle");

    return () => {
      clearFallbackTimer();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text]);

  const speakFromOffset = (startOffset: number, overridePresetId?: VoicePresetId) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;

    isPausingRef.current = true;
    clearFallbackTimer();
    synth.cancel();
    isPausingRef.current = false;

    const fullText =
      cleanTextRef.current ||
      text.replace(/[_*#`~]/g, " ").replace(/\s+/g, " ").trim();
    cleanTextRef.current = fullText;

    // Snap startOffset backward to the start of the current word so resume never cuts a word in half
    let safeOffset = Math.max(0, Math.min(startOffset, fullText.length - 1));
    while (safeOffset > 0 && fullText[safeOffset - 1] !== " ") {
      safeOffset--;
    }

    const remainingText = fullText.slice(safeOffset);
    if (!remainingText.trim()) {
      currentOffsetRef.current = 0;
      pausedOffsetRef.current = 0;
      setStatus("idle");
      return;
    }

    currentOffsetRef.current = safeOffset;
    let boundaryFired = false;

    const activePreset =
      VOICE_PRESETS.find((p) => p.id === (overridePresetId || presetId)) ||
      VOICE_PRESETS[0];

    const utterance = new SpeechSynthesisUtterance(remainingText);
    const chosenVoice = pickUSVoiceForPreset(voices, activePreset);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
      utterance.lang = chosenVoice.lang || "en-US";
    } else {
      utterance.lang = "en-US";
    }
    utterance.pitch = activePreset.pitch;
    utterance.rate = activePreset.rate;

    // Track exact word boundary as the voice speaks
    utterance.onboundary = (event) => {
      if (typeof event.charIndex === "number") {
        boundaryFired = true;
        currentOffsetRef.current = safeOffset + event.charIndex;
      }
    };

    // Fallback progress estimator for network voices that don't emit onboundary events
    const charsPerTick = Math.max(1, Math.round(13 * activePreset.rate * 0.25));
    fallbackTimerRef.current = setInterval(() => {
      if (!boundaryFired && currentOffsetRef.current < fullText.length - 2) {
        currentOffsetRef.current = Math.min(
          fullText.length - 1,
          currentOffsetRef.current + charsPerTick
        );
      }
    }, 250);

    utterance.onend = () => {
      clearFallbackTimer();
      if (!isPausingRef.current) {
        currentOffsetRef.current = 0;
        pausedOffsetRef.current = 0;
        setStatus("idle");
      }
    };

    utterance.onerror = () => {
      clearFallbackTimer();
      if (!isPausingRef.current) {
        setStatus("idle");
      }
    };

    setStatus("playing");
    synth.speak(utterance);
  };

  const handlePlayPause = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;

    if (status === "playing") {
      // Save exact character offset and stop synthesis cleanly so Resume can restart from that exact word
      isPausingRef.current = true;
      pausedOffsetRef.current = currentOffsetRef.current;
      clearFallbackTimer();
      synth.cancel();
      setStatus("paused");
    } else if (status === "paused") {
      // Resume from the exact saved word offset
      speakFromOffset(pausedOffsetRef.current);
    } else {
      // Play from beginning
      currentOffsetRef.current = 0;
      pausedOffsetRef.current = 0;
      speakFromOffset(0);
    }
  };

  const handleStop = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    isPausingRef.current = true;
    clearFallbackTimer();
    window.speechSynthesis.cancel();
    isPausingRef.current = false;
    currentOffsetRef.current = 0;
    pausedOffsetRef.current = 0;
    setStatus("idle");
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextPreset = e.target.value as VoicePresetId;
    setPresetId(nextPreset);
    if (typeof window !== "undefined") {
      localStorage.setItem(PREFERRED_VOICE_PRESET_KEY, nextPreset);
    }
    // If currently playing or paused, continue from current position in the new voice
    if (status === "playing") {
      speakFromOffset(currentOffsetRef.current, nextPreset);
    } else if (status === "paused") {
      speakFromOffset(pausedOffsetRef.current, nextPreset);
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {/* Play / Pause / Resume Button */}
      <button
        type="button"
        onClick={handlePlayPause}
        className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-extrabold transition ${
          status === "playing"
            ? "border-amber-400 bg-amber-400 text-slate-950 shadow-xs hover:bg-amber-300"
            : status === "paused"
            ? "border-emerald-500 bg-emerald-600 text-white shadow-xs hover:bg-emerald-700"
            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        }`}
        title={
          status === "playing"
            ? "Pause Read Aloud"
            : status === "paused"
            ? "Resume Read Aloud"
            : "Play Read Aloud"
        }
      >
        {status === "playing" ? (
          <>
            <Pause className="h-3.5 w-3.5 fill-current" />
            <span>Pause</span>
          </>
        ) : status === "paused" ? (
          <>
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Resume</span>
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Read Aloud</span>
          </>
        )}
      </button>

      {/* Stop Button (visible while playing or paused) */}
      {status !== "idle" && (
        <button
          type="button"
          onClick={handleStop}
          className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-black text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
          title="Stop & Reset Read Aloud"
        >
          <Square className="h-3 w-3 fill-current" />
          <span>Stop</span>
        </button>
      )}

      {/* Kid-Friendly US English Male / Female Voice Variation Selector */}
      <select
        value={presetId}
        onChange={handlePresetChange}
        aria-label="Choose Male or Female Voice Variation"
        title="Choose Male or Female Voice Variation"
        className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-700 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        {VOICE_PRESETS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
    </div>
  );
}
