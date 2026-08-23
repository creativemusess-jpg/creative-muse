-- Replace all FAQ content with the new 7 Creative Muse FAQs.
-- This migration deletes every existing FAQ row and inserts the
-- definitive set of questions and answers.

DELETE FROM faqs;

INSERT INTO faqs (question, answer, sort_order, is_published) VALUES
  ('Is Creative Muse jewellery waterproof & anti-tarnish?',
   'Yes! Our jewellery is designed to be waterproof and anti-tarnish, making it perfect for everyday wear. With proper care, it will maintain its shine for longer.',
   1, true),
  ('What material is Creative Muse jewellery made from?',
   'Our jewellery is primarily made from premium stainless steel with PVD plating. Material details are mentioned on the respective product page.',
   2, true),
  ('Can I wear the jewellery every day?',
   'Absolutely! Our pieces are designed for everyday wear. We recommend avoiding prolonged exposure to perfumes, harsh chemicals and chlorine.',
   3, true),
  ('How long does delivery take?',
   'Orders are processed and dispatched within the timeline mentioned on our website. Delivery time depends on your location and courier service.',
   4, true),
  ('Do you offer returns or exchanges?',
   'Yes, eligible products can be returned or exchanged as per our Returns & Exchange Policy.',
   5, true),
  ('Do you offer Cash on Delivery?',
   'Currently, we offer prepaid orders only. Cash on Delivery (COD) is not available.',
   6, true),
  ('How do I take care of my jewellery?',
   'Store your jewellery in a dry place and avoid direct contact with perfumes, lotions, harsh chemicals and chlorine. After wearing, gently wipe it with a soft, dry cloth to keep it looking its best.',
   7, true);
