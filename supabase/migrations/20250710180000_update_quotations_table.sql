-- Migration: Add total_area to quotations table for area in m²
ALTER TABLE quotations
ADD COLUMN total_area DECIMAL(10,4) DEFAULT NULL AFTER pricing_data; 