/*
  # Add Workforce Employment Classification Table

  ## New Table
  - `workforce_employment_classification`
    - `id` (uuid, primary key)
    - `snapshot_date` (date)
    - `classification` (text) - e.g. Skilled, Semi-skilled, Unskilled, Apprentice/Trainee
    - `count` (integer)
    - `pct` (numeric)
    - `sort_order` (integer)
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled, anon + authenticated can read
*/

CREATE TABLE IF NOT EXISTS workforce_employment_classification (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
  classification text NOT NULL,
  count integer NOT NULL DEFAULT 0,
  pct numeric(5,2) NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workforce_employment_classification ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon and authenticated read employment classification"
  ON workforce_employment_classification FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO workforce_employment_classification (snapshot_date, classification, count, pct, sort_order) VALUES
  (CURRENT_DATE, 'Skilled Workers',            2142, 49.97, 1),
  (CURRENT_DATE, 'Semi-skilled Workers',       1187, 27.69, 2),
  (CURRENT_DATE, 'Unskilled Workers',           621, 14.49, 3),
  (CURRENT_DATE, 'Apprentice / Trainee',        337,  7.86, 4);
