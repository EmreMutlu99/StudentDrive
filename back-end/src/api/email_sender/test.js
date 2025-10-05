// test.js (verbose)
const path = require("path");
const fs = require("fs");
const dotenvPath = path.join(__dirname, ".env");

// 1) Load .env from this directory explicitly
if (fs.existsSync(dotenvPath)) {
  require("dotenv").config({ path: dotenvPath });
} else {
  console.warn(`[WARN] .env not found at ${dotenvPath}`);
}

// 2) Small arg parser
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...rest] = a.replace(/^--/, "").split("=");
    return [k, rest.join("=")];
  })
);

const VERBOSE = !!args.verbose;

// 3) Basic env/config
const DEFAULT_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const API_KEY = process.env.EMAIL_API_KEY;
const baseUrl = args.url || DEFAULT_URL;
const to = (args.to || process.env.TEST_TO || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const header = args.header || "Test Email from API";
const subject = args.subject || header;
const content =
  args.content ||
  "<p>Hello 👋</p><p>This is a <strong>test</strong> email sent from the API test script.</p>";

console.log("=== Email API Test ===");
console.log("Node version:", process.version);
console.log("Working dir:", process.cwd());
console.log("Script dir :", __dirname);
console.log("ENV .env  :", fs.existsSync(dotenvPath) ? "FOUND" : "MISSING");
console.log("Base URL  :", baseUrl);
console.log("Recipients:", to.length ? to : "(none)");
console.log("Subject   :", subject);
console.log("Header    :", header);
console.log("Has API key:", API_KEY ? "YES" : "NO");

if (!API_KEY) {
  console.error("[FATAL] Missing EMAIL_API_KEY in .env");
  process.exit(2);
}

if (!to.length) {
  console.error(
    "[FATAL] No recipient: pass --to=email@example.com or set TEST_TO in .env (comma-separated)."
  );
  process.exit(3);
}

if (typeof fetch !== "function") {
  console.error(
    "[FATAL] global fetch is not available. Use Node 18+ or install node-fetch."
  );
  process.exit(4);
}

// 4) Build payload
const payload = { to, header, subject, content };
if (VERBOSE) {
  console.log("[DEBUG] Payload:", JSON.stringify(payload, null, 2));
}

// 5) Fire request with a manual timeout
const controller = new AbortController();
const timeoutMs = Number(args.timeout || 15000);
const timeout = setTimeout(() => {
  controller.abort();
}, timeoutMs);

(async () => {
  try {
    const url = `${baseUrl.replace(/\/+$/, "")}/api/email/send`;
    if (VERBOSE) console.log("[DEBUG] POST", url);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    console.log("[INFO] HTTP", res.status, res.statusText);
    if (VERBOSE) console.log("[DEBUG] Raw response:", text);

    if (!res.ok) {
      console.error("[FATAL] Request failed:", data);
      process.exit(1);
    }

    console.log("✅ Success:", data);
    process.exit(0);
  } catch (err) {
    if (err.name === "AbortError") {
      console.error(`[FATAL] Request timed out after ${timeoutMs} ms`);
    } else {
      console.error("❌ Error:", err && err.stack ? err.stack : err);
    }
    process.exit(1);
  } finally {
    clearTimeout(timeout);
  }
})();

// 6) Catch anything stray
process.on("unhandledRejection", (e) => {
  console.error("[UNHANDLED REJECTION]", e);
});
process.on("uncaughtException", (e) => {
  console.error("[UNCAUGHT EXCEPTION]", e);
});
