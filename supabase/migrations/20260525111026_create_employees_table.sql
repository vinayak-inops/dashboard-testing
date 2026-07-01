/*
  # Create employees table

  1. New Tables
    - `employees`
      - `id` (uuid, primary key)
      - `emp_id` (text, unique employee ID like EMP-001)
      - `name` (text)
      - `department` (text)
      - `designation` (text)
      - `employment_type` (text) - 'Active', 'Inactive', 'Contract', 'Vendor', 'New', 'Exited'
      - `status` (text) - 'Active', 'Inactive', 'Present', 'Absent'
      - `gender` (text)
      - `location` (text)
      - `join_date` (date)
      - `exit_date` (date, nullable)
      - `vendor_name` (text, nullable)
      - `contract_type` (text, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Allow anonymous read (dashboard is read-only public)
*/

CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  emp_id text UNIQUE NOT NULL,
  name text NOT NULL,
  department text NOT NULL DEFAULT '',
  designation text NOT NULL DEFAULT '',
  employment_type text NOT NULL DEFAULT 'Active',
  status text NOT NULL DEFAULT 'Active',
  gender text NOT NULL DEFAULT 'Male',
  location text NOT NULL DEFAULT '',
  join_date date NOT NULL DEFAULT CURRENT_DATE,
  exit_date date,
  vendor_name text,
  contract_type text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read employees"
  ON employees FOR SELECT
  TO anon, authenticated
  USING (true);

