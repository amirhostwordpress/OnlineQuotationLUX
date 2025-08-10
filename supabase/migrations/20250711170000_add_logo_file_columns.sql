-- Migration: Add logo file columns to company_settings table
-- This adds columns to store uploaded logo file information

ALTER TABLE company_settings
ADD COLUMN logo_file_name VARCHAR(255) DEFAULT NULL AFTER logo_url,
ADD COLUMN logo_file_path VARCHAR(500) DEFAULT NULL AFTER logo_file_name,
ADD COLUMN logo_file_size INT DEFAULT NULL AFTER logo_file_path,
ADD COLUMN logo_mime_type VARCHAR(100) DEFAULT NULL AFTER logo_file_size; 