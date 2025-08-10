-- Migration: Rename price_per_sqft to price_per_sqm for clarity
-- The values are actually per square meter, not per square foot

-- Rename the column in material_options table
ALTER TABLE material_options 
CHANGE COLUMN price_per_sqft price_per_sqm DECIMAL(10,2);

-- Update any references in other tables if they exist
-- (This migration ensures the database field name matches the actual unit of measurement)

-- Add comment to clarify the unit
ALTER TABLE material_options 
MODIFY COLUMN price_per_sqm DECIMAL(10,2) COMMENT 'Price per square meter (AED/sqm)';
