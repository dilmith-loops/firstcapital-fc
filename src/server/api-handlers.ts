import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getDbPool } from "../lib/db.server";

export interface CreateLeadPayload {
  name: string;
  email?: string;
  phone?: string;
  gender?: string;
  profileKey?: string;
  resultCode?: string;
  profileName?: string;
  resultProfile?: string;
  matchedProduct?: string;
  answers?: Record<number, string>;
  source?: string;
  status?: string;
  notes?: string;
}

export interface UpdateLeadResultPayload {
  leadId: number | string;
  resultCode: string;
  resultProfile: string;
  matchedProduct?: string;
  answers: Record<number, string>;
}

const VALID_RESULT_CODES = new Set(["A", "B", "C", "D"]);

const DEFAULT_PROFILES: Record<string, { name: string; product: string }> = {
  A: { name: "The Keep-It-Cool Investor", product: "First Capital Money Market Fund (FCMMF)" },
  B: { name: "The Smooth Operator", product: "First Capital Fixed Income Fund (FCFIF)" },
  C: { name: "The Patient Player", product: "Government Securities (Treasury Bonds & Bills)" },
  D: { name: "The Opportunity Hunter", product: "Equity & Share Market Investments" },
};

/**
 * Strip null bytes, HTML tags, and non-printable control characters.
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/\0/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/[\x00-\x1F\x7F]/g, "")
    .trim();
}

/**
 * Sanitize and validate full name.
 */
