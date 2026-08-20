import { supabase } from "../supabase";
import { adminApi } from "./admin";

export interface ProductWithImages {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  current_price: number;
  original_price: number | null;
  cost_price: number | null;
  discount_percentage: number | null;
  badge: string | null;
  status: string;
  stock_quantity: number | null;
  low_stock_threshold: number | null;
  material: string | null;
  metal_type: string | null;
  metal_colour: string | null;
  gold_purity: string | null;
  gross_weight: string | null;
  net_weight: string | null;
  gemstone: string | null;
  rating_average: number;
  review_count: number;
  seo_title: string | null;
  seo_description: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;
  social_image: string | null;
  image_alt_text: string | null;
  card_label: string | null;
  subcategory_id: string | null;
  tags: string[];
  published_at: string | null;
  publish_at: string | null;
  archived_at: string | null;
  archived_by: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  main_image?: { id: string; url: string; alt_text: string | null; is_main: boolean } | null;
  images?: {
    id: string;
    url: string;
    alt_text: string | null;
    is_main: boolean;
    sort_order: number;
  }[];
  images_360?: { id: string; url: string; frame_order: number }[];
  category_ids?: string[];
  category_name?: string;
  subcategory_name?: string;
  collection_ids?: string[];
  flags?: {
    id: string;
    name: string;
    slug: string;
    badge_label: string | null;
    badge_bg_color: string | null;
    badge_text_color: string | null;
  }[];
  specifications?: {
    id: string;
    attribute_definition_id: string;
    name: string;
    value: string;
    sort_order: number;
  }[];
}

export interface ProductFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  collection?: string;
  status?: string;
  badge?: string;
  stock?: string;
  min_price?: number;
  max_price?: number;
  material?: string | string[];
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface ProductFormData {
  name: string;
  slug: string;
  short_description?: string;
  full_description?: string;
  current_price: number;
  original_price?: number;
  cost_price?: number;
  badge?: string | null;
  status: string;
  stock_quantity?: number;
  low_stock_threshold?: number;
  material?: string;
  metal_type?: string;
  metal_colour?: string;
  gold_purity?: string;
  gross_weight?: string;
  net_weight?: string;
  gemstone?: string;
  seo_title?: string;
  seo_description?: string;
  focus_keyword?: string;
  canonical_url?: string;
  social_image?: string;
  image_alt_text?: string;
  subcategory_id?: string | null;
  tags?: string[];
  category_ids?: string[];
  collection_ids?: string[];
  main_image_url?: string;
  gallery_images?: string[];
  images_360?: string[];
  publish_at?: string | null;
  card_label?: string | null;
}

const productSelect = `
  id, name, slug, short_description, full_description,
  current_price, original_price, cost_price, discount_percentage,
  badge, status, stock_quantity, low_stock_threshold,
  material, metal_type, metal_colour, gold_purity,
  gross_weight, net_weight, gemstone,
  rating_average, review_count,
  seo_title, seo_description, focus_keyword, canonical_url, social_image, image_alt_text,
  card_label, subcategory_id, tags,
  published_at, publish_at, archived_at, archived_by, created_at, updated_at,
  created_by, updated_by
`;

// Sentinels that always match zero rows (used to short-circuit empty filters
// without returning every product).
const ZERO_UUID = "00000000-0000-0000-0000-000000000000";

// A product is publicly visible only when it is active AND its schedule has
// arrived (publish_at is NULL = no scheduling restriction).
function visibilityOrFilter(now = new Date().toISOString()): string {
  return `publish_at.is.null,publish_at.lte.${now}`;
}

async function logAction(action: string, entityId?: string, oldValues?: any, newValues?: any) {
  try {
    await adminApi.logAction(action, "product", entityId, oldValues, newValues);
  } catch {}
}

async function getAdminUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

