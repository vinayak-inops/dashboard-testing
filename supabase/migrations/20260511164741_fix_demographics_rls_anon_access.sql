/*
  # Fix RLS policies for workforce demographic tables to allow anon reads

  The dashboard uses the anon key without auth, so policies must include the
  anon role. Dropping and recreating SELECT policies for all demographic tables
  plus the core metrics tables to grant anon read access.
*/

-- workforce_gender
DROP POLICY IF EXISTS "Authenticated users can read workforce gender" ON workforce_gender;
CREATE POLICY "Allow anon and authenticated read workforce gender"
  ON workforce_gender FOR SELECT
  TO anon, authenticated
  USING (true);

-- workforce_age_group
DROP POLICY IF EXISTS "Authenticated users can read workforce age group" ON workforce_age_group;
CREATE POLICY "Allow anon and authenticated read workforce age group"
  ON workforce_age_group FOR SELECT
  TO anon, authenticated
  USING (true);

-- workforce_experience_band
DROP POLICY IF EXISTS "Authenticated users can read workforce experience band" ON workforce_experience_band;
CREATE POLICY "Allow anon and authenticated read workforce experience band"
  ON workforce_experience_band FOR SELECT
  TO anon, authenticated
  USING (true);

-- workforce_metrics (fix existing policy too)
DROP POLICY IF EXISTS "Authenticated users can read workforce metrics" ON workforce_metrics;
CREATE POLICY "Allow anon and authenticated read workforce metrics"
  ON workforce_metrics FOR SELECT
  TO anon, authenticated
  USING (true);

-- workforce_trend
DROP POLICY IF EXISTS "Authenticated users can read workforce trend" ON workforce_trend;
CREATE POLICY "Allow anon and authenticated read workforce trend"
  ON workforce_trend FOR SELECT
  TO anon, authenticated
  USING (true);
