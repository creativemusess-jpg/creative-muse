INSERT INTO public.admin_roles (name, description, permissions)
VALUES
('super_admin','Full access','["*"]'::jsonb),
('admin','Admin access','["products","categories","orders","customers","homepage","coupons","newsletter","reviews","enquiries","media"]'::jsonb),
('product_manager','Product access','["products","categories","collections","stock","media"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

DO $$
BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='product_categories' AND policyname='public_read_active_product_categories') THEN
CREATE POLICY public_read_active_product_categories ON public.product_categories FOR SELECT USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id=product_categories.product_id AND p.status='active'));
END IF;
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='product_collections' AND policyname='public_read_active_product_collections') THEN
CREATE POLICY public_read_active_product_collections ON public.product_collections FOR SELECT USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id=product_collections.product_id AND p.status='active'));
END IF;
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='product_360_images' AND policyname='public_read_active_product_360_images') THEN
CREATE POLICY public_read_active_product_360_images ON public.product_360_images FOR SELECT USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id=product_360_images.product_id AND p.status='active'));
END IF;
END $$;

INSERT INTO storage.buckets (id,name,public)
VALUES
('product-images','product-images',true),
('product-360-images','product-360-images',true),
('category-images','category-images',true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products
(name,slug,sku,short_description,full_description,current_price,original_price,discount_percentage,badge,status,stock_quantity,low_stock_threshold,material,metal_type,metal_colour,gold_purity,gross_weight,gemstone,certification_type,rating_average,review_count,featured,best_seller,new_arrival,trending,wedding,tags,published_at)
SELECT name,slug,sku,short_description,full_description,current_price,original_price,discount_percentage,badge,status,stock_quantity,low_stock_threshold,material,metal_type,metal_colour,gold_purity,gross_weight,gemstone,certification_type,rating_average,review_count,featured,best_seller,new_arrival,trending,wedding,tags,published_at
FROM (
VALUES
('Aarav Solitaire Ring','aarav-solitaire','CM-RG-AARAV-018','A brilliant round solitaire set in a whisper-thin 18K gold band.','The Aarav solitaire is hand-set in our Vadodara atelier with a VS-clarity brilliant round diamond in a four-prong 18K yellow gold setting.',48500::numeric,62000::numeric,21.77::numeric,'Best Seller','active'::product_status,10,5,'18K Gold','Gold','Yellow Gold','18K (750)','3.2 g (approx.)','Diamond','BIS Hallmark and IGI Diamond Certificate',4.9::numeric,218,true,true,false,false,false,ARRAY['ring','solitaire','bridal','engagement','diamond','aarav']::text[],now()),
('Celestia Drop Earrings','celestia-drop','CM-EA-CELESTIA-018','Freshwater pearl drops on a delicate 18K white gold hook.','Luminous freshwater pearls suspended from a whisper-fine 18K white gold hook for elegant daily wear.',22800::numeric,28000::numeric,18.57::numeric,'New','active'::product_status,15,5,'White Gold','Gold','White Gold','18K (750)','2.6 g (pair)','Pearl','BIS Hallmark',4.8::numeric,94,true,false,true,false,false,ARRAY['earrings','pearl','white gold','drop earrings','occasion']::text[],now()),
('Serene Diamond Bracelet','serene-bracelet','CM-BR-SERENE-950','A tennis-inspired platinum line set with F/VS diamonds.','Each stone in the Serene bracelet is prong-set in 950 platinum and matched for colour and clarity.',67500::numeric,82000::numeric,17.68::numeric,'Trending','active'::product_status,4,5,'Platinum','Platinum','Platinum','PT 950','8.4 g','Diamond','PGI Platinum and IGI Diamond Certificate',5.0::numeric,156,true,false,false,true,false,ARRAY['bracelet','diamond','platinum','tennis','gift']::text[],now()),
('Priya Kundan Necklace','priya-kundan','CM-NK-PRIYA-022','Traditional uncut kundan set in 22K gold.','The Priya necklace pairs uncut kundan stones with hand-painted meenakari on the reverse.',38900::numeric,48000::numeric,18.96::numeric,'Wedding','active'::product_status,8,5,'22K Gold','Gold','Yellow Gold','22K (916)','32.5 g','Kundan','BIS Hallmark',4.9::numeric,312,true,false,false,false,true,ARRAY['necklace','kundan','bridal','wedding','traditional']::text[],now()),
('Luna Crescent Pendant','luna-crescent','CM-PD-LUNA-014','A crescent silhouette in 14K rose gold.','The Luna pendant is cast in 14K rose gold with a single Burmese ruby set at the tip.',15600::numeric,19800::numeric,21.21::numeric,'New','active'::product_status,20,5,'14K Gold','Gold','Rose Gold','14K (585)','1.9 g','Ruby','BIS Hallmark',4.7::numeric,67,true,false,true,false,false,ARRAY['pendant','ruby','rose gold','crescent','gift']::text[],now()),
('Eternal Mangalsutra','eternal-mangalsutra','CM-MS-ETERNAL-022','Twin-vati mangalsutra with a diamond-set pendant.','A contemporary mangalsutra with 22K gold vatis and a central diamond cluster on a black-bead chain.',54200::numeric,68000::numeric,20.29::numeric,'Best Seller','active'::product_status,12,5,'22K Gold','Gold','Yellow Gold','22K (916)','12.4 g','Diamond','BIS Hallmark and IGI Diamond Certificate',5.0::numeric,445,true,true,false,false,false,ARRAY['mangalsutra','diamond','bridal','black beads','daily wear']::text[],now()),
('Meera Jhumka Earrings','meera-jhumka','CM-EA-MEERA-022','Bell-shaped jhumkas in 22K gold.','Hand-crafted 22K gold jhumkas with cabochon emeralds and freshwater pearl fringe.',18400::numeric,23500::numeric,21.70::numeric,'Trending','active'::product_status,10,5,'22K Gold','Gold','Yellow Gold','22K (916)','9.1 g (pair)','Emerald','BIS Hallmark',4.8::numeric,189,true,false,false,true,false,ARRAY['earrings','jhumka','emerald','pearl','traditional']::text[],now()),
('Royal Polki Choker','royal-polki','CM-NK-ROYAL-022','Uncut polki choker in 22K gold.','The Royal Polki choker is set with uncut polki diamonds in 22K gold and finished with a South Sea pearl fringe.',92000::numeric,115000::numeric,20.00::numeric,'Wedding','active'::product_status,3,5,'22K Gold','Gold','Yellow Gold','22K (916)','48.6 g','Polki','BIS Hallmark',4.9::numeric,78,true,false,false,false,true,ARRAY['choker','polki','kundan','bridal','wedding','pearl']::text[],now())
) AS s(name,slug,sku,short_description,full_description,current_price,original_price,discount_percentage,badge,status,stock_quantity,low_stock_threshold,material,metal_type,metal_colour,gold_purity,gross_weight,gemstone,certification_type,rating_average,review_count,featured,best_seller,new_arrival,trending,wedding,tags,published_at)
WHERE NOT EXISTS (SELECT 1 FROM public.products p WHERE p.sku=s.sku OR p.slug=s.slug);

UPDATE public.products
SET status='active'::product_status,
    published_at=COALESCE(published_at, now())
WHERE sku IN (
  'CM-RG-AARAV-018',
  'CM-EA-CELESTIA-018',
  'CM-BR-SERENE-950',
  'CM-NK-PRIYA-022',
  'CM-PD-LUNA-014',
  'CM-MS-ETERNAL-022',
  'CM-EA-MEERA-022',
  'CM-NK-ROYAL-022'
)
AND status <> 'active'
AND created_by IS NULL
AND updated_by IS NULL;

WITH m(product_slug,category_slug) AS (
VALUES
('aarav-solitaire','rings'),
('celestia-drop','earrings'),
('serene-bracelet','bracelets'),
('priya-kundan','necklaces'),
('luna-crescent','pendants'),
('eternal-mangalsutra','mangalsutra'),
('meera-jhumka','earrings'),
('royal-polki','necklaces')
)
INSERT INTO public.product_categories (product_id,category_id)
SELECT p.id,c.id FROM m JOIN public.products p ON p.slug=m.product_slug JOIN public.categories c ON c.slug=m.category_slug
ON CONFLICT DO NOTHING;

WITH m(product_slug,collection_slug) AS (
VALUES
('aarav-solitaire','solitaire-classics'),
('celestia-drop','pearl-edit'),
('serene-bracelet','diamond-essentials'),
('priya-kundan','bridal-heritage'),
('luna-crescent','everyday-muse'),
('eternal-mangalsutra','forever-vows'),
('meera-jhumka','temple-treasures'),
('royal-polki','bridal-heritage')
)
INSERT INTO public.product_collections (product_id,collection_id)
SELECT p.id,c.id FROM m JOIN public.products p ON p.slug=m.product_slug JOIN public.collections c ON c.slug=m.collection_slug
ON CONFLICT DO NOTHING;

WITH m(product_slug,image_url) AS (
VALUES
('aarav-solitaire','/product-images/prod-aarav-ring.jpg'),
('celestia-drop','/product-images/prod-celestia-earrings.jpg'),
('serene-bracelet','/product-images/prod-serene-bracelet.jpg'),
('priya-kundan','/product-images/prod-priya-necklace.jpg'),
('luna-crescent','/product-images/prod-luna-pendant.jpg'),
('eternal-mangalsutra','/product-images/prod-mangalsutra.jpg'),
('meera-jhumka','/product-images/prod-jhumka.jpg'),
('royal-polki','/product-images/prod-polki-choker.jpg')
)
INSERT INTO public.product_images (product_id,url,alt_text,sort_order,is_main)
SELECT p.id,m.image_url,p.name,0,true FROM m JOIN public.products p ON p.slug=m.product_slug
WHERE NOT EXISTS (SELECT 1 FROM public.product_images pi WHERE pi.product_id=p.id AND pi.url=m.image_url);

SELECT 'products' AS item, COUNT(*)::text AS count FROM public.products
UNION ALL SELECT 'categories', COUNT(*)::text FROM public.categories
UNION ALL SELECT 'collections', COUNT(*)::text FROM public.collections
UNION ALL SELECT 'product_categories', COUNT(*)::text FROM public.product_categories
UNION ALL SELECT 'product_collections', COUNT(*)::text FROM public.product_collections
UNION ALL SELECT 'product_images', COUNT(*)::text FROM public.product_images
UNION ALL SELECT 'admin_roles', COUNT(*)::text FROM public.admin_roles;
