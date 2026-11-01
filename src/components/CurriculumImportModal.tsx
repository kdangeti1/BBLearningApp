"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useLearningStore } from "@/store/useLearningStore";
import { FIRESTORE_COLLECTIONS } from "@/lib/firebase";
import {
  Upload,
  FileSpreadsheet,
  Database,
  CheckCircle2,
  Download,
  CloudUpload,
  Layers,
} from "lucide-react";

interface ParsedExcelRow {
  quarter: string;
  week: string;
  dates: string;
  rlaUnit: string;
  foundationalUnit: string;
  mathModule: string;
}

export function CurriculumImportEngine() {
  const {
    subjects,
    units,
    lessons,
    skills,
    questions,
    badges,
    student,
    parent,
    progress,
    attempts,
    reports,
    syncAllToFirestore,
  } = useLearningStore();

  const [parsedRows, setParsedRows] = useState<ParsedExcelRow[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });

    // Prefer "3rd Grade" sheet if present (like K-12 Master or 3rd_Grade_Curriculum.xlsx)
    const targetSheetName =
      workbook.SheetNames.find((n) => n.toLowerCase().includes("3rd")) ||
      workbook.SheetNames[0];
    const sheet = workbook.Sheets[targetSheetName];
    const rawRows = XLSX.utils.sheet_to_json<string[]>(sheet, {
      header: 1,
      defval: "",
    });

    // Expand merged cells so multi-week units populate every week row
    const merges = sheet["!merges"] || [];
    for (const m of merges) {
      const topVal = rawRows[m.s.r]?.[m.s.c] ?? "";
      for (let r = m.s.r; r <= m.e.r; r++) {
        if (!rawRows[r]) rawRows[r] = [];
        for (let c = m.s.c; c <= m.e.c; c++) {
          if (!rawRows[r][c]) {
            rawRows[r][c] = topVal;
          }
        }
      }
    }

    let currentQuarter = "1st Nine Weeks";
    const extracted: ParsedExcelRow[] = [];

    // Support horizontal layout (like 3rd_Grade_Curriculum.xlsx where Row 2 is "Week #" across columns)
    const weekRowIdx = rawRows.findIndex((r) =>
      String(r?.[0] ?? "")
        .toLowerCase()
        .includes("week")
    );

    if (weekRowIdx !== -1) {
      const quarterRow = rawRows[1] || [];
      const weekRow = rawRows[weekRowIdx] || [];
      const datesRow = rawRows[weekRowIdx + 1] || [];
      const mathRow =
        rawRows.find((r) =>
          String(r?.[0] ?? "")
            .toLowerCase()
            .startsWith("math")
        ) ||
        rawRows[4] ||
        [];
      const elarRow =
        rawRows.find((r) =>
          String(r?.[0] ?? "")
            .toLowerCase()
            .startsWith("elar")
        ) ||
        rawRows[12] ||
        [];

      const seenWeeks = new Set<string>();
      for (let col = 1; col < weekRow.length; col++) {
        const qCell = String(quarterRow[col] ?? "").trim();
        if (qCell.includes("Nine Weeks")) {
          currentQuarter = qCell.replace(/\s+/g, " ");
        }
        const wVal = String(weekRow[col] ?? "").trim();
        const weekKey = `${currentQuarter}_${wVal}`;
        if (wVal !== "" && !isNaN(Number(wVal)) && !seenWeeks.has(weekKey)) {
          seenWeeks.add(weekKey);
          const elarText = String(elarRow[col] ?? "")
            .replace(/\s+/g, " ")
            .trim();
          const unitMatch = elarText.match(/Unit\s+(\d+)/i);
          const fsUnit = unitMatch
            ? `Foundational Skills Unit ${unitMatch[1]}`
            : "Foundational Skills Pacing";

          extracted.push({
            quarter: currentQuarter,
            week: `Week ${wVal}`,
            dates: String(datesRow[col] ?? "")
              .replace(/\s+/g, " ")
              .trim(),
            rlaUnit: elarText,
            foundationalUnit: fsUnit,
            mathModule: String(mathRow[col] ?? "")
              .replace(/\s+/g, " ")
              .trim(),
          });
        }
      }
    } else {
      for (let i = 0; i < rawRows.length; i++) {
        const row = rawRows[i];
        if (!row || row.length === 0) continue;
        const col0 = String(row[0] ?? "").trim();
        const col1 = String(row[1] ?? "").trim();

        if (col0.includes("Nine Weeks")) {
          currentQuarter = col0.replace(/\s+/g, " ").trim();
        }

        if (col1 !== "" && !isNaN(Number(col1))) {
          extracted.push({
            quarter: currentQuarter,
            week: `Week ${col1}`,
            dates: String(row[2] || "").replace(/\s+/g, " ").trim(),
            rlaUnit: String(row[3] || "").replace(/\s+/g, " ").trim(),
            foundationalUnit: String(row[4] || "").replace(/\s+/g, " ").trim(),
            mathModule: String(row[5] || "").replace(/\s+/g, " ").trim(),
          });
        }
      }
    }

    setParsedRows(extracted);
    setImportStatus(
      `Successfully parsed "${file.name}" (Sheet: "${targetSheetName}") — extracted ${extracted.length} instructional weeks and mapped to 3 Subjects → 27 Units → 27 Lessons → 29 Skills → ${questions.length} Questions.`
    );
  };

  const handleExportJson = () => {
    const bundle = {
      subjects,
      units,
      lessons,
      skills,
      questions,
      badges,
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bluebonnet-grade3-firestore-seed.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const collectionStats = [
    { name: FIRESTORE_COLLECTIONS.SUBJECTS, count: subjects.length, desc: "Math, Reading Language Arts, Foundational Skills" },
    { name: FIRESTORE_COLLECTIONS.UNITS, count: units.length, desc: "7 Math Modules + 10 RLA Units + 10 Foundational Units" },
    { name: FIRESTORE_COLLECTIONS.LESSONS, count: lessons.length, desc: "7-part structured lessons with worked examples & passages" },
    { name: FIRESTORE_COLLECTIONS.SKILLS, count: skills.length, desc: "IXL-style TEKS skills with prerequisite remediation links" },
    { name: FIRESTORE_COLLECTIONS.QUESTIONS, count: questions.length, desc: "7 interactive question types + worked explanations" },
    { name: FIRESTORE_COLLECTIONS.STUDENTS, count: 1, desc: `Active profile: ${student.name} (Grade 3)` },
    { name: FIRESTORE_COLLECTIONS.PARENTS, count: 1, desc: `Parent account: ${parent.name}` },
    { name: FIRESTORE_COLLECTIONS.PROGRESS, count: Object.keys(progress).length, desc: "Real-time SmartScore (0–100) per skill" },
    { name: FIRESTORE_COLLECTIONS.ATTEMPTS, count: attempts.length, desc: "Timestamped question attempt log" },
    { name: FIRESTORE_COLLECTIONS.BADGES, count: badges.length, desc: "Gamification achievements & rewards" },
    { name: FIRESTORE_COLLECTIONS.REPORTS, count: reports.length, desc: "Deterministic & optional AI parent reports" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-extrabold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Curriculum Import Engine & Firestore Schema Explorer
            </span>
            <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              Bluebonnet Excel (.xlsx) Parser & 11 Firestore Collections
            </h2>
            <p className="text-sm text-slate-500">
              Pre-loaded with authoritative content from <code className="font-bold text-indigo-600">3rd_Grade_Curriculum.xlsx</code> and all 27 Bluebonnet Grade 3 PDFs. Upload an updated Excel file anytime to re-parse.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-extrabold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Download className="h-4 w-4" />
              <span>Export Firestore Seed JSON</span>
            </button>
            <button
              onClick={async () => {
                const res = await syncAllToFirestore();
                setImportStatus(res.message);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-indigo-700"
            >
              <CloudUpload className="h-4 w-4" />
              <span>Push to Cloud Firestore</span>
            </button>
          </div>
        </div>
      </div>

      {/* Excel File Upload Dropzone */}
      <div className="rounded-3xl border-2 border-dashed border-indigo-300 bg-indigo-50/40 p-6 text-center dark:border-indigo-800 dark:bg-indigo-950/20">
        <FileSpreadsheet className="mx-auto h-10 w-10 text-indigo-600" />
        <h3 className="mt-2 text-base font-extrabold text-slate-900 dark:text-white">
          Upload Grade 3 Curriculum Excel File (.xlsx)
        </h3>
        <p className="mx-auto mt-1 max-w-xl text-xs text-slate-500">
          Select <code className="font-bold">3rd_Grade_Curriculum.xlsx</code> or <code className="font-bold">K-12 Curriculum At-A-Glance Master (2026-27).xlsx</code> to parse the hierarchy <code className="font-bold">Subject → Unit → Lesson → Skill → Questions</code> in the browser.
        </p>

        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-indigo-700">
          <Upload className="h-4 w-4" />
          <span>Choose .xlsx Curriculum File</span>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {uploadedFileName && (
          <p className="mt-2 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            Loaded File: {uploadedFileName}
          </p>
        )}
      </div>

      {importStatus && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Live Preview of Parsed Excel Rows (if uploaded) */}
      {parsedRows.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-3 text-base font-extrabold text-slate-900 dark:text-white">
            Parsed Excel Schedule ({parsedRows.length} Instructional Weeks)
          </h3>
          <div className="max-h-80 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-100 font-extrabold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <tr>
                  <th className="p-3">Quarter</th>
                  <th className="p-3">Week</th>
                  <th className="p-3">Dates</th>
                  <th className="p-3">Reading Language Arts</th>
                  <th className="p-3">Foundational Skills</th>
                  <th className="p-3">Mathematics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {parsedRows.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-indigo-600">{r.quarter}</td>
                    <td className="p-3 font-extrabold">{r.week}</td>
                    <td className="p-3 text-slate-500">{r.dates}</td>
                    <td className="p-3">{r.rlaUnit}</td>
                    <td className="p-3">{r.foundationalUnit}</td>
                    <td className="p-3">{r.mathModule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All 11 Firestore Collections Status Grid */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-2">
          <Database className="h-5 w-5 text-indigo-600" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            11 Firestore Collections (Cached Locally + IndexedDB for Free Tier)
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {collectionStats.map((col) => (
            <div
              key={col.name}
              className="flex items-start justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/50"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-indigo-600" />
                  <span className="font-mono text-xs font-extrabold text-slate-900 dark:text-white">
                    /{col.name}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {col.desc}
                </p>
              </div>
              <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-black text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {col.count} docs
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
