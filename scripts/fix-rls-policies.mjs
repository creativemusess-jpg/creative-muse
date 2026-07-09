import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const envContent = readFileSync(join(__dirname, "..", ".env"), "utf-8");
const envVars = Object.fromEntries(
  envContent.split("\n").filter(Boolean).map((l) => {
    const eq = l.indexOf("=");
    return [l.slice(0, eq), l.slice(eq + 1)];
  }),
);

const SUPABASE_URL = envVars.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = envVars.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = "padariyaarth@gmail.com";
const ADMIN_PASSWORD = "12345678";

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

  // Read and execute the SQL migration
  const sql = readFileSync(join(__dirname, "..", "supabase", "fix-product-categories-rls.sql"), "utf-8");
  console.log("Executing SQL...\n");

  const { error } = await supabase.rpc("exec_sql", { sql_text: sql });
  if (error) {
    // exec_sql might not exist; try raw query
    console.log("RPC not available, trying direct SQL via REST...");
    // Use Supabase REST API directly
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    if (!token) { console.error("No access token"); process.exit(1); }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/pgadmin_exec`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "apikey": SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ sql_text: sql }),
    });
    if (res.ok) {
      const result = await res.json();
      console.log("SQL result:", result);
    } else {
      console.log("pgadmin_exec not available either. Trying direct policy creation...");
      // Create policies via individual SQL statements using the REST API
      const statements = sql
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s && !s.startsWith("--") && !s.startsWith("DO") && !s.startsWith("SELECT"));
      
      for (const stmt of statements) {
        const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/pgadmin_exec`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ sql_text: stmt + ";" }),
        });
        console.log(`  Executed: ${stmt.substring(0, 60)}... -> ${r.status}`);
      }
    }
  } else {
    console.log("SQL executed successfully");
  }

  // Now create the policies using a simpler approach - manage via the management API
  console.log("\nAttempting direct policy creation via SQL endpoint...");
  const { data: policies } = await supabase.rpc("get_policies_info");
  console.log("Policies:", policies);
}

main().catch(console.error);
