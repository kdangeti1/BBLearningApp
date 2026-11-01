"use client";

import React, { useState, useEffect } from "react";
import { useLearningStore } from "@/store/useLearningStore";
import {
  Lock,
  User,
  ShieldCheck,
  Sparkles,
  LogIn,
  KeyRound,
  Users,
} from "lucide-react";

export function LoginScreen() {
  const { studentsList, login, loadProfilesFromFirestore } = useLearningStore();

  const [loginMode, setLoginMode] = useState<"child" | "admin">("child");
  const [username, setUsername] = useState<string>("leo");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadProfilesFromFirestore();
  }, [loadProfilesFromFirestore]);

  const handleSelectChildCard = (childUsername: string) => {
    setLoginMode("child");
    setUsername(childUsername);
    setPassword("");
    setErrorMsg(null);
  };

  const handleSwitchMode = (mode: "child" | "admin") => {
    setLoginMode(mode);
    setErrorMsg(null);
    if (mode === "admin") {
      setUsername("admin");
      setPassword("");
    } else {
      setUsername(studentsList[0]?.username || "leo");
      setPassword("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const result = login(username, password);
    if (!result.success) {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-violet-950 p-4 text-slate-900">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-white/15 bg-white shadow-2xl dark:bg-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Hero / Child Profile Picker Column */}
          <div className="flex flex-col justify-between bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700 p-8 text-white lg:col-span-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-extrabold">
                <span>🌸 Texas Bluebonnet Learning</span>
                <span>•</span>
                <span>Grade 3 TEKS</span>
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-tight">
                Bluebonnet Quest
              </h1>
              <p className="mt-2 text-sm text-indigo-100">
                Interactive Grade 3 Mathematics, Reading Language Arts, and Foundational Skills.
              </p>

              {/* Quick Child Profile Selector Cards */}
              <div className="mt-6">
                <div className="mb-2.5 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-indigo-200">
                  <Users className="h-4 w-4" />
                  <span>Select Your Student Profile ({studentsList.length})</span>
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {studentsList.map((child) => {
                    const isSelected =
                      loginMode === "child" &&
                      username.toLowerCase() ===
                        (child.username || "").toLowerCase();
                    return (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() =>
                          handleSelectChildCard(child.username || "leo")
                        }
                        className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                          isSelected
                            ? "border-amber-300 bg-white text-slate-900 shadow-lg"
                            : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-2xl">
                          {child.avatar}
                        </span>
                        <div className="overflow-hidden">
                          <div className="truncate text-sm font-extrabold">
                            {child.name}
                          </div>
                          <div
                            className={`text-xs font-bold ${
                              isSelected ? "text-indigo-600" : "text-indigo-200"
                            }`}
                          >
                            ID: {child.username} • {child.xp} XP
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Info Box */}
            <div className="mt-8 rounded-2xl bg-white/10 p-4 text-xs text-indigo-100 backdrop-blur-sm">
              <div className="font-extrabold text-white">
                🔑 Demo & Admin Credentials:
              </div>
              <div className="mt-1 space-y-1">
                <div>
                  • <strong>Admin Login:</strong> ID <code className="rounded bg-white/20 px-1.5 py-0.5 font-bold text-white">admin</code> / Password <code className="rounded bg-white/20 px-1.5 py-0.5 font-bold text-white">admin123</code>
                </div>
                <div>
                  • <strong>Default Child Login:</strong> ID <code className="rounded bg-white/20 px-1.5 py-0.5 font-bold text-white">leo</code> / Password <code className="rounded bg-white/20 px-1.5 py-0.5 font-bold text-white">1234</code>
                </div>
              </div>
            </div>
          </div>

          {/* Right Login Form Column */}
          <div className="flex flex-col justify-center p-8 lg:col-span-6">
            {/* Mode Switcher Tabs */}
            <div className="mb-6 flex rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => handleSwitchMode("child")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold transition ${
                  loginMode === "child"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>Child / Student Login</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchMode("admin")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold transition ${
                  loginMode === "admin"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Admin / Parent Login</span>
              </button>
            </div>

            <div className="mb-5">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {loginMode === "admin"
                  ? "Admin & Parent Portal"
                  : "Student Quest Login"}
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {loginMode === "admin"
                  ? "Log in with your Admin ID to create child profiles, set passwords, and track SmartScore mastery."
                  : "Click your profile card on the left or enter your Child Login ID and password to start learning!"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  {loginMode === "admin"
                    ? "Admin ID"
                    : "Child Login ID / Username"}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={
                      loginMode === "admin" ? "admin" : "e.g., leo"
                    }
                    className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-bold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      loginMode === "admin"
                        ? "Enter admin password (admin123)"
                        : "Enter your student password"
                    }
                    className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-bold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700"
              >
                <LogIn className="h-4 w-4" />
                <span>
                  {loginMode === "admin"
                    ? "Sign In as Admin"
                    : "Start My Learning Quest →"}
                </span>
              </button>
            </form>

            {/* Quick-Fill Demo Buttons for Convenience */}
            <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                One-Click Quick Login:
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    login("admin", "admin123");
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-extrabold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>Quick Login: Admin (admin / admin123)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const firstChild = studentsList[0];
                    if (firstChild) {
                      login(firstChild.username || "leo", firstChild.password || "1234");
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-extrabold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                >
                  <span>{studentsList[0]?.avatar || "🦊"}</span>
                  <span>
                    Quick Login: {studentsList[0]?.name || "Leo"} (
                    {studentsList[0]?.username || "leo"} /{" "}
                    {studentsList[0]?.password || "1234"})
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

