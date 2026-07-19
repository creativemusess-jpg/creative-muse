-- Transactional email, fulfilment, and admin testing support.
-- Safe additive migration: no existing data is removed.

ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS first_order_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS shipment_id TEXT,
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS actual_delivery_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS packed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS package_number TEXT,
  ADD COLUMN IF NOT EXISTS routing_code TEXT,
  ADD COLUMN IF NOT EXISTS invoice_pdf_url TEXT,
  ADD COLUMN IF NOT EXISTS invoice_token TEXT,
  ADD COLUMN IF NOT EXISTS invoice_token_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_notification_at TIMESTAMPTZ;

UPDATE orders
SET tracking_number = tracking_id
WHERE tracking_number IS NULL AND tracking_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS order_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  notification_type TEXT NOT NULL,
  idempotency_key TEXT,
  intended_recipient TEXT,
  actual_recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  provider TEXT,
  provider_message_id TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  attempt_count INTEGER NOT NULL DEFAULT 1,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  error_summary TEXT,
  initiated_by UUID,
  is_test BOOLEAN NOT NULL DEFAULT FALSE,
  test_template TEXT,
  test_recipient TEXT,
  source TEXT NOT NULL DEFAULT 'system',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_order_notifications_idempotency
  ON order_notifications(idempotency_key)
  WHERE idempotency_key IS NOT NULL AND is_test = FALSE;

CREATE INDEX IF NOT EXISTS idx_order_notifications_order_id
  ON order_notifications(order_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_notifications_test
  ON order_notifications(is_test, created_at DESC);

ALTER TABLE order_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read order notifications" ON order_notifications;
CREATE POLICY "Admins can read order notifications" ON order_notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM admin_role_assignments ara
      JOIN admin_roles ar ON ara.role_id = ar.id
      WHERE ara.user_id = auth.uid()
        AND (
          ar.permissions ? '*'
          OR ar.permissions ? 'orders'
          OR ar.permissions ? 'manage_email_testing'
        )
    )
  );

DROP POLICY IF EXISTS "Admins can insert order notifications" ON order_notifications;
CREATE POLICY "Admins can insert order notifications" ON order_notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1
      FROM admin_role_assignments ara
      JOIN admin_roles ar ON ara.role_id = ar.id
      WHERE ara.user_id = auth.uid()
        AND (
          ar.permissions ? '*'
          OR ar.permissions ? 'orders'
          OR ar.permissions ? 'manage_email_testing'
        )
    )
  );

DROP POLICY IF EXISTS "Admins can update order notifications" ON order_notifications;
CREATE POLICY "Admins can update order notifications" ON order_notifications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1
      FROM admin_role_assignments ara
      JOIN admin_roles ar ON ara.role_id = ar.id
      WHERE ara.user_id = auth.uid()
        AND (
          ar.permissions ? '*'
          OR ar.permissions ? 'orders'
          OR ar.permissions ? 'manage_email_testing'
        )
    )
  );

UPDATE admin_roles
SET permissions = permissions || '["manage_email_testing"]'::jsonb
WHERE name IN ('super_admin', 'admin')
  AND NOT (permissions ? 'manage_email_testing');
