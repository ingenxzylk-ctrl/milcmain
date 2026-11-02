import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const FILE = path.join(DATA_DIR, "reports.json");

async function readAll() {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writeAll(data) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
}

function nextId(existingReports = {}) {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const dateStr = `${dd}${mm}${yyyy}`;
  const prefix = `TR-${dateStr}-`;

  const existingNums = Object.keys(existingReports)
    .filter((id) => id.startsWith(prefix))
    .map((id) => {
      const suffix = id.slice(prefix.length);
      const parsed = parseInt(suffix, 10);
      return Number.isFinite(parsed) ? parsed : 0;
    });

  const nextSeq = (existingNums.length ? Math.max(...existingNums) : 0) + 1;
  const seqStr = String(nextSeq).padStart(2, "0");
  return `${prefix}${seqStr}`;
}

export async function saveReport(record) {
  const all = await readAll();
  let reportId = record.reportId || nextId(all);
  while (all[reportId]) {
    // If collision, bump sequence
    const parts = reportId.split("-");
    const curSeq = parseInt(parts[parts.length - 1], 10) || 0;
    parts[parts.length - 1] = String(curSeq + 1).padStart(2, "0");
    reportId = parts.join("-");
  }
  const stored = {
    reportId,
    reportDate: new Date().toISOString(),
    aboutMe: record.aboutMe || {},
    skinProfile: record.skinProfile || {},
    lifestyle: record.lifestyle || {},
    skinAnalysis: record.skinAnalysis || null,
  };
  all[reportId] = stored;
  await writeAll(all);
  return stored;
}

export async function getReport(reportId) {
  const all = await readAll();
  return all[String(reportId || "").trim()] || null;
}
