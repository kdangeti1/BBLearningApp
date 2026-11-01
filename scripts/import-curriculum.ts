import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";

/**
 * Curriculum Import Engine (CLI)
 * Parses 3rd_Grade_Curriculum.xlsx (expanding merged cells across columns/rows)
 * and extracts the 36-week Texas Bluebonnet Learning Grade 3 Scope & Sequence across:
 *   - Reading Language Arts (ELAR Units 1-10)
 *   - Foundational Skills (Units 1-10)
 *   - Mathematics (Modules 1-7)
 */
function importCurriculumExcel() {
  const excelPath = path.join(process.cwd(), "3rd_Grade_Curriculum.xlsx");
  if (!fs.existsSync(excelPath)) {
    console.error("Could not find 3rd_Grade_Curriculum.xlsx at:", excelPath);
    process.exit(1);
  }

  const workbook = XLSX.readFile(excelPath);
  const sheetName =
    workbook.SheetNames.find((n) => n.toLowerCase().includes("3rd")) ||
    workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<string[]>(sheet, {
    header: 1,
    defval: "",
  });

  // Expand merged cells so multi-week units and quarters populate every week column
  const merges = sheet["!merges"] || [];
  for (const m of merges) {
    const topVal = rows[m.s.r]?.[m.s.c] ?? "";
    for (let r = m.s.r; r <= m.e.r; r++) {
      if (!rows[r]) rows[r] = [];
      for (let c = m.s.c; c <= m.e.c; c++) {
        if (!rows[r][c]) {
          rows[r][c] = topVal;
        }
      }
    }
  }

  console.log(`=== Parsed ${path.basename(excelPath)} (Sheet: ${sheetName}) ===`);

  const schedule: Array<{
    quarter: string;
    week: string;
    dates: string;
    rlaUnit: string;
    foundationalUnit: string;
    mathModule: string;
  }> = [];

  // Detect horizontal layout (Row 2 starts with "Week #")
  const weekRowIdx = rows.findIndex((r) =>
    String(r?.[0] ?? "")
      .toLowerCase()
      .includes("week")
  );

  if (weekRowIdx !== -1) {
    const quarterRow = rows[1] || [];
    const weekRow = rows[weekRowIdx] || [];
    const datesRow = rows[weekRowIdx + 1] || [];
    const mathRow =
      rows.find((r) =>
        String(r?.[0] ?? "")
          .toLowerCase()
          .startsWith("math")
      ) ||
      rows[4] ||
      [];
    const elarRow =
      rows.find((r) =>
        String(r?.[0] ?? "")
          .toLowerCase()
          .startsWith("elar")
      ) ||
      rows[12] ||
      [];

    let currentQuarter = "1st Nine Weeks";
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

        schedule.push({
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
  }

  console.log(
    `Extracted ${schedule.length} instructional weeks across 4 Nine-Week Grading Periods.`
  );
  console.table(schedule.slice(0, 12));
}

importCurriculumExcel();
