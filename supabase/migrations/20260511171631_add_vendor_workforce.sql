/*
  # Add Vendor Workforce Table

  ## New Table
  - `vendor_workforce`
    Tracks external vendor/contractor headcount across multiple dimensions.
    - `id` (uuid, primary key)
    - `snapshot_date` (date)
    - `vendor_name` (text) - Vendor company name
    - `category` (text) - Service category (IT Services, Facility Mgmt, etc.)
    - `engagement_type` (text) - Contract type (Fixed-term, Project-based, etc.)
    - `status` (text) - Active / Inactive / Pending
    - `count` (integer) - Number of workers
    - `pct_of_total` (numeric) - Percentage of total vendor workforce
    - `contract_end_date` (date) - When engagement ends (nullable)
    - `sort_order` (integer)
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled, anon + authenticated can read
*/

CREATE TABLE IF NOT EXISTS vendor_workforce (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
  vendor_name text NOT NULL,
  category text NOT NULL,
  engagement_type text NOT NULL,
  status text NOT NULL DEFAULT 'Active',
  count integer NOT NULL DEFAULT 0,
  pct_of_total numeric(5,2) NOT NULL DEFAULT 0,
  contract_end_date date,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vendor_workforce ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon and authenticated read vendor workforce"
  ON vendor_workforce FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO vendor_workforce (snapshot_date, vendor_name, category, engagement_type, status, count, pct_of_total, contract_end_date, sort_order) VALUES
  (CURRENT_DATE, 'Infosys BPO',          'IT Services',        'Fixed-term',     'Active',   48, 22.43, '2026-12-31', 1),
  (CURRENT_DATE, 'Sodexo Facilities',    'Facility Mgmt',      'Long-term',      'Active',   37, 17.29, '2027-03-31', 2),
  (CURRENT_DATE, 'QuickHire Staffing',   'Staffing Agency',    'Project-based',  'Active',   29, 13.55, '2026-09-30', 3),
  (CURRENT_DATE, 'TechMahindra',         'IT Services',        'Fixed-term',     'Active',   24, 11.21, '2026-11-30', 4),
  (CURRENT_DATE, 'G4S Security',         'Security Services',  'Long-term',      'Active',   22, 10.28, '2027-06-30', 5),
  (CURRENT_DATE, 'Aramark Catering',     'Catering & Pantry',  'Long-term',      'Active',   18,  8.41, '2027-01-31', 6),
  (CURRENT_DATE, 'BrightPath Consult',   'Consulting',         'Project-based',  'Active',   14,  6.54, '2026-08-31', 7),
  (CURRENT_DATE, 'LogiPro Warehousing',  'Logistics',          'Fixed-term',     'Inactive',  8,  3.74, '2026-06-30', 8),
  (CURRENT_DATE, 'CleanZone Services',   'Housekeeping',       'Short-term',     'Active',   11,  5.14, '2026-07-31', 9),
  (CURRENT_DATE, 'NetForce IT',          'IT Services',        'Project-based',  'Pending',   3,  1.40, '2026-10-31', 10);
