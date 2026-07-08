-- Full RLS lockdown — revokes the anon key's access to EVERYTHING.
--
-- ⚠️  PREREQUISITE — the site breaks without this step:
--   1. Supabase dashboard → Project Settings → API → copy the service_role key
--   2. Add to .env (and Vercel env):  SUPABASE_SERVICE_ROLE_KEY="..."
--   3. Restart the app and verify the homepage AND an admin edit both work
--      (lib/supabase.ts automatically prefers the service-role key, which
--      bypasses RLS entirely — that's why no anon policies are created here)
--   4. Only then run this script:
--      cat scripts/security/rls-lockdown.sql | npx prisma db execute --stdin --schema prisma/schema.prisma
--   5. Re-verify homepage, a form submission, and admin CRUD.
--
-- After this runs, the anon key is inert (RLS enabled, no policies grant it
-- anything) — leaking it no longer exposes leads/consultations PII.
-- Rollback: ALTER TABLE <t> DISABLE ROW LEVEL SECURITY; per table.

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_inspirations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspiration_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspiration_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspirations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_category_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showroom_brand_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showroom_inspiration_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showroom_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
-- Prisma's own migration-history table is also exposed to PostgREST. It holds
-- no PII (just migration names/checksums/timestamps) but the Security Advisor
-- flags it as rls_disabled_in_public. Owner + service-role bypass RLS, so
-- enabling it here is safe and clears the last advisor error (added 2026-07-08).
ALTER TABLE public._prisma_migrations ENABLE ROW LEVEL SECURITY;

-- The reviews policies from fix-reviews-rls.sql become obsolete once the
-- server uses the service-role key — remove them so anon truly has nothing.
DROP POLICY IF EXISTS reviews_select ON public.reviews;
DROP POLICY IF EXISTS reviews_insert_unapproved ON public.reviews;
DROP POLICY IF EXISTS reviews_update ON public.reviews;
DROP POLICY IF EXISTS reviews_delete ON public.reviews;
