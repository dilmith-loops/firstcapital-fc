import mysql from "mysql2/promise";
import fs from "node:fs";
import path from "node:path";

let pool: mysql.Pool | null = null;

function loadEnvFile(): void {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const [key, ...rest] = trimmed.split("=");
        if (key && rest.length > 0) {
          const val = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  } catch {
    // Ignore error
  }
}

export function getDbPool(): mysql.Pool {
  if (!pool) {
    loadEnvFile();
    const dbHost = process.env["DB_HOST"] || "localhost";
    const dbPort = Number(process.env["DB_PORT"]) || 3306;
    const dbUser = process.env["DB_USER"] || "u451149423_firstcapital";
    const dbPassword = process.env["DB_PASSWORD"] || process.env["DB_PASS"] || "3Sr>26Wr";
    const dbName = process.env["DB_NAME"] || "u451149423_firstcapital";

    pool = mysql.createPool({
      host: dbHost === "localhost" ? "127.0.0.1" : dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}
