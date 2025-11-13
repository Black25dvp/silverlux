-- Create table for tracking product searches and views
CREATE TABLE public.product_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  search_term text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index for better query performance
CREATE INDEX idx_product_searches_product_id ON public.product_searches(product_id);
CREATE INDEX idx_product_searches_created_at ON public.product_searches(created_at DESC);

-- Enable RLS
ALTER TABLE public.product_searches ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert search records
CREATE POLICY "Anyone can insert search records"
ON public.product_searches
FOR INSERT
WITH CHECK (true);

-- Allow anyone to view search records for analytics
CREATE POLICY "Anyone can view search records"
ON public.product_searches
FOR SELECT
USING (true);