function mapProduct(row: any): ProductWithImages {
  return {
    ...row,
    current_price: Number(row.current_price),
    original_price: row.original_price ? Number(row.original_price) : null,
    cost_price: row.cost_price ? Number(row.cost_price) : null,
    discount_percentage: row.discount_percentage ? Number(row.discount_percentage) : null,
    rating_average: Number(row.rating_average) || 0,
    review_count: row.review_count ?? 0,
    stock_quantity: row.stock_quantity ?? null,
    low_stock_threshold: row.low_stock_threshold ?? 5,
    tags: row.tags ?? [],
    focus_keyword: row.focus_keyword ?? null,
    canonical_url: row.canonical_url ?? null,
    social_image: row.social_image ?? null,
    image_alt_text: row.image_alt_text ?? null,
    card_label: row.card_label ?? null,
    subcategory_id: row.subcategory_id ?? null,
  };
}

export const productsApi = {
  async list(
    filters: ProductFilters = {},
    opts: { publicOnly?: boolean; excludeArchived?: boolean } = {},
  ): Promise<{ data: ProductWithImages[]; count: number }> {
    let query = supabase.from("products").select(productSelect, { count: "exact" });

    if (opts.publicOnly) {
      // Restrict to storefront-visible rows: active AND schedule arrived.
      query = query.eq("status", "active").or(visibilityOrFilter());
    } else if (opts.excludeArchived && !filters.status) {
      // Admin list default: hide recycled (archived) rows unless explicitly filtered.
      query = query.not("status", "eq", "archived");
    }

    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`,
      );
    }
    if (filters.status) query = query.eq("status", filters.status);
    if (filters.badge) query = query.eq("badge", filters.badge);
    if (filters.min_price) query = query.gte("current_price", filters.min_price);
    if (filters.max_price) query = query.lte("current_price", filters.max_price);

    if (filters.material) {
      const materials = Array.isArray(filters.material) ? filters.material : [filters.material];
      if (materials.length === 1) {
        query = query.eq("material", materials[0]);
      } else if (materials.length > 1) {
        query = query.in("material", materials);
      }
    }

    if (filters.category) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", filters.category)
        .maybeSingle();
      if (cat) {
        const { data: links } = await supabase
          .from("product_categories")
          .select("product_id")
          .eq("category_id", cat.id);
        const pids = (links || []).map((l: any) => l.product_id);
        if (pids.length > 0) query = query.in("id", pids);
        else query = query.eq("id", ZERO_UUID);
      } else {
        query = query.eq("id", ZERO_UUID);
      }
    }

    if (filters.subcategory) {
      const { data: subcat } = await supabase
        .from("subcategories")
        .select("id")
        .eq("slug", filters.subcategory)
        .maybeSingle();
      if (subcat) {
        query = query.eq("subcategory_id", subcat.id);
      } else {
        query = query.eq("id", ZERO_UUID);
      }
    }

    const sortCol = filters.sort_by || "created_at";
    const sortDir = filters.sort_order || "desc";
    query = query.order(sortCol as any, { ascending: sortDir === "asc" });

    const page = filters.page || 1;
    const perPage = filters.per_page || 50;
    const from = (page - 1) * perPage;
    query = query.range(from, from + perPage - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    let products = ((data as any[]) || []).map(mapProduct);

    if (products.length > 0) {
      await Promise.all(
        products.map(async (p) => {
          const [imgs, cats] = await Promise.all([
            supabase
              .from("product_images")
              .select("*")
              .eq("product_id", p.id)
              .order("sort_order" as any),
            supabase.from("product_categories").select("category_id").eq("product_id", p.id),
          ]);
          if (imgs.error) throw imgs.error;
          if (cats.error) throw cats.error;
          const imgData = (imgs.data as any[]) || [];
          const catData = (cats.data as any[]) || [];
          p.main_image = imgData.find((i: any) => i.is_main) || imgData[0] || null;
          p.images = imgData;
          p.category_ids = catData.map((c: any) => c.category_id);
        }),
      );

      const allCatIds = [...new Set(products.flatMap((p) => p.category_ids || []))];
      if (allCatIds.length > 0) {
        const { data: catData, error: catError } = await supabase
          .from("categories")
          .select("id, name")
          .in("id", allCatIds);
        if (catError) throw catError;
        const catMap = new Map(((catData as any[]) || []).map((c: any) => [c.id, c.name]));
        products.forEach((p) => {
          const cid = p.category_ids?.[0];
          if (cid) p.category_name = catMap.get(cid) || null;
        });
      }

      // Batch-load flags
      const allProductIds = products.map((p) => p.id);
      const { data: flagLinks, error: flagErr } = await supabase
        .from("product_product_flags")
        .select("product_id, flag_id, product_flags!inner(*)")
        .in("product_id", allProductIds);
      if (flagErr) throw flagErr;
      const flagsByProduct = new Map<string, any[]>();
      for (const link of (flagLinks as any[]) || []) {
        const existing = flagsByProduct.get(link.product_id) || [];
        existing.push(link.product_flags);
        flagsByProduct.set(link.product_id, existing);
      }
      products.forEach((p) => {
        p.flags = flagsByProduct.get(p.id) || [];
      });

      const allSubIds = [
        ...new Set(products.map((p) => p.subcategory_id).filter(Boolean)),
      ] as string[];
      if (allSubIds.length > 0) {
        const { data: subData } = await supabase
          .from("subcategories")
          .select("id, name")
          .in("id", allSubIds);
        const subMap = new Map(((subData as any[]) || []).map((s: any) => [s.id, s.name]));
        products.forEach((p) => {
          if (p.subcategory_id) p.subcategory_name = subMap.get(p.subcategory_id) || null;
        });
      }
    }

    return { data: products, count: count || 0 };
  },

  async getPublishedByCategorySlug(slug: string): Promise<ProductWithImages[]> {
    return productsApi.getPublished({ category: slug });
  },

  async getPublished(filters: Omit<ProductFilters, "status"> = {}): Promise<ProductWithImages[]> {
    return productsApi
      .list({ ...filters, status: "active" }, { publicOnly: true })
      .then((r) => r.data);
  },

  async getFacets(
    categorySlug?: string,
  ): Promise<{ metals: string[]; minPrice: number; maxPrice: number }> {
    let query = supabase
      .from("products")
      .select("material, current_price")
      .eq("status", "active")
      .or(visibilityOrFilter());

    if (categorySlug) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();
      if (cat) {
        const { data: links } = await supabase
          .from("product_categories")
          .select("product_id")
          .eq("category_id", cat.id);
        const pids = (links || []).map((l: any) => l.product_id);
        if (pids.length > 0) query = query.in("id", pids);
        else query = query.eq("id", ZERO_UUID);
      } else {
        query = query.eq("id", ZERO_UUID);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    const rows = (data as any[]) || [];

    const metalSet = new Set<string>();
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    for (const row of rows) {
      const m = row.material;
      if (m && typeof m === "string") metalSet.add(m);
      const p = Number(row.current_price);
      if (!isNaN(p) && p > 0) {
        if (p < minPrice) minPrice = p;
        if (p > maxPrice) maxPrice = p;
      }
    }

    const metals = [...metalSet].sort();
    return {
      metals,
      minPrice: minPrice === Infinity ? 0 : minPrice,
      maxPrice: maxPrice === -Infinity ? 0 : maxPrice,
    };
  },

  async getById(id: string): Promise<ProductWithImages | null> {
    const { data, error } = await supabase
      .from("products")
      .select(productSelect)
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return mapProduct(data as any);
  },

  async getBySlug(slug: string): Promise<ProductWithImages | null> {
    const { data, error } = await supabase
      .from("products")
      .select(productSelect)
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return null;
    return mapProduct(data as any);
  },

  async getWithImages(id: string): Promise<ProductWithImages | null> {
    const product = await productsApi.getById(id);
    if (!product) return null;

    const [imagesRes, images360Res, catsRes, collRes, flagsRes, specsRes] = await Promise.all([
      supabase
        .from("product_images")
        .select("*")
        .eq("product_id", id)
        .order("sort_order" as any),
      supabase
        .from("product_360_images")
        .select("*")
        .eq("product_id", id)
        .order("frame_order" as any),
      supabase.from("product_categories").select("category_id").eq("product_id", id),
      supabase.from("product_collections").select("collection_id").eq("product_id", id),
      supabase.from("product_product_flags").select("flag_id").eq("product_id", id),
      supabase
        .from("product_attributes")
        .select("*, attribute_definition:attribute_definitions(name)")
        .eq("product_id", id)
        .order("sort_order" as any),
    ]);
    if (imagesRes.error) throw imagesRes.error;
    if (images360Res.error) throw images360Res.error;
    if (catsRes.error) throw catsRes.error;
    if (collRes.error) throw collRes.error;
    if (flagsRes.error) throw flagsRes.error;
    if (specsRes.error) throw specsRes.error;

    const images = (imagesRes.data as any[]) || [];
    const images360 = (images360Res.data as any[]) || [];
    const categories = (catsRes.data as any[]) || [];
    const collections = (collRes.data as any[]) || [];
    const flagIds = ((flagsRes.data as any[]) || []).map((f: any) => f.flag_id);

    let flags: any[] = [];
    if (flagIds.length > 0) {
      const { data: flagData } = await supabase
        .from("product_flags")
        .select("id, name, slug, badge_label, badge_bg_color, badge_text_color")
        .in("id", flagIds);
      flags = (flagData as any[]) || [];
    }

    const specifications = ((specsRes.data as any[]) || []).map((s: any) => ({
      id: s.id,
      attribute_definition_id: s.attribute_definition_id,
      name: s.attribute_definition?.name || "",
      value: s.value,
      sort_order: s.sort_order,
    }));

    return {
      ...product,
      images,
      images_360: images360,
      main_image: images.find((img: any) => img.is_main) || images[0] || null,
      category_ids: categories.map((c: any) => c.category_id),
      collection_ids: collections.map((c: any) => c.collection_id),
      flags,
      specifications,
    };
  },

  async getWithImagesBySlug(slug: string): Promise<ProductWithImages | null> {
    const { data, error } = await supabase
      .from("products")
      .select(`${productSelect}, product_images(*)`)
      .eq("slug", slug)
      .eq("status", "active")
      .or(visibilityOrFilter())
      .maybeSingle();
    if (error || !data) return null;
    const raw = data as any;
    const images = (raw.product_images || []) as any[];
    const mapped = mapProduct(raw);
    const { data: catsData } = await supabase
      .from("product_categories")
      .select("category_id")
      .eq("product_id", mapped.id);
    const category_ids = ((catsData as any[]) || []).map((c: any) => c.category_id);
    let category_name = null;
    if (category_ids.length > 0) {
      const { data: catInfo } = await supabase
        .from("categories")
        .select("name")
        .eq("id", category_ids[0])
        .maybeSingle();
      if (catInfo) category_name = (catInfo as any).name;
    }
    const [flagsRes, specsRes] = await Promise.all([
      supabase.from("product_product_flags").select("flag_id").eq("product_id", mapped.id),
      supabase
        .from("product_attributes")
        .select("*, attribute_definition:attribute_definitions(name)")
        .eq("product_id", mapped.id)
        .order("sort_order" as any),
    ]);
    const flagIds = ((flagsRes.data as any[]) || []).map((f: any) => f.flag_id);
    let flags: any[] = [];
    if (flagIds.length > 0) {
      const { data: flagData } = await supabase
        .from("product_flags")
        .select("id, name, slug, badge_label, badge_bg_color, badge_text_color")
        .in("id", flagIds);
      flags = (flagData as any[]) || [];
    }
    const specifications = ((specsRes.data as any[]) || []).map((s: any) => ({
      id: s.id,
      attribute_definition_id: s.attribute_definition_id,
      name: s.attribute_definition?.name || "",
      value: s.value,
      sort_order: s.sort_order,
    }));
    return {
      ...mapped,
      images,
      images_360: [],
      main_image: images.find((img: any) => img.is_main) || images[0] || null,
      category_ids,
      category_name,
      collection_ids: [],
      flags,
      specifications,
    };
  },

  async create(data: ProductFormData): Promise<ProductWithImages> {
    const now = new Date();
    const status = data.status || "draft";
    const publishAt = data.publish_at && data.publish_at.trim() !== "" ? data.publish_at : null;
    const isScheduled = publishAt !== null && new Date(publishAt).getTime() > now.getTime();
    // A future schedule must be "active" under the hood so read-time visibility
    // flips it public when the time arrives (status active + publish_at <= now).
    const effectiveStatus = isScheduled ? "active" : status;
    const adminUser = effectiveStatus === "archived" ? await getAdminUser() : null;

    const payload: any = {
      name: data.name,
      slug: data.slug,
      short_description: data.short_description || null,
      full_description: data.full_description || null,
      current_price: data.current_price,
      original_price: data.original_price || null,
      cost_price: data.cost_price || null,
      badge: data.badge || null,
      status: effectiveStatus,
      stock_quantity: data.stock_quantity ?? null,
      low_stock_threshold: data.low_stock_threshold ?? 5,
      material: data.material || null,
      metal_type: data.metal_type || null,
      metal_colour: data.metal_colour || null,
      gold_purity: data.gold_purity || null,
      gross_weight: data.gross_weight || null,
      net_weight: data.net_weight || null,
      gemstone: data.gemstone || null,
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
      focus_keyword: data.focus_keyword || null,
      canonical_url: data.canonical_url || null,
      social_image: data.social_image || null,
      image_alt_text: data.image_alt_text || null,
      card_label: data.card_label || null,
      subcategory_id: data.subcategory_id || null,
      tags: data.tags || [],
      publish_at: isScheduled ? publishAt : null,
      published_at: !isScheduled && effectiveStatus === "active" ? now.toISOString() : null,
      archived_at: effectiveStatus === "archived" ? now.toISOString() : null,
      archived_by: effectiveStatus === "archived" ? (adminUser?.id ?? null) : null,
    };
    const { data: result, error } = await supabase
      .from("products")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    const product = mapProduct(result as any);

    if (data.category_ids && data.category_ids.length > 0) {
      const catLinks = data.category_ids.map((cid) => ({
        product_id: product.id,
        category_id: cid,
      }));
      const { error: catErr } = await supabase.from("product_categories").insert(catLinks as any);
      if (catErr) throw new Error(`Failed to assign category: ${catErr.message}`);
      product.category_ids = data.category_ids;
    }

    if (data.main_image_url) {
      await productsApi.addImage(product.id, data.main_image_url, product.name, true);
    }

    if (data.gallery_images && data.gallery_images.length > 0) {
      const galleryImgs = data.gallery_images.map((url, i) => ({
        product_id: product.id,
        url,
        alt_text: product.name,
        sort_order: i + 1,
        is_main: false,
      }));
      const { error: galErr } = await supabase.from("product_images").insert(galleryImgs as any);
      if (galErr) throw new Error(`Failed to save gallery images: ${galErr.message}`);
    }

    if (data.collection_ids && data.collection_ids.length > 0) {
      const collLinks = data.collection_ids.map((cid) => ({
        product_id: product.id,
        collection_id: cid,
      }));
      const { error: collErr } = await supabase
        .from("product_collections")
        .insert(collLinks as any);
      if (collErr) throw new Error(`Failed to assign collection: ${collErr.message}`);
    }

    await logAction(isScheduled ? "product_scheduled" : "product_created", product.id, null, {
      status: effectiveStatus,
      publish_at: isScheduled ? publishAt : null,
    });

    return productsApi.getWithImages(product.id) as Promise<ProductWithImages>;
  },

  async update(id: string, data: Partial<ProductFormData>): Promise<ProductWithImages> {
    const now = new Date();
    const { data: before } = await supabase
      .from("products")
      .select("status, publish_at, archived_at")
      .eq("id", id)
      .maybeSingle();
    const prevStatus = (before as any)?.status;

    const payload: any = { ...data, updated_at: now.toISOString() };
    delete payload.category_ids;
    delete payload.collection_ids;
    delete payload.main_image_url;
    delete payload.gallery_images;
    delete payload.images_360;
    delete payload.making_charges;
    delete payload.gst_percentage;

    if (payload.original_price === 0) payload.original_price = null;
    if (payload.cost_price === 0) payload.cost_price = null;

    // --- Publishing semantics -------------------------------------------------
    const requestedStatus = payload.status ?? prevStatus;
    const publishAtRaw = payload.publish_at;
    const publishAt =
      publishAtRaw === undefined || publishAtRaw === null || String(publishAtRaw).trim() === ""
        ? null
        : String(publishAtRaw).trim();
    const isScheduled = publishAt !== null && new Date(publishAt).getTime() > now.getTime();

    // A future schedule is really "active wait until publish_at" so read-time
    // visibility turns it public at the right moment. A past/invalid schedule is
    // treated as publish-now (cleared) to avoid a permanently hidden "scheduled".
    if (requestedStatus === "active" || isScheduled) {
      payload.status = "active";
      payload.publish_at = isScheduled ? publishAt : null;
      payload.published_at = isScheduled ? null : now.toISOString();
    } else if (requestedStatus === "archived") {
      payload.status = "archived";
      payload.publish_at = null;
      payload.archived_at = (before as any)?.archived_at || now.toISOString();
      payload.archived_by = (await getAdminUser())?.id ?? null;
    } else {
      payload.status = requestedStatus || "draft";
      payload.publish_at = null;
    }

    // Clearing the archive when leaving the archived state.
    if (prevStatus === "archived" && payload.status !== "archived") {
      payload.archived_at = null;
      payload.archived_by = null;
    }

    const { data: result, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;

    if (data.category_ids !== undefined) {
      const { error: delCatErr } = await supabase
        .from("product_categories")
        .delete()
        .eq("product_id", id);
      if (delCatErr) throw new Error(`Failed to update category: ${delCatErr.message}`);
      if (data.category_ids.length > 0) {
        const catLinks = data.category_ids.map((cid) => ({ product_id: id, category_id: cid }));
        const { error: insCatErr } = await supabase
          .from("product_categories")
          .insert(catLinks as any);
        if (insCatErr) throw new Error(`Failed to assign category: ${insCatErr.message}`);
      }
    }

    if (data.collection_ids !== undefined) {
      const { error: delColErr } = await supabase
        .from("product_collections")
        .delete()
        .eq("product_id", id);
      if (delColErr) throw new Error(`Failed to update collection: ${delColErr.message}`);
      if (data.collection_ids.length > 0) {
        const collLinks = data.collection_ids.map((cid) => ({
          product_id: id,
          collection_id: cid,
        }));
        const { error: insColErr } = await supabase
          .from("product_collections")
          .insert(collLinks as any);
        if (insColErr) throw new Error(`Failed to assign collection: ${insColErr.message}`);
      }
    }

    if (data.main_image_url) {
      await supabase
        .from("product_images")
        .update({ is_main: false } as any)
        .eq("product_id", id)
        .eq("is_main", true);
      await productsApi.addImage(id, data.main_image_url, undefined, true);
    }

    if (data.gallery_images !== undefined) {
      await supabase.from("product_images").delete().eq("product_id", id).eq("is_main", false);
      if (data.gallery_images.length > 0) {
        const galleryRows = data.gallery_images.map((url, i) => ({
          product_id: id,
          url,
          alt_text: data.name || null,
          sort_order: i + 1,
          is_main: false,
        }));
        const { error: galErr } = await supabase.from("product_images").insert(galleryRows as any);
        if (galErr) throw new Error(`Failed to save gallery images: ${galErr.message}`);
      }
    }

    await logAction(
      payload.status === "active" && isScheduled ? "product_scheduled" : "product_updated",
      id,
      before ? { status: before.status, publish_at: before.publish_at } : undefined,
      {
        status: payload.status,
        publish_at: payload.publish_at,
        is_archived: payload.status === "archived",
      },
    );

    return productsApi.getWithImages(id) as Promise<ProductWithImages>;
  },

  async updateStatus(id: string, status: string): Promise<void> {
    const now = new Date();
    const { data: before } = await supabase
      .from("products")
      .select("status, publish_at, archived_at")
      .eq("id", id)
      .maybeSingle();
    const prevStatus = (before as any)?.status;

    const payload: any = { status, updated_at: now.toISOString() };
    let action = `product_status_${status}`;

    if (status === "archived") {
      payload.archived_at = now.toISOString();
      payload.archived_by = (await getAdminUser())?.id ?? null;
      action = "product_archived";
    } else if (prevStatus === "archived" && status !== "archived") {
      // Restoring: clear the archive stamp. If a schedule is still pending,
      // keep it (the product re-hides until publish_at); otherwise it is live now.
      payload.archived_at = null;
      payload.archived_by = null;
      if (status === "active") {
        const publishAt = (before as any)?.publish_at;
        const pending = publishAt && new Date(publishAt).getTime() > now.getTime();
        if (!pending) payload.published_at = now.toISOString();
        action = "product_restored";
      } else {
        action = "product_restored";
      }
    } else if (status === "active") {
      const publishAt = (before as any)?.publish_at;
      const pending = publishAt && new Date(publishAt).getTime() > now.getTime();
      if (pending) {
        action = "product_scheduled";
      } else {
        payload.publish_at = null;
        payload.published_at = now.toISOString();
        action = "product_published";
      }
    }

    const { error } = await supabase.from("products").update(payload).eq("id", id);
    if (error) throw error;
    await logAction(
      action,
      id,
      before ? { status: before.status, publish_at: before.publish_at } : undefined,
      { status, publish_at: payload.publish_at },
    );
  },

  async bulkUpdateStatus(ids: string[], status: string): Promise<void> {
    for (const id of ids) {
      await productsApi.updateStatus(id, status);
    }
  },

  async archiveProduct(id: string): Promise<void> {
    await productsApi.updateStatus(id, "archived");
  },

  async restoreProduct(id: string): Promise<void> {
    await productsApi.updateStatus(id, "active");
  },

  async previousOrderCounts(ids: string[]): Promise<Record<string, number>> {
    if (ids.length === 0) return {};
    const { data, error } = await supabase
      .from("order_items")
      .select("product_id, order_id")
      .in("product_id", ids);
    if (error) throw error;
    // Count DISTINCT historical orders per product so recycled products keep
    // their real order history (multiple line items in one order count once).
    const ordersByProduct = new Map<string, Set<string>>();
    for (const row of (data as any[]) || []) {
      if (!row.order_id) continue;
      const set = ordersByProduct.get(row.product_id) || new Set<string>();
      set.add(row.order_id);
      ordersByProduct.set(row.product_id, set);
    }
    const counts: Record<string, number> = {};
    for (const [pid, set] of ordersByProduct) counts[pid] = set.size;
    return counts;
  },

  async delete(id: string): Promise<void> {
    const { data: images } = await supabase
      .from("product_images")
      .select("url")
      .eq("product_id", id);
    const urls = ((images as any[]) || []).map((i: any) => i.url);
    await supabase.from("product_images").delete().eq("product_id", id);
    await supabase.from("product_categories").delete().eq("product_id", id);
    await supabase.from("product_collections").delete().eq("product_id", id);
    await supabase.from("product_360_images").delete().eq("product_id", id);
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
  },

  async getImages(productId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .order("sort_order" as any);
    if (error) throw error;
    return (data as any[]) || [];
  },

  async addImage(productId: string, url: string, altText?: string, isMain = false): Promise<any> {
    const { data, error } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        url,
        alt_text: altText || null,
        is_main: isMain,
        sort_order: 0,
      } as any)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteImage(id: string): Promise<void> {
    const { error } = await supabase.from("product_images").delete().eq("id", id);
    if (error) throw error;
  },

  async setMainImage(productId: string, imageId: string): Promise<void> {
    await supabase
      .from("product_images")
      .update({ is_main: false } as any)
      .eq("product_id", productId);
    await supabase
      .from("product_images")
      .update({ is_main: true } as any)
      .eq("id", imageId);
  },

  async search(query: string): Promise<ProductWithImages[]> {
    const { data, error } = await supabase
      .from("products")
      .select(productSelect)
      .eq("status", "active")
      .or(visibilityOrFilter())
      .or(
        `name.ilike.%${query}%,short_description.ilike.%${query}%,full_description.ilike.%${query}%`,
      )
      .order("rating_average" as any, { ascending: false })
      .limit(20);
    if (error) throw error;
    return ((data as any[]) || []).map(mapProduct);
  },
};
