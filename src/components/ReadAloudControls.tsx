"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, Play, Pause, Square } from "lucide-react";

const PREFERRED_VOICE_STORAGE_KEY = "bb_preferred_voice_uri";

interface ReadAloudControlsProps {
  text: string;
  rate?: number;
  className?: string;
}

function formatVoiceLabel(v: SpeechSynthesisVoice): string {
  const cleanName = v.name
    .replace(/^Microsoft\s+/i, "")
    .replace(/^Google\s+/i, "Google ")
    .replace(/\s+Online\s*\(Natural\)/i, " (Natural)")
    .replace(/\s*-\s*English.*$/i, "")
    .trim();
  const region = v.lang.includes("GB")
    ? "UK"
    : v.lang.includes("AU")
    ? "AU"
    : "US";
  return `${cleanName} (${region})`;
}

export function ReadAloudControls({
  text,
  rate = 0.92,
  className = "",
}: ReadAloudControlsProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load browser/system English voices and restore saved preference
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      const englishVoices = allVoices.filter((v) =>
        v.lang.toLowerCase().startsWith("en")
      );
      const list = englishVoices.length > 0 ? englishVoices : allVoices;
      setVoices(list);

      const savedUri = localStorage.getItem(PREFERRED_VOICE_STORAGE_KEY) || "";
      if (savedUri && list.some((v) => v.voiceURI === savedUri)) {
        setSelectedVoiceURI(savedUri);
      } else if (list.length > 0 && !selectedVoiceURI) {
        const defaultVoice = list.find((v) => v.default) || list[0];
        setSelectedVoiceURI(defaultVoice.voiceURI);
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, [selectedVoiceURI]);

  // Stop speaking and reset to idle when the question text changes or component unmounts
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setStatus("idle");
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text]);

  // Keep UI state synced with browser speechSynthesis state
  useEffect(() => {
    if (status === "idle") return;
    const timer = setInterval(() => {
      if (typeof window === "undefined" || !("speechSynthesis" in window))
        return;
      const synth = window.speechSynthesis;
      if (!synth.speaking && !synth.pending && !synth.paused) {
        setStatus("idle");
      }
    }, 300);
    return () => clearInterval(timer);
  }, [status]);

  const startSpeaking = (voiceUriOverride?: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      const synth = window.speechSynthesis;
      synth.cancel();

      const cleanText = text.replace(/[_*#`~]/g, " ");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = rate;
      utterance.pitch = 1.05;

      const targetUri = voiceUriOverride ?? selectedVoiceURI;
      const matchedVoice = voices.find((v) => v.voiceURI === targetUri);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang || "en-US";
      } else {
        utterance.lang = "en-US";
      }

      utterance.onend = () => setStatus("idle");
      utterance.onerror = () => setStatus("idle");

      utteranceRef.current = utterance;
      setStatus("playing");
      synth.speak(utterance);
    } catch {
      setStatus("idle");
    }
  };

  const handlePlayPause = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;

    if (status === "playing") {
      synth.pause();
      setStatus("paused");
    } else if (status === "paused") {
      if (synth.paused || synth.speaking) {
        synth.resume();
        setStatus("playing");
      } else {
        startSpeaking();
      }
    } else {
      startSpeaking();
    }
  };

  const handleStop = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setStatus("idle");
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUri = e.target.value;
    setSelectedVoiceURI(newUri);
    if (typeof window !== "undefined") {
      localStorage.setItem(PREFERRED_VOICE_STORAGE_KEY, newUri);
    }
    // If currently playing or paused, immediately restart with the new voice
    if (status === "playing" || status === "paused") {
      startSpeaking(newUri);
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

      {/* Voice Selector Dropdown */}
      {voices.length > 0 && (
        <select
          value={selectedVoiceURI}
          onChange={handleVoiceChange}
          aria-label="Choose Read Aloud Voice"
          title="Choose Read Aloud Voice"
          className="max-w-[175px] truncate rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-700 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          {voices.map((v) => (
            <option key={v.voiceURI} value={v.voiceURI}>
              🎙️ {formatVoiceLabel(v)}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
