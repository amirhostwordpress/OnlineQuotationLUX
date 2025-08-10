-- Migration: Add new fields to material_options for quartz materials
ALTER TABLE material_options
  ADD COLUMN finishing VARCHAR(50) DEFAULT NULL AFTER color_name,
  ADD COLUMN thickness VARCHAR(20) DEFAULT NULL AFTER finishing,
  ADD COLUMN slab_size VARCHAR(20) DEFAULT NULL AFTER thickness,
  ADD COLUMN slab_qty_sqm DECIMAL(6,2) DEFAULT NULL AFTER slab_size,
  ADD COLUMN costing_online_quote INT DEFAULT NULL AFTER slab_qty_sqm; 