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

  // Sign in as admin
  const { data: auth, error: authError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  if (authError) { console.error("Auth error:", authError.message); process.exit(1); }
  console.log(`Signed in as ${auth.user.email}`);

  // Find Heritage Necklace
  const { data: product, error: prodError } = await supabase
    .from("products")
    .select("id, name, sku")
    .eq("sku", "CM-OQ-002")
    .maybeSingle();
  if (prodError || !product) {
    console.error("Heritage Necklace not found by SKU. Trying by name...");
    const { data: p2 } = await supabase.from("products").select("id, name, sku").ilike("name", "%Heritage%").maybeSingle();
    if (!p2) { console.error("Heritage Necklace not found at all."); process.exit(1); }
    product = p2;
  }
  console.log(`Found product: ${product.name} (${product.id})`);

  // Find Lucky category
  const { data: category, error: catError } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("slug", "lucky")
    .maybeSingle();
  if (catError || !category) {
    console.error("Lucky category not found."); process.exit(1);
  }
  console.log(`Found category: ${category.name} (${category.id})`);

  // Check existing relationship
  const { data: existing } = await supabase
    .from("product_categories")
    .select("*")
    .eq("product_id", product.id)
    .eq("category_id", category.id)
    .maybeSingle();

  if (existing) {
    console.log("Relationship already exists. Nothing to repair.");
    process.exit(0);
  }

  // Try to insert relationship
  console.log("Inserting product_categories relationship...");
  const { data: insertResult, error: insertError } = await supabase
    .from("product_categories")
    .insert({ product_id: product.id, category_id: category.id })
    .select()
    .maybeSingle();

  if (insertError) {
    console.error("INSERT failed:", insertError.message);
    console.log("\nThis confirms missing RLS INSERT policy on product_categories.");
    console.log("Please run the SQL in supabase/fix-product-categories-rls.sql in the Supabase SQL Editor.");
    process.exit(1);
  }

  console.log("Relationship inserted successfully:", insertResult);

  // Verify
  const { data: verify } = await supabase
    .from("product_categories")
    .select("*, categories(name), products(name)")
    .eq("product_id", product.id);
  console.log("\nAll categories for Heritage Necklace:", JSON.stringify(verify, null, 2));
}

main().catch(console.error);
