/*
  # Create Workforce Metrics Tables

  ## New Tables
  - `workforce_metrics` - Stores daily/period snapshot metrics for the workforce dashboard
    - `id` (uuid, primary key)
    - `snapshot_date` (date) - The date this snapshot was taken
    - `total_workforce` (integer) - Total headcount
    - `active_workforce` (integer) - Currently active employees
    - `inactive_workforce` (integer) - Inactive/on-leave employees
    - `present_today` (integer) - Employees present on snapshot date
    - `total_contract_workers` (integer) - Contract workers count
    - `total_vendors_contractors` (integer) - Vendors and third-party contractors
    - `new_workers_mtd` (integer) - New workers added month-to-date
    - `exited_workers_mtd` (integer) - Workers who exited month-to-date
    - `workforce_growth_pct` (numeric) - Workforce growth percentage
    - `workforce_utilization_pct` (numeric) - Workforce utilization percentage
    - `department` (text) - Optional department filter
    - `region` (text) - Optional region filter
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled
  - Authenticated users can read metrics
*/

CREATE TABLE IF NOT EXISTS workforce_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
  total_workforce integer NOT NULL DEFAULT 0,
  active_workforce integer NOT NULL DEFAULT 0,
  inactive_workforce integer NOT NULL DEFAULT 0,
  present_today integer NOT NULL DEFAULT 0,
  total_contract_workers integer NOT NULL DEFAULT 0,
  total_vendors_contractors integer NOT NULL DEFAULT 0,
  new_workers_mtd integer NOT NULL DEFAULT 0,
  exited_workers_mtd integer NOT NULL DEFAULT 0,
  workforce_growth_pct numeric(5,2) NOT NULL DEFAULT 0,
  workforce_utilization_pct numeric(5,2) NOT NULL DEFAULT 0,
  department text DEFAULT 'All',
  region text DEFAULT 'All',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workforce_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read workforce metrics"
  ON workforce_metrics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert workforce metrics"
  ON workforce_metrics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Seed with realistic demo data for current month
INSERT INTO workforce_metrics (
  snapshot_date, total_workforce, active_workforce, inactive_workforce,
  present_today, total_contract_workers, total_vendors_contractors,
  new_workers_mtd, exited_workers_mtd, workforce_growth_pct, workforce_utilization_pct,
  department, region
) VALUES
  (CURRENT_DATE, 4287, 3941, 346, 3612, 782, 214, 63, 18, 2.4, 84.3, 'All', 'All'),
  (CURRENT_DATE - INTERVAL '1 month', 4185, 3840, 345, 3520, 764, 198, 55, 22, 1.8, 82.1, 'All', 'All'),
  (CURRENT_DATE - INTERVAL '2 months', 4108, 3771, 337, 3480, 748, 187, 48, 19, 1.2, 81.5, 'All', 'All');

-- Monthly trend data
CREATE TABLE IF NOT EXISTS workforce_trend (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month_year text NOT NULL,
  total_workforce integer NOT NULL DEFAULT 0,
  active_workforce integer NOT NULL DEFAULT 0,
  new_joiners integer NOT NULL DEFAULT 0,
  exits integer NOT NULL DEFAULT 0,
  utilization_pct numeric(5,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workforce_trend ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read workforce trend"
  ON workforce_trend FOR SELECT
  TO authenticated
  USING (true);

INSERT INTO workforce_trend (month_year, total_workforce, active_workforce, new_joiners, exits, utilization_pct) VALUES
  ('Nov 2025', 3890, 3601, 41, 28, 78.2),
  ('Dec 2025', 3924, 3634, 52, 18, 79.5),
  ('Jan 2026', 3988, 3682, 71, 7, 80.1),
  ('Feb 2026', 4052, 3730, 68, 4, 80.9),
  ('Mar 2026', 4108, 3771, 60, 4, 81.5),
  ('Apr 2026', 4185, 3840, 79, 2, 82.1),
  ('May 2026', 4287, 3941, 63, 18, 84.3);
