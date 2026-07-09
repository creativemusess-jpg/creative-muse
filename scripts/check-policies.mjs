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
  console.log("Signed in\n");

  // Try to select from product_categories with current user
  console.log("=== Testing product_categories SELECT ===");
  const { data: selData, error: selErr } = await supabase.from("product_categories").select("*").limit(5);
  if (selErr) console.log("SELECT error:", selErr.message);
  else console.log(`SELECT returned ${selData?.length || 0} rows`);

  // Try a simple INSERT
  console.log("\n=== Testing product_categories INSERT ===");
  const { data: cat } = await supabase.from("categories").select("id").limit(1).single();
  const { data: prod } = await supabase.from("products").select("id").limit(1).single();
  if (cat && prod) {
    const { data: insData, error: insErr } = await supabase
      .from("product_categories")
      .insert({ product_id: prod.id, category_id: cat.id })
      .select();
    if (insErr) {
      console.log("INSERT error:", insErr.message);
      console.log("INSERT details:", JSON.stringify(insErr));
    } else {
      console.log("INSERT succeeded:", insData);
      // Clean up test insert
      await supabase.from("product_categories").delete().eq("product_id", prod.id).eq("category_id", cat.id);
    }
  } else {
    console.log("Could not find categories or products for test");
  }
}

main().catch(console.error);