export function sanitizeName(raw: unknown): string {
  const sanitized = sanitizeString(raw).replace(/[^\p{L}\s.'-]/gu, "").replace(/\s+/g, " ").trim();
  return sanitized || "Anonymous Investor";
}

/**
 * Sanitize and validate email address.
 */
export function sanitizeEmail(raw: unknown): string {
  const sanitized = sanitizeString(raw).toLowerCase();
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (sanitized && emailRegex.test(sanitized)) {
    return sanitized.slice(0, 150);
  }
  return sanitized ? sanitized.slice(0, 150) : "N/A";
}

/**
 * Sanitize and validate phone number.
 */
export function sanitizePhone(raw: unknown): string {
  const str = sanitizeString(raw);
  const sanitized = str.replace(/[^\d+\-()\s]/g, "").replace(/\s+/g, " ").trim();
  return sanitized || "N/A";
}

/**
 * Validate and sanitize leadId.
 */
export function sanitizeLeadId(raw: unknown): number {
  if (typeof raw === "string") {
    const digits = raw.replace(/\D/g, "");
    const parsed = parseInt(digits, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid lead ID.");
  }
  return id;
}

/**
 * Sanitize result code against strict whitelist (A, B, C, D).
 */
export function sanitizeResultCode(raw: unknown): string {
  if (typeof raw !== "string") return "A";
  const upper = sanitizeString(raw).toUpperCase();
  return VALID_RESULT_CODES.has(upper) ? upper : "A";
}

/**
 * Sanitize answers map.
 */
export function sanitizeAnswers(raw: unknown): Record<number, string> | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const sanitized: Record<number, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    const qId = Number(key);
    if (Number.isInteger(qId) && qId >= 1 && qId <= 30) {
      if (typeof value === "string") {
        const valUpper = sanitizeString(value).toUpperCase();
        if (VALID_RESULT_CODES.has(valUpper)) {
          sanitized[qId] = valUpper;
        }
      }
    }
  }
  return Object.keys(sanitized).length > 0 ? sanitized : null;
}

/**
 * Insert a lead directly with all available fields into MySQL
 */
export async function handleCreateLead(payload: CreateLeadPayload): Promise<{ success: boolean; leadId: number }> {
  const cleanName = sanitizeName(payload.name);
  const cleanEmail = sanitizeEmail(payload.email);
  const cleanPhone = sanitizePhone(payload.phone);
  const cleanGender = sanitizeString(payload.gender || "male").toLowerCase().slice(0, 10);
  const resultCode = sanitizeResultCode(payload.resultCode || payload.profileKey || "A");
  const fallbackProfile = DEFAULT_PROFILES[resultCode] || DEFAULT_PROFILES["A"] || { name: "Investor", product: "First Capital Money Market Fund" };
  const resultProfile = sanitizeString(payload.resultProfile || payload.profileName || fallbackProfile.name || "Investor").slice(0, 100);
  const matchedProduct = sanitizeString(payload.matchedProduct || fallbackProfile.product || "First Capital Money Market Fund").slice(0, 255);
  const cleanAnswers = sanitizeAnswers(payload.answers);
  const status = sanitizeString(payload.status || "NEW").toUpperCase().slice(0, 20);
  const notes = sanitizeString(payload.notes || "");

  const pool = getDbPool();

  try {
    // Try full INSERT including all columns
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO quiz_leads (name, email, phone, gender, result_code, result_profile, matched_product, answers_json, status, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cleanName,
        cleanEmail,
        cleanPhone,
        cleanGender,
        resultCode,
        resultProfile,
        matchedProduct,
        cleanAnswers ? JSON.stringify(cleanAnswers) : null,
        status,
        notes || null,
      ]
    );

    return {
      success: true,
      leadId: result.insertId,
    };
  } catch (err: any) {
    // Fallback if older table schema lacks gender or matched_product
    const [fallbackResult] = await pool.execute<ResultSetHeader>(
      `INSERT INTO quiz_leads (name, email, phone, result_code, result_profile, answers_json, status, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cleanName,
        cleanEmail,
        cleanPhone,
        resultCode,
        resultProfile,
        cleanAnswers ? JSON.stringify(cleanAnswers) : null,
        status,
        notes || null,
      ]
    );

    return {
      success: true,
      leadId: fallbackResult.insertId,
    };
  }
}

export async function handleUpdateLeadResult(payload: UpdateLeadResultPayload): Promise<{ success: boolean }> {
  const cleanLeadId = sanitizeLeadId(payload.leadId);
  const cleanResultCode = sanitizeResultCode(payload.resultCode);
  const cleanResultProfile = sanitizeString(payload.resultProfile).slice(0, 100);
  const cleanMatchedProduct = sanitizeString(payload.matchedProduct || "").slice(0, 255);
  const cleanAnswers = sanitizeAnswers(payload.answers);

  const pool = getDbPool();
  try {
    await pool.execute(
      "UPDATE quiz_leads SET result_code = ?, result_profile = ?, matched_product = ?, answers_json = ? WHERE id = ?",
      [
        cleanResultCode,
        cleanResultProfile || null,
        cleanMatchedProduct || null,
        cleanAnswers ? JSON.stringify(cleanAnswers) : null,
        cleanLeadId,
      ]
    );
  } catch {
    await pool.execute(
      "UPDATE quiz_leads SET result_code = ?, result_profile = ?, answers_json = ? WHERE id = ?",
      [
        cleanResultCode,
        cleanResultProfile || null,
        cleanAnswers ? JSON.stringify(cleanAnswers) : null,
        cleanLeadId,
      ]
    );
  }

  return { success: true };
}

// ---------------- Admin Backend Handlers ----------------

export async function handleGetDbStatus(): Promise<{
  connected: boolean;
  host: string;
  database: string;
  port: number;
  totalLeads: number;
  timestamp: string;
  tables: string[];
  error?: string;
}> {
  try {
    const pool = getDbPool();
    const host = process.env["DB_HOST"] || "localhost";
    const database = process.env["DB_NAME"] || "firstcapital";
    const port = Number(process.env["DB_PORT"]) || 3306;

    // Ping / test query
    await pool.query("SELECT 1");

    // Get lead count
    const [rows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS count FROM quiz_leads");
    const firstRow = rows[0];
    const totalLeads = (firstRow && firstRow["count"]) || 0;

    // Get table list
    const [tableRows] = await pool.query<RowDataPacket[]>("SHOW TABLES");
    const tables = tableRows.map((r) => Object.values(r)[0] as string);

    return {
      connected: true,
      host,
      database,
      port,
      totalLeads,
      timestamp: new Date().toISOString(),
      tables,
    };
  } catch (err: any) {
    return {
      connected: false,
      host: process.env["DB_HOST"] || "localhost",
      database: process.env["DB_NAME"] || "firstcapital",
      port: Number(process.env["DB_PORT"]) || 3306,
      totalLeads: 0,
      timestamp: new Date().toISOString(),
      tables: [],
      error: err?.message || "Database connection failed",
    };
  }
}

export async function handleGetLeads(): Promise<{ success: boolean; leads: any[] }> {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM quiz_leads ORDER BY created_at DESC"
  );

  const mapped = rows.map((r: any) => {
    let answers: Record<number, string> = {};
    if (r["answers_json"]) {
      try {
        answers = typeof r["answers_json"] === "string" ? JSON.parse(r["answers_json"]) : r["answers_json"];
      } catch {
        answers = {};
      }
    }

    const profileKey = (r["result_code"] || "A").toUpperCase();
    const profileNames: Record<string, string> = {
      A: "The Keep-It-Cool Investor",
      B: "The Smooth Operator",
      C: "The Patient Player",
      D: "The Opportunity Hunter",
    };
    const productNames: Record<string, string> = {
      A: "First Capital Money Market Fund (FCMMF)",
      B: "First Capital Fixed Income Fund (FCFIF)",
      C: "Government Securities (Treasury Bonds & Bills)",
      D: "Equity & Share Market Investments",
    };

    return {
      id: `FC-${r["id"]}`,
      dbId: r["id"],
      createdAt: r["created_at"] ? new Date(r["created_at"]).toISOString() : new Date().toISOString(),
      name: r["name"] || "Anonymous",
      email: r["email"] || "N/A",
      phone: r["phone"] || "N/A",
      gender: r["gender"] || "male",
      profileKey,
      profileName: r["result_profile"] || profileNames[profileKey] || "The Keep-It-Cool Investor",
      matchedProduct: r["matched_product"] || productNames[profileKey] || "First Capital Money Market Fund (FCMMF)",
      status: (r["status"] || "NEW").toUpperCase(),
      notes: r["notes"] || "",
      answers,
      source: "Web Quiz Database",
    };
  });

  return {
    success: true,
    leads: mapped,
  };
}

export async function handleUpdateLead(payload: { id: string | number; status?: string; notes?: string }): Promise<{ success: boolean }> {
  const pool = getDbPool();
  const numericId = typeof payload.id === "string" ? parseInt(payload.id.replace(/\D/g, ""), 10) : payload.id;
  if (!numericId || isNaN(numericId)) {
    throw new Error("Invalid lead ID");
  }

  const updates: string[] = [];
  const values: any[] = [];

  if (payload.status !== undefined) {
    updates.push("status = ?");
    values.push(sanitizeString(payload.status).toUpperCase());
  }

  if (payload.notes !== undefined) {
    updates.push("notes = ?");
    values.push(sanitizeString(payload.notes));
  }

  if (updates.length === 0) {
    return { success: true };
  }

  values.push(numericId);
  await pool.execute(
    `UPDATE quiz_leads SET ${updates.join(", ")} WHERE id = ?`,
    values
  );

  return { success: true };
}

export async function handleDeleteLead(id: string | number): Promise<{ success: boolean }> {
  const pool = getDbPool();
  const numericId = typeof id === "string" ? parseInt(id.replace(/\D/g, ""), 10) : id;
  if (!numericId || isNaN(numericId)) {
    throw new Error("Invalid lead ID");
  }

  await pool.execute("DELETE FROM quiz_leads WHERE id = ?", [numericId]);
  return { success: true };
}

export async function handleGetAppSetting(key: string): Promise<any> {
  const pool = getDbPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT setting_value FROM app_settings WHERE setting_key = ?",
    [key]
  );
  if (rows.length === 0) return null;
  const row0 = rows[0];
  if (!row0) return null;
  const val = row0["setting_value"];
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
}

export async function handleSaveAppSetting(key: string, value: any): Promise<{ success: boolean }> {
  const pool = getDbPool();
  const valString = typeof value === "string" ? value : JSON.stringify(value);
  await pool.execute(
    "INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)",
    [key, valString]
  );
  return { success: true };
}
