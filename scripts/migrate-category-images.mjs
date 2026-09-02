import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse .env manually (avoid dotenv dependency)
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

const CATEGORY_SLUG_MAP = {
  "cat-rings.png": "rings",
  "cat-necklaces.png": "necklaces",
  "cat-earrings.png": "earrings",
  "cat-bracelets.png": "bracelets",
  "cat-mangalsutra.png": "mangalsutra",
  "cat-pendants.png": "pendants",
  "cat-bangles.png": "bangles",
  "cat-wedding.png": "wedding-sets",
};

const BUCKET = "category-images";
const ASSETS_DIR = join(__dirname, "..", "src", "assets");

async function main() {
  // 1. Sign in as admin
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    realtime: { transport: WebSocket },
  });
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  if (authError) { console.error("Auth error:", authError.message); process.exit(1); }
  console.log(`Signed in as ${authData.user.email}`);

  // 2. Fetch existing categories
  const { data: categories, error: catError } = await supabase.from("categories").select("*");
  if (catError) { console.error("Fetch categories error:", catError.message); process.exit(1); }

  const catBySlug = new Map(categories.map((c) => [c.slug, c]));
  console.log(`\nFound ${categories.length} categories in DB`);
  categories.forEach((c) => console.log(`  ${c.slug}: image=${c.image ? "SET" : "NULL"}`));

  // 3. Upload images for categories that are missing image
  const files = readdirSync(ASSETS_DIR).filter((f) => f.startsWith("cat-") && f.endsWith(".png"));
  let uploaded = 0, skipped = 0, failed = 0;

  for (const file of files) {
    const slug = CATEGORY_SLUG_MAP[file];
    if (!slug) { console.warn(`  No slug mapping for ${file}, skipping`); continue; }

    const cat = catBySlug.get(slug);
    if (!cat) { console.warn(`  Category "${slug}" not found in DB, skipping`); continue; }

    if (cat.image && cat.image.trim()) {
      console.log(`  ${slug}: image already set, skipping`);
      skipped++;
      continue;
    }

    const filePath = join(ASSETS_DIR, file);
    const buffer = readFileSync(filePath);
    const mime = "image/png";
    const storagePath = `categories/${slug}.png`;

    console.log(`  Uploading ${file} -> ${slug} (${(buffer.length / 1024).toFixed(1)} KB)...`);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, { contentType: mime, upsert: true });

    if (uploadError) {
      console.error(`  Upload failed for ${file}: ${uploadError.message}`);
      failed++;
      continue;
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    const publicUrl = publicUrlData.publicUrl;
    console.log(`  Public URL: ${publicUrl}`);

    const { error: updateError } = await supabase
      .from("categories")
      .update({ image: publicUrl, updated_at: new Date().toISOString() })
      .eq("id", cat.id);

    if (updateError) {
      console.error(`  Update failed for ${slug}: ${updateError.message}`);
      failed++;
      continue;
    }

    console.log(`  ${slug}: image set to ${publicUrl}`);
    uploaded++;
  }

  console.log(`\nDone! Uploaded: ${uploaded}, Skipped: ${skipped}, Failed: ${failed}`);

  // 4. Verify
  const { data: updatedCats } = await supabase.from("categories").select("slug, image");
  if (updatedCats) {
    console.log("\nFinal state:");
    updatedCats.forEach((c) => console.log(`  ${c.slug}: ${c.image ? "SET" : "NULL"}`));
  }
}

main().catch(console.error);
