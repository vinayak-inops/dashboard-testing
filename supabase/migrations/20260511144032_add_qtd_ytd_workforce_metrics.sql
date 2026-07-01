/*
  # Add QTD and YTD columns to workforce_metrics

  ## Changes
  - `workforce_metrics` table gets 4 new columns:
    - `new_workers_qtd` (integer) - New workers added quarter-to-date
    - `exited_workers_qtd` (integer) - Workers who exited quarter-to-date
    - `new_workers_ytd` (integer) - New workers added year-to-date
    - `exited_workers_ytd` (integer) - Workers who exited year-to-date
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workforce_metrics' AND column_name = 'new_workers_qtd'
  ) THEN
    ALTER TABLE workforce_metrics ADD COLUMN new_workers_qtd integer NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workforce_metrics' AND column_name = 'exited_workers_qtd'
  ) THEN
    ALTER TABLE workforce_metrics ADD COLUMN exited_workers_qtd integer NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workforce_metrics' AND column_name = 'new_workers_ytd'
  ) THEN
    ALTER TABLE workforce_metrics ADD COLUMN new_workers_ytd integer NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workforce_metrics' AND column_name = 'exited_workers_ytd'
  ) THEN
    ALTER TABLE workforce_metrics ADD COLUMN exited_workers_ytd integer NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Update existing seed rows with realistic QTD/YTD values
UPDATE workforce_metrics
SET
  new_workers_qtd = 142,
  exited_workers_qtd = 39,
  new_workers_ytd = 261,
  exited_workers_ytd = 51
WHERE snapshot_date = CURRENT_DATE;

UPDATE workforce_metrics
SET
  new_workers_qtd = 79,
  exited_workers_qtd = 21,
  new_workers_ytd = 198,
  exited_workers_ytd = 33
WHERE snapshot_date = CURRENT_DATE - INTERVAL '1 month';

UPDATE workforce_metrics
SET
  new_workers_qtd = 128,
  exited_workers_qtd = 23,
  new_workers_ytd = 119,
  exited_workers_ytd = 23
WHERE snapshot_date = CURRENT_DATE - INTERVAL '2 months';
