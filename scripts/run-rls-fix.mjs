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
  console.log("Signed in");

  // Try to create policies directly using the SQL endpoint
  const token = (await supabase.auth.getSession()).data.session?.access_token;
  if (!token) { console.error("No token"); process.exit(1); }

  const sql = readFileSync(join(__dirname, "..", "supabase", "fix-product-categories-rls.sql"), "utf-8");

  // Try exec_sql RPC first
  let ok = false;
  for (const fn of ["exec_sql", "pgadmin_exec", "runsql"]) {
    console.log(`Trying ${fn}...`);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "apikey": SUPABASE_ANON_KEY,
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
    console.log("\nCould not auto-run SQL. Please run the SQL manually in Supabase SQL Editor:");
    console.log(sql);
    process.exit(1);
  }

  // Now try inserting the relationship again
  const { data: product } = await supabase.from("products").select("id").ilike("sku", "CM-OQ-002").maybeSingle();
  const { data: category } = await supabase.from("categories").select("id").eq("slug", "lucky").maybeSingle();
  if (product && category) {
    const { error: insErr } = await supabase.from("product_categories").insert({ product_id: product.id, category_id: category.id });
    if (insErr) console.error("Insert still failed:", insErr.message);
    else console.log("Relationship inserted successfully!");
  }
}

main().catch(console.error);
