/*
  # Add Workforce Organizational Distribution Table

  ## New Table
  - `workforce_org_distribution`
    - `id` (uuid, primary key)
    - `snapshot_date` (date)
    - `dimension` (text) - One of: subsidiary, region, state, location, department, sub_department
    - `label` (text) - The group name (e.g., "Mumbai", "Engineering")
    - `count` (integer) - Headcount
    - `pct` (numeric) - Percentage of total
    - `sort_order` (integer) - Display order within dimension
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled
  - Anon and authenticated users can read
*/

CREATE TABLE IF NOT EXISTS workforce_org_distribution (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
  dimension text NOT NULL,
  label text NOT NULL,
  count integer NOT NULL DEFAULT 0,
  pct numeric(5,2) NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workforce_org_distribution ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon and authenticated read org distribution"
  ON workforce_org_distribution FOR SELECT
  TO anon, authenticated
  USING (true);

-- Subsidiary
INSERT INTO workforce_org_distribution (snapshot_date, dimension, label, count, pct, sort_order) VALUES
  (CURRENT_DATE, 'subsidiary', 'TechCorp India Ltd',      1842, 42.9, 1),
  (CURRENT_DATE, 'subsidiary', 'TechCorp Gulf LLC',        891, 20.8, 2),
  (CURRENT_DATE, 'subsidiary', 'TechCorp Southeast Asia',  712, 16.6, 3),
  (CURRENT_DATE, 'subsidiary', 'TechCorp Europe GmbH',     521, 12.2, 4),
  (CURRENT_DATE, 'subsidiary', 'TechCorp Americas Inc',    321,  7.5, 5);

-- Region
INSERT INTO workforce_org_distribution (snapshot_date, dimension, label, count, pct, sort_order) VALUES
  (CURRENT_DATE, 'region', 'South Asia',       1842, 42.9, 1),
  (CURRENT_DATE, 'region', 'Middle East',        891, 20.8, 2),
  (CURRENT_DATE, 'region', 'Southeast Asia',     712, 16.6, 3),
  (CURRENT_DATE, 'region', 'Europe',             521, 12.2, 4),
  (CURRENT_DATE, 'region', 'Americas',           321,  7.5, 5);

-- State
INSERT INTO workforce_org_distribution (snapshot_date, dimension, label, count, pct, sort_order) VALUES
  (CURRENT_DATE, 'state', 'Maharashtra',    962, 22.4, 1),
  (CURRENT_DATE, 'state', 'Karnataka',      681, 15.9, 2),
  (CURRENT_DATE, 'state', 'Tamil Nadu',     521, 12.1, 3),
  (CURRENT_DATE, 'state', 'Telangana',      412,  9.6, 4),
  (CURRENT_DATE, 'state', 'Delhi NCR',      389,  9.1, 5),
  (CURRENT_DATE, 'state', 'Gujarat',        312,  7.3, 6),
  (CURRENT_DATE, 'state', 'Others',        1010, 23.6, 7);

-- Location
INSERT INTO workforce_org_distribution (snapshot_date, dimension, label, count, pct, sort_order) VALUES
  (CURRENT_DATE, 'location', 'Mumbai HQ',       721, 16.8, 1),
  (CURRENT_DATE, 'location', 'Bengaluru Tech',  681, 15.9, 2),
  (CURRENT_DATE, 'location', 'Dubai Office',    589, 13.7, 3),
  (CURRENT_DATE, 'location', 'Chennai Hub',     521, 12.1, 4),
  (CURRENT_DATE, 'location', 'Hyderabad',       412,  9.6, 5),
  (CURRENT_DATE, 'location', 'Singapore',       321,  7.5, 6),
  (CURRENT_DATE, 'location', 'Others',         1042, 24.3, 7);

-- Department
INSERT INTO workforce_org_distribution (snapshot_date, dimension, label, count, pct, sort_order) VALUES
  (CURRENT_DATE, 'department', 'Engineering',       1142, 26.6, 1),
  (CURRENT_DATE, 'department', 'Operations',         891, 20.8, 2),
  (CURRENT_DATE, 'department', 'Sales & BD',         621, 14.5, 3),
  (CURRENT_DATE, 'department', 'Finance',            487, 11.4, 4),
  (CURRENT_DATE, 'department', 'HR & Admin',         389,  9.1, 5),
  (CURRENT_DATE, 'department', 'Product & Design',   421,  9.8, 6),
  (CURRENT_DATE, 'department', 'Legal & Compliance', 336,  7.8, 7);

-- Sub-department
INSERT INTO workforce_org_distribution (snapshot_date, dimension, label, count, pct, sort_order) VALUES
  (CURRENT_DATE, 'sub_department', 'Backend Eng.',     512, 11.9, 1),
  (CURRENT_DATE, 'sub_department', 'Frontend Eng.',    312,  7.3, 2),
  (CURRENT_DATE, 'sub_department', 'DevOps / SRE',     318,  7.4, 3),
  (CURRENT_DATE, 'sub_department', 'Field Ops',        489, 11.4, 4),
  (CURRENT_DATE, 'sub_department', 'Inside Sales',     321,  7.5, 5),
  (CURRENT_DATE, 'sub_department', 'Enterprise BD',    300,  7.0, 6),
  (CURRENT_DATE, 'sub_department', 'FP&A',             241,  5.6, 7),
  (CURRENT_DATE, 'sub_department', 'Talent Acq.',      198,  4.6, 8),
  (CURRENT_DATE, 'sub_department', 'Others',          1596, 37.2, 9);
