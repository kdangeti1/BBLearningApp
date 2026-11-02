"use client";

import React, { useState } from "react";
import { useLearningStore, MainTab } from "@/store/useLearningStore";
import {
  Flame,
  Star,
  Coins,
  Trophy,
  Volume2,
  Moon,
  Sun,
  Type,
  Maximize2,
  ShieldCheck,
  Sparkles,
  Upload,
  LayoutDashboard,
  BookOpen,
  Calendar,
  Award,
  BarChart3,
  Headphones,
  CheckCircle2,
  GraduationCap,
  Users,
  LogOut,
  Gamepad2,
} from "lucide-react";

export function Navbar() {
  const {
    loggedInAccountType,
    studentsList,
    activeTab,
    student,
    enableAi,
    setActiveTab,
    toggleAccessibility,
    setEnableAi,
    selectActiveChild,
    logout,
  } = useLearningStore();

  const [showA11yMenu, setShowA11yMenu] = useState(false);

  const isAdmin = loggedInAccountType === "admin";

  const navTabs: {
    id: MainTab;
    label: string;
    icon: React.ReactNode;
    adminOnly?: boolean;
  }[] = [
    ...(isAdmin
      ? [
          {
            id: "manage_children" as MainTab,
            label: "Child Profiles (Admin)",
            icon: <Users className="h-4 w-4" />,
            adminOnly: true,
          },
          {
            id: "parent_dashboard" as MainTab,
            label: "Parent Analytics",
            icon: <BarChart3 className="h-4 w-4" />,
            adminOnly: true,
          },
        ]
      : []),
    {
      id: "dashboard",
      label: "Quest Home",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      id: "subjects",
      label: "Subjects & Units",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      id: "pacing_calendar",
      label: "36-Week Pacing",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      id: "lesson_viewer",
      label: "7-Part Lesson",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      id: "skill_practice",
      label: "SmartScore Practice",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    {
      id: "reading_studio",
      label: "Reading Studio",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      id: "foundational_lab",
      label: "Foundational Lab",
      icon: <Headphones className="h-4 w-4" />,
    },
    {
      id: "brain_games",
      label: "Brain Games 🧩",
      icon: <Gamepad2 className="h-4 w-4" />,
    },
    {
      id: "badges",
      label: "Badges",
      icon: <Award className="h-4 w-4" />,
    },
    ...(isAdmin
      ? [
          {
            id: "curriculum_import" as MainTab,
            label: "Curriculum Engine",
            icon: <Upload className="h-4 w-4" />,
            adminOnly: true,
          },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-indigo-100 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top Row: Brand, Gamification Stats, Accessibility & Account Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab("dashboard")}
            className="flex cursor-pointer items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600 text-white shadow-md shadow-indigo-500/20">
              <span className="text-xl font-black">🌸</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Bluebonnet Quest
                </h1>
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Grade 3 TEKS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Active Learner: <strong>{student.avatar} {student.name}</strong> (ID: {student.username})
              </p>
            </div>
          </div>

          {/* Student Gamification Pill Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              title="Learning Streak"
              className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/50 dark:text-orange-300"
            >
              <Flame className="h-4 w-4 fill-orange-500 text-orange-500" />
              <span>{student.streakDays} Day Streak</span>
            </div>

            <div
              title="Experience Points"
              className="flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300"
            >
              <Trophy className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>{student.xp.toLocaleString()} XP</span>
            </div>

            <div
              title="Mastery Stars"
              className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-300"
            >
              <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
              <span>{student.stars} Stars</span>
            </div>

            <div
              title="Treasure Coins"
              className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300"
            >
              <Coins className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>{student.coins} Coins</span>
            </div>
          </div>

          {/* Right Controls: Child Switcher (for Admin), AI Toggle, Accessibility, Logout */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Admin Child Switcher */}
            {isAdmin && studentsList.length > 0 && (
              <select
                value={student.id}
                onChange={(e) => selectActiveChild(e.target.value)}
                aria-label="Switch Active Child Profile"
                className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-extrabold text-indigo-800 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-200"
              >
                {studentsList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.avatar} {c.name} (ID: {c.username})
                  </option>
                ))}
              </select>
            )}

            {/* ENABLE_AI Status / Toggle (Admin only) */}
            {isAdmin && (
              <button
                onClick={() => setEnableAi(!enableAi)}
                title="Toggle Optional AI Features (Works 100% when disabled)"
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                  enableAi
                    ? "border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                    : "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                }`}
              >
                {enableAi ? (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>AI: ON</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>AI: OFF (Free)</span>
                  </>
                )}
              </button>
            )}

            {/* Accessibility Popover Button */}
            <div className="relative">
              <button
                onClick={() => setShowA11yMenu(!showA11yMenu)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                aria-label="Accessibility Settings"
              >
                <Type className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">A11y</span>
              </button>

              {showA11yMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Grade 3 Accessibility
                    </span>
                    <button
                      onClick={() => setShowA11yMenu(false)}
                      className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      Done
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <button
                      onClick={() => toggleAccessibility("dyslexiaFont")}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 font-semibold transition ${
                        student.accessibility.dyslexiaFont
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Type className="h-4 w-4" /> Dyslexia-Friendly Font
                      </span>
                      <span>
                        {student.accessibility.dyslexiaFont ? "ON" : "OFF"}
                      </span>
                    </button>

                    <button
                      onClick={() => toggleAccessibility("textToSpeech")}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 font-semibold transition ${
                        student.accessibility.textToSpeech
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4" /> Text-To-Speech Read Aloud
                      </span>
                      <span>
                        {student.accessibility.textToSpeech ? "ON" : "OFF"}
                      </span>
                    </button>

                    <button
                      onClick={() => toggleAccessibility("audioInstructions")}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 font-semibold transition ${
                        student.accessibility.audioInstructions
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Headphones className="h-4 w-4" /> Audio Instructions
                      </span>
                      <span>
                        {student.accessibility.audioInstructions ? "ON" : "OFF"}
                      </span>
                    </button>

                    <button
                      onClick={() => toggleAccessibility("largeButtons")}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 font-semibold transition ${
                        student.accessibility.largeButtons
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Maximize2 className="h-4 w-4" /> Large Touch Buttons
                      </span>
                      <span>
                        {student.accessibility.largeButtons ? "ON" : "OFF"}
                      </span>
                    </button>

                    <button
                      onClick={() => toggleAccessibility("darkMode")}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 font-semibold transition ${
                        student.accessibility.darkMode
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {student.accessibility.darkMode ? (
                          <Moon className="h-4 w-4" />
                        ) : (
                          <Sun className="h-4 w-4" />
                        )}{" "}
                        Dark Mode
                      </span>
                      <span>
                        {student.accessibility.darkMode ? "ON" : "OFF"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Logged-in Role Badge & Logout Button */}
            <div className="flex items-center gap-1.5">
              <span
                className={`rounded-xl px-3 py-1.5 text-xs font-extrabold ${
                  isAdmin
                    ? "bg-indigo-600 text-white"
                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                }`}
              >
                {isAdmin
                  ? "👑 Admin"
                  : `${student.avatar} ${student.name.split(" ")[0]}`}
              </span>
              <button
                onClick={logout}
                title="Switch User or Log Out"
                className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-extrabold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Switch User</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-2 pt-1">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
