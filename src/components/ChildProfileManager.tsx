"use client";

import React, { useState } from "react";
import { useLearningStore } from "@/store/useLearningStore";
import {
  UserPlus,
  Users,
  KeyRound,
  BarChart3,
  Play,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  Flame,
  Trophy,
  Star,
} from "lucide-react";

const AVATAR_OPTIONS = ["🦊", "🦁", "🐼", "🦄", "🚀", "🦖", "🦋", "🦉", "🐬", "🌟"];

export function ChildProfileManager() {
  const {
    studentsList,
    student,
    allStudentsProgress,
    createChildProfile,
    updateChildPassword,
    deleteChildProfile,
    selectActiveChild,
    setActiveTab,
  } = useLearningStore();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("🦁");
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(25);
  const [dailyGoalTargetQuestions, setDailyGoalTargetQuestions] = useState(15);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [editingPasswordId, setEditingPasswordId] = useState<string | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState<string>("");

  const handleCreateChild = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createChildProfile({
      name,
      username,
      password,
      avatar,
      dailyGoalMinutes,
      dailyGoalTargetQuestions,
    });

    if (res.success) {
      setStatusMessage({ type: "success", text: res.message });
      setName("");
      setUsername("");
      setPassword("");
    } else {
      setStatusMessage({ type: "error", text: res.message });
    }
  };

  const handleSaveNewPassword = async (studentId: string) => {
    if (!newPasswordInput.trim()) return;
    await updateChildPassword(studentId, newPasswordInput.trim());
    setEditingPasswordId(null);
    setNewPasswordInput("");
    setStatusMessage({
      type: "success",
      text: "Updated child password and synced to Cloud Firestore!",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 p-6 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-extrabold">
              Admin Portal (ID: admin) • Cloud Firestore Synced
            </span>
            <h2 className="mt-2 text-2xl font-black">
              Child Profile & Password Manager
            </h2>
            <p className="mt-1 text-sm text-indigo-100">
              Create child login accounts with a simple username and password so each child can log in and track their own Grade 3 Bluebonnet progress.
            </p>
          </div>
          <div className="rounded-2xl bg-white/15 px-4 py-3 text-xs font-bold backdrop-blur-sm">
            <div>Total Child Profiles: {studentsList.length}</div>
            <div className="mt-0.5 text-amber-300">
              Currently Viewing: {student.avatar} {student.name}
            </div>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`flex items-center gap-2 rounded-2xl border p-4 text-xs font-extrabold ${
            statusMessage.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
              : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200"
          }`}
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Create New Child Profile Form (5 cols) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Create New Child Profile
              </h3>
              <p className="text-xs text-slate-500">
                Set a simple login ID and password for your child
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateChild} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-extrabold text-slate-700 dark:text-slate-300">
                Child&apos;s Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!username) {
                    setUsername(
                      e.target.value
                        .trim()
                        .toLowerCase()
                        .split(" ")[0]
                        .replace(/[^a-z0-9]/g, "")
                    );
                  }
                }}
                placeholder="e.g., Maya Patel"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-extrabold text-slate-700 dark:text-slate-300">
                  Child Login ID (Username)
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))
                  }
                  placeholder="e.g., maya"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-extrabold text-slate-700 dark:text-slate-300">
                  Child Password / PIN
                </label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g., 5678"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Avatar Picker */}
            <div>
              <label className="mb-1.5 block text-xs font-extrabold text-slate-700 dark:text-slate-300">
                Choose Fun Grade 3 Avatar
              </label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatar(emoji)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 text-lg transition ${
                      avatar === emoji
                        ? "border-indigo-600 bg-indigo-50 scale-110 shadow-sm dark:bg-indigo-950"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Goals */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-extrabold text-slate-700 dark:text-slate-300">
                  Daily Goal (Minutes)
                </label>
                <input
                  type="number"
                  min={10}
                  max={60}
                  value={dailyGoalMinutes}
                  onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-bold dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-extrabold text-slate-700 dark:text-slate-300">
                  Daily Questions Goal
                </label>
                <input
                  type="number"
                  min={5}
                  max={50}
                  value={dailyGoalTargetQuestions}
                  onChange={(e) =>
                    setDailyGoalTargetQuestions(Number(e.target.value))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-bold dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3 text-sm font-extrabold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700"
            >
              <UserPlus className="h-4 w-4" />
              <span>Create Child Profile & Save to Firestore</span>
            </button>
          </form>
        </div>

        {/* Right Column: Existing Child Profiles List (7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Active Child Profiles ({studentsList.length})
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Click any child to inspect their progress or reset password
              </span>
            </div>

            <div className="space-y-3">
              {studentsList.map((child) => {
                const isSelected = child.id === student.id;
                const childProgMap = allStudentsProgress[child.id] || {};
                const progValues = Object.values(childProgMap);
                const avgScore =
                  progValues.length > 0
                    ? Math.round(
                        progValues.reduce((a, b) => a + b.smartScore, 0) /
                          progValues.length
                      )
                    : 0;
                const masteredCount = progValues.filter(
                  (p) => p.smartScore >= 80
                ).length;

                return (
                  <div
                    key={child.id}
                    className={`rounded-2xl border-2 p-5 transition ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/40 dark:border-indigo-500 dark:bg-indigo-950/20"
                        : "border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm dark:bg-slate-900">
                          {child.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-black text-slate-900 dark:text-white">
                              {child.name}
                            </h4>
                            {isSelected && (
                              <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                                Selected
                              </span>
                            )}
                          </div>

                          {/* Login Credentials Row */}
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs">
                            <span className="rounded-lg bg-white px-2.5 py-1 font-mono font-bold text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
                              Login ID: <strong className="text-indigo-600">{child.username}</strong>
                            </span>
                            <span className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 font-mono font-bold text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
                              Password:{" "}
                              <strong className="text-emerald-600">
                                {showPasswords[child.id]
                                  ? child.password
                                  : "••••"}
                              </strong>
                              <button
                                type="button"
                                onClick={() =>
                                  setShowPasswords((prev) => ({
                                    ...prev,
                                    [child.id]: !prev[child.id],
                                  }))
                                }
                                className="text-slate-400 hover:text-slate-700"
                                title="Show/Hide Password"
                              >
                                {showPasswords[child.id] ? (
                                  <EyeOff className="h-3.5 w-3.5" />
                                ) : (
                                  <Eye className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stats Pills */}
                      <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold">
                        <span className="flex items-center gap-1 rounded-xl bg-white px-2.5 py-1 text-indigo-700 shadow-sm dark:bg-slate-900 dark:text-indigo-300">
                          <Trophy className="h-3.5 w-3.5" /> {child.xp} XP
                        </span>
                        <span className="flex items-center gap-1 rounded-xl bg-white px-2.5 py-1 text-amber-700 shadow-sm dark:bg-slate-900 dark:text-amber-300">
                          <Star className="h-3.5 w-3.5 fill-amber-400" />{" "}
                          {masteredCount} Mastered
                        </span>
                        <span className="flex items-center gap-1 rounded-xl bg-white px-2.5 py-1 text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-300">
                          Avg SmartScore: {avgScore}/100
                        </span>
                        <span className="flex items-center gap-1 rounded-xl bg-white px-2.5 py-1 text-orange-700 shadow-sm dark:bg-slate-900 dark:text-orange-300">
                          <Flame className="h-3.5 w-3.5 fill-orange-500" />{" "}
                          {child.streakDays}d
                        </span>
                      </div>
                    </div>

                    {/* Password Reset Inline Drawer */}
                    {editingPasswordId === child.id && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-indigo-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                        <input
                          type="text"
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          placeholder="Enter new password for child..."
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold dark:border-slate-700 dark:bg-slate-800"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveNewPassword(child.id)}
                          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white"
                        >
                          Save Password
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPasswordId(null)}
                          className="text-xs font-semibold text-slate-500"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/70 pt-3 dark:border-slate-700">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            selectActiveChild(child.id);
                            setActiveTab("parent_dashboard");
                          }}
                          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-indigo-700"
                        >
                          <BarChart3 className="h-3.5 w-3.5" />
                          <span>View {child.name.split(" ")[0]}&apos;s Progress Report</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            selectActiveChild(child.id);
                            setActiveTab("dashboard");
                          }}
                          className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-extrabold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        >
                          <Play className="h-3.5 w-3.5" />
                          <span>Open Student Quest</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPasswordId(child.id);
                            setNewPasswordInput(child.password);
                          }}
                          className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                          <span>Change Password</span>
                        </button>

                        {studentsList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => deleteChildProfile(child.id)}
                            className="rounded-xl border border-rose-200 bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950"
                            title="Delete Profile"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

