import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const envContent = readFileSync(join(rootDir, ".env"), "utf-8");
const envVars = Object.fromEntries(
  envContent.split("\n").filter(Boolean).map((l) => {
    const eq = l.indexOf("=");
    return [l.slice(0, eq), l.slice(eq + 1)];
  }),
);

const SUPABASE_URL = envVars.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = envVars.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || envVars.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || envVars.ADMIN_PASSWORD;
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment.");
  process.exit(1);
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    realtime: { transport: WebSocket },
  });

  const { error: authError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  if (authError) { console.error("Auth error:", authError.message); process.exit(1); }
  console.log("Signed in as admin");

  const token = (await supabase.auth.getSession()).data.session?.access_token;
  if (!token) { console.error("No token"); process.exit(1); }

  const sql = readFileSync(
    join(rootDir, "supabase", "migration-shoppable-reels-storage-hardened.sql"),
    "utf-8",
  );

  let ok = false;
  for (const fn of ["exec_sql", "pgadmin_exec", "runsql"]) {
    console.log(`Trying ${fn}...`);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ sql_text: sql }),
    });
    if (res.ok) {
      console.log(`${fn} succeeded`);
      ok = true;
      break;
    }
    const txt = await res.text();
    console.log(`${fn} failed: ${res.status} ${txt.substring(0, 200)}`);
  }

  if (!ok) {
    console.error("Could not auto-run SQL. Run the migration manually in the Supabase SQL Editor.");
    process.exit(1);
  }

  // Verify: bucket + table
  const b = await fetch(`${SUPABASE_URL}/storage/v1/bucket/reel-videos`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  });
  console.log("Bucket check status:", b.status);
  if (b.status === 200) {
    const bucket = await b.json();
    console.log("Bucket:", JSON.stringify(bucket));
  } else {
    console.log("Bucket body:", (await b.text()).substring(0, 200));
  }
}

main().catch(console.error);
