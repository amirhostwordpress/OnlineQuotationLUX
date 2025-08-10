-- Migration: Add total_area column to quotations table
-- This adds the missing total_area column that stores the total area in square meters

ALTER TABLE quotations
ADD COLUMN total_area DECIMAL(10,4) DEFAULT NULL AFTER pricing_data;
 
-- Add an index for better performance when querying by area
CREATE INDEX idx_quotations_total_area ON quotations(total_area); 