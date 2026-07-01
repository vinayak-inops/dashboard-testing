CREATE TABLE IF NOT EXISTS work_orders (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_number    text        NOT NULL,
  work_order_date      date,
  vendor_name          text,
  number_of_employee   integer     NOT NULL DEFAULT 0,
  contract_period_from date        NOT NULL,
  contract_period_to   date        NOT NULL,
  work_order_type      text        NOT NULL DEFAULT 'Standard',
  service_line_items   text        NOT NULL DEFAULT '',
  service_code         text        NOT NULL DEFAULT '',
  created_at           timestamptz DEFAULT now()
);

ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_anon_read_work_orders"
  ON work_orders FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO work_orders (work_order_number, work_order_date, vendor_name, number_of_employee, contract_period_from, contract_period_to, work_order_type, service_line_items, service_code) VALUES
  ('AP26238048', '2023-06-01', 'BVOC',                        511, '2023-07-01', '2029-12-31', 'Standard',    'General items',               'TTTT'),
  ('AP25810012', '2019-03-01', 'BVOC',                        180, '2019-04-01', '2023-03-31', 'Standard',    'General Workforce Supply',    'GW01'),
  ('AP26118022', '2022-03-10', 'Gram Vikas Society',           321, '2022-04-01', '2027-03-31', 'Standard',    'Facility Management',         'FM01'),
  ('AP26320050', '2026-01-15', 'Gram Vikas Society',           140, '2026-07-01', '2029-06-30', 'Standard',    'Housekeeping Services',       'HK02'),
  ('AP25997011', '2021-11-15', 'BSA CORPORATION LIMITED',      144, '2022-01-01', '2025-12-31', 'Specialist',  'IT Support Services',         'IT03'),
  ('AP26401070', '2025-02-01', 'BSA CORPORATION LIMITED',      210, '2025-04-01', '2028-03-31', 'Specialist',  'Network & Infrastructure',    'NI03'),
  ('AP26401059', '2024-01-05', 'SRI CAUVERY SECURITY',         191, '2024-02-01', '2026-01-31', 'Security',    'Security & Surveillance',     'SEC2'),
  ('AP26512075', '2025-11-01', 'SRI CAUVERY SECURITY',         130, '2026-02-01', '2028-01-31', 'Security',    'Access Control & Patrol',     'SEC3'),
  ('AP26512071', '2025-01-01', 'TECHNO RESOURCES & SERVICES',  261, '2025-02-01', '2028-01-31', 'Technical',   'Technical Maintenance',       'TM04'),
  ('AP26619090', '2025-08-01', 'TECHNO RESOURCES & SERVICES',  105, '2026-01-01', '2028-12-31', 'Technical',   'Equipment Calibration',       'TM05'),
  ('AP26320044', '2023-09-01', 'MAA GAYATRI CONSTRACTIONS',    136, '2023-10-01', '2027-09-30', 'Construction','Civil & Construction Works',  'CW07'),
  ('AP25812004', '2020-08-20', 'MAA GAYATRI CONSTRACTIONS',    175, '2020-09-01', '2024-08-31', 'Construction','Structural Repairs',          'CW06'),
  ('AP26619083', '2025-06-01', 'MERAQUI',                      142, '2026-01-01', '2028-12-31', 'Standard',    'General Workforce Supply',    'GW05');
