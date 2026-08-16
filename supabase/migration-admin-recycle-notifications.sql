-- ============================================================
-- Creative Muse — Admin In-app Notifications + Recycle Bin
-- Idempotent — safe to re-run multiple times.
-- Run in the Supabase SQL editor.
--
-- Depends on: migration-product-publishing.sql (products.archive_at).
-- The product columns are re-declared below IF NOT EXISTS as a safety net.
-- ============================================================

-- 1. Product recycle-bin columns (no-op if already present).
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS publish_at TIMESTAMPTZ;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS archived_by UUID REFERENCES public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_products_status_publish_at
  ON public.products(status, publish_at);

-- 2. Admin notification center (reusable for future event types).
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT,
  entity_type TEXT,
  entity_id   UUID,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_unread
  ON public.notifications(is_read, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read notifications" ON public.notifications;
CREATE POLICY "Admins can read notifications" ON public.notifications
  FOR SELECT USING (public.has_admin_role());

DROP POLICY IF EXISTS "Admins can update notifications" ON public.notifications;
CREATE POLICY "Admins can update notifications" ON public.notifications
  FOR UPDATE USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

DROP POLICY IF EXISTS "Admins can create notifications" ON public.notifications;
CREATE POLICY "Admins can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (public.has_admin_role());

-- 3. New-order notification trigger.
--    Fired by the database whenever an order is inserted, regardless of which
--    client created it. SECURITY DEFINER lets the trigger write notifications
--    even though customers have no direct insert access.
CREATE OR REPLACE FUNCTION public.notify_new_order()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (type, title, message, entity_type, entity_id)
  VALUES (
    'new_order',
    'New order received',
    'Order ' || NEW.order_number
      || ' · ' || COALESCE(NULLIF(NEW.customer_name, ''), 'Customer')
      || ' · ₹' || to_char(NEW.total_amount, 'FM999999999'),
    'order',
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_notify_new_order ON public.orders;
CREATE TRIGGER trg_notify_new_order
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_order();