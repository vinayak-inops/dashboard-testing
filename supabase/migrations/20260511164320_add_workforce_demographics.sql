/*
  # Add Workforce Demographics Tables

  ## New Tables
  - `workforce_gender` - Gender distribution snapshot
    - `id`, `snapshot_date`, `gender`, `count`, `pct`
  - `workforce_age_group` - Age band distribution snapshot
    - `id`, `snapshot_date`, `age_group`, `count`, `pct`, `sort_order`
  - `workforce_experience_band` - Experience band distribution snapshot
    - `id`, `snapshot_date`, `band`, `count`, `pct`, `sort_order`

  ## Security
  - RLS enabled on all three tables
  - Authenticated users can read
*/

CREATE TABLE IF NOT EXISTS workforce_gender (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
  gender text NOT NULL,
  count integer NOT NULL DEFAULT 0,
  pct numeric(5,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workforce_gender ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read workforce gender"
  ON workforce_gender FOR SELECT
  TO authenticated
  USING (true);

INSERT INTO workforce_gender (snapshot_date, gender, count, pct) VALUES
  (CURRENT_DATE, 'Male',   2543, 59.3),
  (CURRENT_DATE, 'Female', 1628, 38.0),
  (CURRENT_DATE, 'Non-Binary / Other', 116, 2.7);


CREATE TABLE IF NOT EXISTS workforce_age_group (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
  age_group text NOT NULL,
  count integer NOT NULL DEFAULT 0,
  pct numeric(5,2) NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workforce_age_group ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read workforce age group"
  ON workforce_age_group FOR SELECT
  TO authenticated
  USING (true);

INSERT INTO workforce_age_group (snapshot_date, age_group, count, pct, sort_order) VALUES
  (CURRENT_DATE, 'Under 25',  386,  9.0, 1),
  (CURRENT_DATE, '25–34',    1198, 27.9, 2),
  (CURRENT_DATE, '35–44',    1374, 32.1, 3),
  (CURRENT_DATE, '45–54',     891, 20.8, 4),
  (CURRENT_DATE, '55–64',     351,  8.2, 5),
  (CURRENT_DATE, '65+',        87,  2.0, 6);


CREATE TABLE IF NOT EXISTS workforce_experience_band (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
  band text NOT NULL,
  count integer NOT NULL DEFAULT 0,
  pct numeric(5,2) NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workforce_experience_band ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read workforce experience band"
  ON workforce_experience_band FOR SELECT
  TO authenticated
  USING (true);

INSERT INTO workforce_experience_band (snapshot_date, band, count, pct, sort_order) VALUES
  (CURRENT_DATE, '0–1 Year',   312,  7.3, 1),
  (CURRENT_DATE, '1–3 Years',  694, 16.2, 2),
  (CURRENT_DATE, '3–5 Years',  821, 19.1, 3),
  (CURRENT_DATE, '5–10 Years', 1142, 26.6, 4),
  (CURRENT_DATE, '10–15 Years', 687, 16.0, 5),
  (CURRENT_DATE, '15+ Years',  631, 14.7, 6);
