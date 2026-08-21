-- ============================================================
-- Creative Muse — Enquiries Table Extensions & Realtime
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Add new columns to enquiries table
-- ============================================================
ALTER TABLE enquiries
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'in_progress', 'resolved', 'closed')),
ADD COLUMN IF NOT EXISTS priority TEXT NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('normal', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'contact_form',
ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. Create indexes for better query performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_priority ON enquiries(priority);
CREATE INDEX IF NOT EXISTS idx_enquiries_is_read ON enquiries(is_read);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);

-- 3. Enable Realtime for enquiries table
-- ============================================================
-- Add the table to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE enquiries;

-- 4. Create trigger for new enquiry notifications
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_new_enquiry()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (type, title, message, entity_type, entity_id)
  VALUES (
    'new_enquiry',
    'New enquiry received',
    NEW.name || ' · ' || COALESCE(NULLIF(NEW.subject, ''), 'No subject'),
    'enquiry',
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_notify_new_enquiry ON public.enquiries;
CREATE TRIGGER trg_notify_new_enquiry
  AFTER INSERT ON public.enquiries
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_enquiry();

-- 5. Verify RLS is enabled and policies work with new columns
-- ============================================================
-- The existing policy "Admin full access to enquiries" already covers all operations
-- The existing policy "Anyone can submit an enquiry" allows INSERT for everyone
-- No changes needed to RLS policies as the new columns are covered by existing policies

-- 6. Verify the table is in realtime
-- ============================================================
-- Run this to verify:
-- SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'enquiries';