import { supabase } from "../supabase";

export interface ProductWithImages {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
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
  certification_type: string | null;
  certification_number: string | null;
  rating_average: number;
  review_count: number;
  featured: boolean;
  best_seller: boolean;
  new_arrival: boolean;
  trending: boolean;
  wedding: boolean;
  seo_title: string | null;
  seo_description: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;
  social_image: string | null;
  image_alt_text: string | null;
  subcategory_id: string | null;
  tags: string[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  main_image?: { id: string; url: string; alt_text: string | null; is_main: boolean } | null;
  images?: { id: string; url: string; alt_text: string | null; is_main: boolean; sort_order: number }[];
  images_360?: { id: string; url: string; frame_order: number }[];
  category_ids?: string[];
  category_name?: string;
  subcategory_name?: string;
  collection_ids?: string[];
}

export interface ProductFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  collection?: string;
  status?: string;
  badge?: string;
  stock?: string;
  featured?: boolean;
  best_seller?: boolean;
  trending?: boolean;
  wedding?: boolean;
  new_arrival?: boolean;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface ProductFormData {
  name: string;
  slug: string;
  sku?: string;
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
  certification_type?: string;
  certification_number?: string;
  featured?: boolean;
  best_seller?: boolean;
  new_arrival?: boolean;
  trending?: boolean;
  wedding?: boolean;
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
}

const productSelect = `
  id, name, slug, sku, short_description, full_description,
  current_price, original_price, cost_price, discount_percentage,
  badge, status, stock_quantity, low_stock_threshold,
  material, metal_type, metal_colour, gold_purity,
  gross_weight, net_weight, gemstone,
  certification_type, certification_number,
  rating_average, review_count,
  featured, best_seller, new_arrival, trending, wedding,
  seo_title, seo_description, focus_keyword, canonical_url, social_image, image_alt_text,
  subcategory_id, tags,
  published_at, created_at, updated_at,
  created_by, updated_by
`;

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
    featured: row.featured ?? false,
    best_seller: row.best_seller ?? false,
    new_arrival: row.new_arrival ?? false,
    trending: row.trending ?? false,
    wedding: row.wedding ?? false,
    focus_keyword: row.focus_keyword ?? null,
    canonical_url: row.canonical_url ?? null,
    social_image: row.social_image ?? null,
    image_alt_text: row.image_alt_text ?? null,
    subcategory_id: row.subcategory_id ?? null,
  };
}