-- Seed 100 employees
INSERT INTO employees (emp_id, name, department, designation, employment_type, status, gender, location, join_date, exit_date, vendor_name, contract_type) VALUES
('EMP-001','Arjun Sharma','Engineering','Senior Engineer','Active','Present','Male','Mumbai HQ','2021-03-15',NULL,NULL,NULL),
('EMP-002','Priya Nair','HR & Admin','HR Manager','Active','Present','Female','Bengaluru Tech','2020-07-01',NULL,NULL,NULL),
('EMP-003','Rahul Gupta','Finance','Finance Analyst','Active','Present','Male','Mumbai HQ','2022-01-10',NULL,NULL,NULL),
('EMP-004','Sneha Patel','Sales & BD','Sales Executive','Active','Absent','Female','Chennai Hub','2021-09-20',NULL,NULL,NULL),
('EMP-005','Vikram Singh','Engineering','DevOps Engineer','Active','Present','Male','Bengaluru Tech','2020-11-05',NULL,NULL,NULL),
('EMP-006','Anjali Mehta','Product & Design','Product Manager','Active','Present','Female','Mumbai HQ','2019-06-12',NULL,NULL,NULL),
('EMP-007','Kiran Kumar','Operations','Operations Lead','Active','Present','Male','Hyderabad','2021-04-18',NULL,NULL,NULL),
('EMP-008','Divya Reddy','Legal & Compliance','Legal Counsel','Active','Present','Female','Chennai Hub','2020-02-28',NULL,NULL,NULL),
('EMP-009','Rohan Joshi','Engineering','Backend Engineer','Active','Present','Male','Bengaluru Tech','2022-08-01',NULL,NULL,NULL),
('EMP-010','Meera Iyer','Finance','Senior Analyst','Active','Absent','Female','Mumbai HQ','2019-12-15',NULL,NULL,NULL),
('EMP-011','Suresh Babu','Operations','Field Ops Supervisor','Active','Present','Male','Chennai Hub','2021-05-22',NULL,NULL,NULL),
('EMP-012','Lakshmi Varma','HR & Admin','Talent Acquisition','Active','Present','Female','Hyderabad','2020-09-10',NULL,NULL,NULL),
('EMP-013','Aditya Roy','Engineering','Frontend Engineer','Active','Present','Male','Bengaluru Tech','2022-03-07',NULL,NULL,NULL),
('EMP-014','Pooja Desai','Sales & BD','Business Developer','Active','Present','Female','Mumbai HQ','2021-07-14',NULL,NULL,NULL),
('EMP-015','Manoj Tiwari','Finance','FP&A Manager','Active','Present','Male','Delhi NCR','2018-11-01',NULL,NULL,NULL),
('EMP-016','Kavitha Srinivasan','Product & Design','UX Designer','Active','Present','Female','Bengaluru Tech','2022-01-25',NULL,NULL,NULL),
('EMP-017','Deepak Nambiar','Engineering','SRE Engineer','Active','Absent','Male','Mumbai HQ','2021-10-11',NULL,NULL,NULL),
('EMP-018','Nandini Pillai','Legal & Compliance','Compliance Officer','Active','Present','Female','Chennai Hub','2020-06-05',NULL,NULL,NULL),
('EMP-019','Sanjay Kulkarni','Operations','Operations Analyst','Active','Present','Male','Pune','2022-04-19',NULL,NULL,NULL),
('EMP-020','Harini Krishnan','HR & Admin','HR Generalist','Active','Present','Female','Hyderabad','2021-08-30',NULL,NULL,NULL),
('EMP-021','Bala Subramanian','Engineering','Tech Lead','Active','Present','Male','Bengaluru Tech','2019-04-15',NULL,NULL,NULL),
('EMP-022','Smitha George','Finance','Accountant','Active','Present','Female','Kochi','2022-06-01',NULL,NULL,NULL),
('EMP-023','Ravi Shankar','Sales & BD','Enterprise BD Manager','Active','Present','Male','Delhi NCR','2020-03-20',NULL,NULL,NULL),
('EMP-024','Usha Nair','Product & Design','Product Analyst','Active','Absent','Female','Mumbai HQ','2021-11-08',NULL,NULL,NULL),
('EMP-025','Ganesh Murthy','Engineering','Data Engineer','Active','Present','Male','Bengaluru Tech','2022-09-14',NULL,NULL,NULL),
('EMP-026','Rekha Venkatesh','HR & Admin','Learning & Development','Active','Present','Female','Chennai Hub','2020-08-17',NULL,NULL,NULL),
('EMP-027','Praveen Kumar','Operations','Logistics Coordinator','Active','Present','Male','Hyderabad','2021-02-03',NULL,NULL,NULL),
('EMP-028','Anitha Rajan','Legal & Compliance','IP Specialist','Active','Present','Female','Bengaluru Tech','2019-10-22',NULL,NULL,NULL),
('EMP-029','Nikhil Sharma','Engineering','Cloud Architect','Active','Present','Male','Mumbai HQ','2020-05-29',NULL,NULL,NULL),
('EMP-030','Saranya Mohan','Finance','Tax Analyst','Active','Present','Female','Chennai Hub','2022-02-16',NULL,NULL,NULL),
('EMP-031','Ramesh Pillai','Operations','Plant Manager','Inactive','Absent','Male','Pune','2017-06-01','2025-11-30',NULL,NULL),
('EMP-032','Geetha Krishnan','HR & Admin','HR Business Partner','Inactive','Absent','Female','Bengaluru Tech','2016-09-15','2025-10-31',NULL,NULL),
('EMP-033','Sunil Jain','Sales & BD','Sales Manager','Inactive','Absent','Male','Delhi NCR','2018-03-10','2025-12-31',NULL,NULL),
('EMP-034','Padma Devi','Finance','Chief Accountant','Inactive','Absent','Female','Mumbai HQ','2015-07-20','2026-01-15',NULL,NULL),
('EMP-035','Venkat Reddy','Engineering','Principal Engineer','Inactive','Absent','Male','Hyderabad','2014-11-05','2025-09-30',NULL,NULL),
('EMP-036','Lalitha Suresh','Product & Design','Design Head','Inactive','Absent','Female','Bengaluru Tech','2016-02-28','2026-02-28',NULL,NULL),
('EMP-037','Madan Mohan','Operations','Regional Head','Inactive','Absent','Male','Chennai Hub','2013-08-12','2025-08-31',NULL,NULL),
('EMP-038','Vijaya Lakshmi','Legal & Compliance','Deputy General Counsel','Inactive','Absent','Female','Mumbai HQ','2015-04-07','2026-03-31',NULL,NULL),
('EMP-039','Ashok Pandey','Engineering','Engineering Manager','Inactive','Absent','Male','Delhi NCR','2016-12-01','2025-12-15',NULL,NULL),
('EMP-040','Chandrika Menon','HR & Admin','VP HR','Inactive','Absent','Female','Mumbai HQ','2012-06-18','2026-04-30',NULL,NULL),
('EMP-041','Hari Prasad','Engineering','Contract Developer','Contract','Present','Male','Bengaluru Tech','2024-01-15',NULL,'Infosys BPO','Fixed-term'),
('EMP-042','Sunita Rao','Operations','Contract Analyst','Contract','Present','Female','Mumbai HQ','2024-02-01',NULL,'QuickHire Staffing','Project-based'),
('EMP-043','Prakash Mehta','Engineering','Contract QA Engineer','Contract','Present','Male','Chennai Hub','2024-03-10',NULL,'TechMahindra','Fixed-term'),
('EMP-044','Latha Subbu','Finance','Contract Auditor','Contract','Absent','Female','Hyderabad','2024-01-20',NULL,'Infosys BPO','Fixed-term'),
('EMP-045','Karthik Balaji','Engineering','Contract DevOps','Contract','Present','Male','Bengaluru Tech','2024-04-05',NULL,'TechMahindra','Fixed-term'),
('EMP-046','Mala Krishnan','HR & Admin','Contract Recruiter','Contract','Present','Female','Mumbai HQ','2024-02-15',NULL,'QuickHire Staffing','Project-based'),
('EMP-047','Rajesh Babu','Sales & BD','Contract BD Executive','Contract','Present','Male','Delhi NCR','2024-03-01',NULL,'BrightPath Consult','Project-based'),
('EMP-048','Nalini Varma','Finance','Contract Accountant','Contract','Present','Female','Chennai Hub','2024-01-10',NULL,'Infosys BPO','Fixed-term'),
('EMP-049','Sivakumar K','Engineering','Contract Backend Dev','Contract','Absent','Male','Bengaluru Tech','2024-05-01',NULL,'TechMahindra','Fixed-term'),
('EMP-050','Preethi Sundaram','Product & Design','Contract UX Researcher','Contract','Present','Female','Mumbai HQ','2024-02-20',NULL,'BrightPath Consult','Project-based'),
('EMP-051','Ramu Facilities','Operations','Facility Supervisor','Vendor','Present','Male','Mumbai HQ','2023-06-01',NULL,'Sodexo Facilities','Long-term'),
('EMP-052','Geeta Security','Operations','Security Guard','Vendor','Present','Female','Bengaluru Tech','2023-08-15',NULL,'G4S Security','Long-term'),
('EMP-053','Mohan Catering','Operations','Catering Supervisor','Vendor','Present','Male','Chennai Hub','2023-07-01',NULL,'Aramark Catering','Long-term'),
('EMP-054','Seema Cleaning','Operations','Housekeeping Staff','Vendor','Present','Female','Hyderabad','2023-09-10',NULL,'CleanZone Services','Short-term'),
('EMP-055','Arun Logistics','Operations','Warehouse Supervisor','Vendor','Absent','Male','Pune','2023-05-20',NULL,'LogiPro Warehousing','Fixed-term'),
('EMP-056','Kavya IT','Engineering','IT Support','Vendor','Present','Female','Delhi NCR','2024-01-05',NULL,'NetForce IT','Project-based'),
('EMP-057','Balaji Security','Operations','Security Supervisor','Vendor','Present','Male','Mumbai HQ','2023-10-01',NULL,'G4S Security','Long-term'),
('EMP-058','Jaya Catering','Operations','Pantry Staff','Vendor','Present','Female','Bengaluru Tech','2023-11-15',NULL,'Aramark Catering','Long-term'),
('EMP-059','Rajan Facilities','Operations','Maintenance Technician','Vendor','Present','Male','Chennai Hub','2023-06-20',NULL,'Sodexo Facilities','Long-term'),
('EMP-060','Nisha IT','Engineering','Network Engineer','Vendor','Present','Female','Hyderabad','2023-12-01',NULL,'Infosys BPO','Fixed-term'),
('EMP-061','Tanvir Ahmed','Engineering','Backend Engineer','Active','Present','Male','Mumbai HQ','2026-01-06',NULL,NULL,NULL),
('EMP-062','Ritika Sharma','HR & Admin','HR Executive','Active','Present','Female','Bengaluru Tech','2026-01-12',NULL,NULL,NULL),
('EMP-063','Sahil Gupta','Sales & BD','Sales Associate','Active','Present','Male','Chennai Hub','2026-01-20',NULL,NULL,NULL),
('EMP-064','Priyanka Das','Finance','Financial Analyst','Active','Present','Female','Delhi NCR','2026-02-03',NULL,NULL,NULL),
('EMP-065','Amit Verma','Engineering','Mobile Developer','Active','Present','Male','Mumbai HQ','2026-02-10',NULL,NULL,NULL),
('EMP-066','Shreya Joshi','Product & Design','Product Designer','Active','Present','Female','Bengaluru Tech','2026-02-17',NULL,NULL,NULL),
('EMP-067','Naveen Reddy','Operations','Operations Executive','Active','Present','Male','Hyderabad','2026-03-02',NULL,NULL,NULL),
('EMP-068','Ananya Nair','Legal & Compliance','Junior Legal Associate','Active','Present','Female','Chennai Hub','2026-03-09',NULL,NULL,NULL),
('EMP-069','Rohit Kapoor','Engineering','Cloud Engineer','Active','Present','Male','Delhi NCR','2026-03-16',NULL,NULL,NULL),
('EMP-070','Divyanka Singh','Finance','Accounts Executive','Active','Present','Female','Mumbai HQ','2026-03-23',NULL,NULL,NULL),
('EMP-071','Suresh Menon','Engineering','QA Engineer','Active','Present','Male','Bengaluru Tech','2026-04-01',NULL,NULL,NULL),
('EMP-072','Padmini Rao','HR & Admin','Payroll Specialist','Active','Present','Female','Mumbai HQ','2026-04-07',NULL,NULL,NULL),
('EMP-073','Aryan Pandey','Sales & BD','Inside Sales Rep','Active','Present','Male','Delhi NCR','2026-04-14',NULL,NULL,NULL),
('EMP-074','Neha Kulkarni','Finance','Tax Associate','Active','Present','Female','Pune','2026-04-21',NULL,NULL,NULL),
('EMP-075','Krishnaraj M','Engineering','Security Engineer','Active','Present','Male','Bengaluru Tech','2026-04-28',NULL,NULL,NULL),
('EMP-076','Shalini Thomas','Product & Design','Product Manager','Active','Present','Female','Mumbai HQ','2026-05-05',NULL,NULL,NULL),
('EMP-077','Mithun Das','Operations','Supply Chain Analyst','Active','Present','Male','Chennai Hub','2026-05-12',NULL,NULL,NULL),
('EMP-078','Radhika Pillai','Legal & Compliance','Compliance Executive','Active','Present','Female','Hyderabad','2026-05-19',NULL,NULL,NULL),
('EMP-079','Vivek Nambiar','Engineering','Fullstack Developer','Active','Present','Male','Mumbai HQ','2026-05-01',NULL,NULL,NULL),
('EMP-080','Ishaan Sharma','Engineering','ML Engineer','Active','Present','Male','Bengaluru Tech','2026-05-08',NULL,NULL,NULL),
('EMP-081','Fatima Khan','Engineering','Architect','Active','Present','Female','Dubai Office','2018-04-01',NULL,NULL,NULL),
('EMP-082','Carlos Mendes','Sales & BD','Regional Sales Head','Active','Present','Male','Singapore','2019-01-15',NULL,NULL,NULL),
('EMP-083','Maria Chen','Finance','CFO','Active','Present','Female','Singapore','2017-06-01',NULL,NULL,NULL),
('EMP-084','John Smith','Engineering','CTO','Active','Present','Male','Dubai Office','2016-09-01',NULL,NULL,NULL),
('EMP-085','Aisha Al-Farsi','HR & Admin','CHRO','Active','Present','Female','Dubai Office','2018-02-01',NULL,NULL,NULL),
('EMP-086','Nguyen Van A','Engineering','Senior Developer','Active','Present','Male','Singapore','2020-05-10',NULL,NULL,NULL),
('EMP-087','Sophie Müller','Product & Design','Head of Design','Active','Present','Female','Singapore','2021-03-20',NULL,NULL,NULL),
('EMP-088','Ahmed Hassan','Operations','COO','Active','Present','Male','Dubai Office','2017-11-01',NULL,NULL,NULL),
('EMP-089','Li Wei','Engineering','Principal Engineer','Active','Present','Male','Singapore','2019-07-15',NULL,NULL,NULL),
('EMP-090','Hana Suzuki','Finance','Controller','Active','Present','Female','Dubai Office','2020-09-01',NULL,NULL,NULL),
('EMP-091','Ravi Patel Exited','Engineering','Senior Engineer','Active','Absent','Male','Mumbai HQ','2022-05-01','2026-05-10',NULL,NULL),
('EMP-092','Meena Krishnan Exited','HR & Admin','HR Manager','Active','Absent','Female','Bengaluru Tech','2021-08-15','2026-05-15',NULL,NULL),
('EMP-093','David Lee Exited','Finance','Finance Lead','Active','Absent','Male','Singapore','2020-03-10','2026-04-30',NULL,NULL),
('EMP-094','Swati Bhatt Exited','Sales & BD','Sales Head','Active','Absent','Female','Mumbai HQ','2019-11-01','2026-05-01',NULL,NULL),
('EMP-095','Arun Nair Exited','Engineering','Backend Lead','Active','Absent','Male','Chennai Hub','2021-01-20','2026-05-20',NULL,NULL),
('EMP-096','Zara Ahmed Exited','Product & Design','Product Lead','Active','Absent','Female','Dubai Office','2020-06-05','2026-03-31',NULL,NULL),
('EMP-097','Kiran Rao Exited','Operations','Ops Manager','Active','Absent','Male','Hyderabad','2018-09-01','2026-04-15',NULL,NULL),
('EMP-098','Puja Verma Exited','Legal & Compliance','Legal Manager','Active','Absent','Female','Delhi NCR','2020-02-10','2026-05-05',NULL,NULL),
('EMP-099','Tarun Kapoor Exited','Engineering','Cloud Lead','Active','Absent','Male','Mumbai HQ','2021-07-01','2026-05-18',NULL,NULL),
('EMP-100','Nandita Roy Exited','Finance','Sr Accountant','Active','Absent','Female','Bengaluru Tech','2022-03-15','2026-05-22',NULL,NULL)
ON CONFLICT (emp_id) DO NOTHING;
