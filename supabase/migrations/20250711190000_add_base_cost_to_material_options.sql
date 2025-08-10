-- Migration: Add base_cost field to material_options for dynamic pricing
ALTER TABLE material_options
  ADD COLUMN base_cost DECIMAL(10,2) DEFAULT 280.00 AFTER costing_online_quote;

-- Update existing materials with their base costs
UPDATE material_options SET base_cost = 280.00 WHERE color_name IN (
  'Golden River',
  'The Grold',
  'Royal Statuario',
  'Universe Grey',
  'Grey Leather',
  'Strike Light'
);

UPDATE material_options SET base_cost = 320.00 WHERE color_name IN (
  'White Pazzal 20mm Polish',
  'The Saint 20mm Polish',
  'Super Wave 20mm Polish',
  'White Beauty 20mm Polish',
  'Grey Wonder 20mm Polish',
  'Supreme Taj 20mm Polish',
  'Golden Track 20mm Polish',
  'The Ambience 20mm Leather',
  'The Glacier 20mm Polish',
  'Imperial White 20mm Polish',
  'Ambience Touch 20mm Polish',
  'Amazed Grey 20mm Polish'
); 