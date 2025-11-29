-- Add is_deleted column to equipment table for soft deletes
ALTER TABLE public.equipment 
ADD COLUMN IF NOT EXISTS is_deleted boolean DEFAULT false;

-- Optional: Update existing records to have false
UPDATE public.equipment SET is_deleted = false WHERE is_deleted IS NULL;
