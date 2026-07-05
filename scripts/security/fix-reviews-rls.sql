-- Fix the broken reviews feature (HANDOFF Known Issue / Pending Task #7).
--
-- State today: RLS is ENABLED on public.reviews with ZERO policies, so the
-- anon key can neither read nor write reviews — public submission and admin
-- moderation are both dead.
--
-- This keeps RLS ENABLED and adds the policies the app actually needs.
-- Admin moderation currently runs through the same server-side key, so
-- moderation read/update/delete must be granted here until the service-role
-- migration (rls-lockdown.sql) supersedes these policies.
-- INSERT is constrained: nobody can create a pre-approved review.
--
-- Run:  cat scripts/security/fix-reviews-rls.sql | npx prisma db execute --stdin --schema prisma/schema.prisma

DROP POLICY IF EXISTS reviews_select ON public.reviews;
DROP POLICY IF EXISTS reviews_insert_unapproved ON public.reviews;
DROP POLICY IF EXISTS reviews_update ON public.reviews;
DROP POLICY IF EXISTS reviews_delete ON public.reviews;

CREATE POLICY reviews_select ON public.reviews
  FOR SELECT USING (true);
CREATE POLICY reviews_insert_unapproved ON public.reviews
  FOR INSERT WITH CHECK (is_approved = false);
CREATE POLICY reviews_update ON public.reviews
  FOR UPDATE USING (true);
CREATE POLICY reviews_delete ON public.reviews
  FOR DELETE USING (true);