export const productsApi = {
  async list(filters: ProductFilters = {}): Promise<{ data: ProductWithImages[]; count: number }> {
    let query = supabase.from("products").select(productSelect, { count: "exact" });

    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`,
      );
    }
    if (filters.status) query = query.eq("status", filters.status);
    if (filters.badge) query = query.eq("badge", filters.badge);
    if (filters.featured !== undefined) query = query.eq("featured", filters.featured);
    if (filters.best_seller !== undefined) query = query.eq("best_seller", filters.best_seller);
    if (filters.trending !== undefined) query = query.eq("trending", filters.trending);
    if (filters.wedding !== undefined) query = query.eq("wedding", filters.wedding);
    if (filters.new_arrival !== undefined) query = query.eq("new_arrival", filters.new_arrival);
    if (filters.min_price) query = query.gte("current_price", filters.min_price);
    if (filters.max_price) query = query.lte("current_price", filters.max_price);

    if (filters.category) {
      const { data: cat } = await supabase.from("categories").select("id").eq("slug", filters.category).maybeSingle();
      if (cat) {
        const { data: links } = await supabase.from("product_categories").select("product_id").eq("category_id", cat.id);
        const pids = (links || []).map((l: any) => l.product_id);
        if (pids.length > 0) query = query.in("id", pids);
        else query = query.eq("id", "__none__");
      } else {
        query = query.eq("id", "__none__");
      }
    }

    if (filters.subcategory) {
      const { data: subcat } = await supabase.from("subcategories").select("id").eq("slug", filters.subcategory).maybeSingle();
      if (subcat) {
        query = query.eq("subcategory_id", subcat.id);
      } else {
        query = query.eq("id", "__none__");
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
      await Promise.all(products.map(async (p) => {
        const [imgs, cats] = await Promise.all([
          supabase.from("product_images").select("*").eq("product_id", p.id).order("sort_order" as any).limit(1),
          supabase.from("product_categories").select("category_id").eq("product_id", p.id),
        ]);
        if (imgs.error) throw imgs.error;
        if (cats.error) throw cats.error;
        const imgData = (imgs.data as any[]) || [];
        const catData = (cats.data as any[]) || [];
        p.main_image = imgData.find((i: any) => i.is_main) || imgData[0] || null;
        p.images = imgData;
        p.category_ids = catData.map((c: any) => c.category_id);
      }));

      const allCatIds = [...new Set(products.flatMap((p) => p.category_ids || []))];
      if (allCatIds.length > 0) {
        const { data: catData, error: catError } = await supabase.from("categories").select("id, name").in("id", allCatIds);
        if (catError) throw catError;
        const catMap = new Map((catData as any[] || []).map((c: any) => [c.id, c.name]));
        products.forEach((p) => {
          const cid = p.category_ids?.[0];
          if (cid) p.category_name = catMap.get(cid) || null;
        });
      }

      const allSubIds = [...new Set(products.map((p) => p.subcategory_id).filter(Boolean))] as string[];
      if (allSubIds.length > 0) {
        const { data: subData } = await supabase.from("subcategories").select("id, name").in("id", allSubIds);
        const subMap = new Map((subData as any[] || []).map((s: any) => [s.id, s.name]));
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
    return productsApi.list({ ...filters, status: "active" }).then((r) => r.data);
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

    const [imagesRes, images360Res, catsRes, collRes] = await Promise.all([
      supabase.from("product_images").select("*").eq("product_id", id).order("sort_order" as any),
      supabase.from("product_360_images").select("*").eq("product_id", id).order("frame_order" as any),
      supabase.from("product_categories").select("category_id").eq("product_id", id),
      supabase.from("product_collections").select("collection_id").eq("product_id", id),
    ]);
    if (imagesRes.error) throw imagesRes.error;
    if (images360Res.error) throw images360Res.error;
    if (catsRes.error) throw catsRes.error;
    if (collRes.error) throw collRes.error;

    const images = (imagesRes.data as any[]) || [];
    const images360 = (images360Res.data as any[]) || [];
    const categories = (catsRes.data as any[]) || [];
    const collections = (collRes.data as any[]) || [];

    return {
      ...product,
      images,
      images_360: images360,
      main_image: images.find((img: any) => img.is_main) || images[0] || null,
      category_ids: categories.map((c: any) => c.category_id),
      collection_ids: collections.map((c: any) => c.collection_id),
    };
  },

  async getWithImagesBySlug(slug: string): Promise<ProductWithImages | null> {
    const { data, error } = await supabase
      .from("products")
      .select(`${productSelect}, product_images(*)`)
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return null;
    const raw = data as any;
    const images = (raw.product_images || []) as any[];
    const mapped = mapProduct(raw);
    const { data: catsData } = await supabase.from("product_categories").select("category_id").eq("product_id", mapped.id);
    const category_ids = (catsData as any[] || []).map((c: any) => c.category_id);
    let category_name = null;
    if (category_ids.length > 0) {
      const { data: catInfo } = await supabase.from("categories").select("name").eq("id", category_ids[0]).maybeSingle();
      if (catInfo) category_name = (catInfo as any).name;
    }
    return {
      ...mapped,
      images,
      images_360: [],
      main_image: images.find((img: any) => img.is_main) || images[0] || null,
      category_ids,
      category_name,
      collection_ids: [],
    };
  },

  async create(data: ProductFormData): Promise<ProductWithImages> {
    const payload: any = {
      name: data.name,
      slug: data.slug,
      sku: data.sku || null,
      short_description: data.short_description || null,
      full_description: data.full_description || null,
      current_price: data.current_price,
      original_price: data.original_price || null,
      cost_price: data.cost_price || null,
      badge: data.badge || null,
      status: data.status || "draft",
      stock_quantity: data.stock_quantity ?? null,
      low_stock_threshold: data.low_stock_threshold ?? 5,
      material: data.material || null,
      metal_type: data.metal_type || null,
      metal_colour: data.metal_colour || null,
      gold_purity: data.gold_purity || null,
      gross_weight: data.gross_weight || null,
      net_weight: data.net_weight || null,
      gemstone: data.gemstone || null,
      certification_type: data.certification_type || null,
      certification_number: data.certification_number || null,
      featured: data.featured || false,
      best_seller: data.best_seller || false,
      new_arrival: data.new_arrival || false,
      trending: data.trending || false,
      wedding: data.wedding || false,
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
      focus_keyword: data.focus_keyword || null,
      canonical_url: data.canonical_url || null,
      social_image: data.social_image || null,
      image_alt_text: data.image_alt_text || null,
      subcategory_id: data.subcategory_id || null,
      tags: data.tags || [],
      published_at: data.status === "active" ? new Date().toISOString() : null,
    };
    const { data: result, error } = await supabase.from("products").insert(payload).select().single();
    if (error) throw error;
    const product = mapProduct(result as any);

    if (data.category_ids && data.category_ids.length > 0) {
      const catLinks = data.category_ids.map((cid) => ({ product_id: product.id, category_id: cid }));
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
      const collLinks = data.collection_ids.map((cid) => ({ product_id: product.id, collection_id: cid }));
      const { error: collErr } = await supabase.from("product_collections").insert(collLinks as any);
      if (collErr) throw new Error(`Failed to assign collection: ${collErr.message}`);
    }

    return productsApi.getWithImages(product.id) as Promise<ProductWithImages>;
  },

  async update(id: string, data: Partial<ProductFormData>): Promise<ProductWithImages> {
    const payload: any = { ...data, updated_at: new Date().toISOString() };
    delete payload.category_ids;
    delete payload.collection_ids;
    delete payload.main_image_url;
    delete payload.gallery_images;
    delete payload.images_360;
    delete payload.making_charges;
    delete payload.gst_percentage;

    if (data.status === "active" && data.status !== undefined) {
      payload.published_at = new Date().toISOString();
    }

    const { data: result, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;

    if (data.category_ids !== undefined) {
      const { error: delCatErr } = await supabase.from("product_categories").delete().eq("product_id", id);
      if (delCatErr) throw new Error(`Failed to update category: ${delCatErr.message}`);
      if (data.category_ids.length > 0) {
        const catLinks = data.category_ids.map((cid) => ({ product_id: id, category_id: cid }));
        const { error: insCatErr } = await supabase.from("product_categories").insert(catLinks as any);
        if (insCatErr) throw new Error(`Failed to assign category: ${insCatErr.message}`);
      }
    }

    if (data.collection_ids !== undefined) {
      const { error: delColErr } = await supabase.from("product_collections").delete().eq("product_id", id);
      if (delColErr) throw new Error(`Failed to update collection: ${delColErr.message}`);
      if (data.collection_ids.length > 0) {
        const collLinks = data.collection_ids.map((cid) => ({ product_id: id, collection_id: cid }));
        const { error: insColErr } = await supabase.from("product_collections").insert(collLinks as any);
        if (insColErr) throw new Error(`Failed to assign collection: ${insColErr.message}`);
      }
    }

    if (data.main_image_url) {
      await supabase.from("product_images").update({ is_main: false } as any).eq("product_id", id).eq("is_main", true);
      await productsApi.addImage(id, data.main_image_url, undefined, true);
    }

    return productsApi.getWithImages(id) as Promise<ProductWithImages>;
  },

  async updateStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from("products")
      .update({ status, updated_at: new Date().toISOString() } as any)
      .eq("id", id);
    if (error) throw error;
  },

  async bulkUpdateStatus(ids: string[], status: string): Promise<void> {
    const { error } = await supabase
      .from("products")
      .update({ status, updated_at: new Date().toISOString() } as any)
      .in("id", ids);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { data: images } = await supabase.from("product_images").select("url").eq("product_id", id);
    const urls = (images as any[] || []).map((i: any) => i.url);
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
      .insert({ product_id: productId, url, alt_text: altText || null, is_main: isMain, sort_order: 0 } as any)
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
    await supabase.from("product_images").update({ is_main: false } as any).eq("product_id", productId);
    await supabase.from("product_images").update({ is_main: true } as any).eq("id", imageId);
  },

  async search(query: string): Promise<ProductWithImages[]> {
    const { data, error } = await supabase
      .from("products")
      .select(productSelect)
      .eq("status", "active")
      .or(
        `name.ilike.%${query}%,sku.ilike.%${query}%,short_description.ilike.%${query}%,full_description.ilike.%${query}%`,
      )
      .order("rating_average" as any, { ascending: false })
      .limit(20);
    if (error) throw error;
    return ((data as any[]) || []).map(mapProduct);
  },

  async getFeatured(): Promise<ProductWithImages[]> {
    return productsApi.getPublished({ featured: true });
  },

  async getBestSellers(): Promise<ProductWithImages[]> {
    return productsApi.getPublished({ best_seller: true });
  },

  async getNewArrivals(): Promise<ProductWithImages[]> {
    return productsApi.getPublished({ new_arrival: true });
  },

  async getTrending(): Promise<ProductWithImages[]> {
    return productsApi.getPublished({ trending: true });
  },

  async getWedding(): Promise<ProductWithImages[]> {
    return productsApi.getPublished({ wedding: true });
  },
};
