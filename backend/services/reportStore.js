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

function nextId() {
  const n = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
  return `ML-${n}`;
}

export async function saveReport(record) {
  const all = await readAll();
  let reportId = record.reportId || nextId();
  while (all[reportId]) reportId = nextId();
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
