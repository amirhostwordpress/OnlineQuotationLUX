-- Insert Quartz Materials with Base Costs (per square meter)
-- 280 AED/sqm base cost for standard quartz colors
-- 320 AED/sqm base cost for premium quartz colors
-- 220 AED/sqm for budget option (Moon White)
-- 350 AED/sqm for special finish (The Saint Matt)

INSERT INTO material_options (type, color_name, finishing, thickness, slab_size, slab_qty_sqm, base_cost, is_available) VALUES
-- Standard Quartz (280 AED/sqm base cost)
('quartz', 'Golden River 20mm Polish', 'Polish', '20mm', '5.12', 5.12, 280.00, TRUE),
('quartz', 'The Grold 20mm Polish', 'Polish', '20mm', '5.12', 5.12, 280.00, TRUE),
('quartz', 'Megistic White 20mm Polish', 'Polish', '20mm', '5.12', 5.12, 260.00, TRUE),
('quartz', 'Royal Statuario 20mm Polish', 'Polish', '20mm', '5.12', 5.12, 280.00, TRUE),
('quartz', 'Universe Grey 20mm Polish', 'Polish', '20mm', '5.12', 5.12, 280.00, TRUE),
('quartz', 'Strike Light 20mm Polish', 'Polish', '20mm', '5.12', 5.12, 280.00, TRUE),
('quartz', 'Grey Leather 20mm Leather', 'Leather', '20mm', '5.12', 5.12, 280.00, TRUE),

-- Premium Quartz (320 AED/sqm base cost)
('quartz', 'White Pazzal 20mm Polish', 'Polish', '20mm', '5.12', 5.12, 320.00, TRUE),
('quartz', 'The Saint 20mm Polish', 'Polish', '20mm', '5.12', 5.12, 320.00, TRUE),
('quartz', 'The Saint 20mm Matt', 'Matt', '20mm', '5.12', 5.12, 350.00, TRUE),
('quartz', 'Super Wave 20mm Polish', 'Polish', '20mm', '5.12', 5.12, 320.00, TRUE),
('quartz', 'White Beauty 20mm Polish', 'Polish', '20mm', '5.12', 5.12, 320.00, TRUE),
('quartz', 'Grey Wonder 20mm Polish', 'Polish', '20mm', '5.12', 5.12, 320.00, TRUE),
('quartz', 'Supreme Taj 20mm Polish', 'Polish', '20mm', '5.12', 5.12, 320.00, TRUE),
('quartz', 'Golden Track 20mm Polish', 'Polish', '20mm', '5.12', 5.12, 320.00, TRUE),
('quartz', 'The Ambience 20mm Leather', 'Leather', '20mm', '5.12', 5.12, 320.00, TRUE),
('quartz', 'The Glacier 20mm Polish', 'Polish', '20mm', '5.12', 5.12, 320.00, TRUE),
('quartz', 'Imperial White 20mm Polish', 'Polish', '20mm', '5.12', 5.12, 320.00, TRUE),
('quartz', 'Ambience Touch 20mm Polish', 'Polish', '20mm', '5.12', 5.12, 320.00, TRUE),
('quartz', 'Amazed Grey 20mm Polish', 'Polish', '20mm', '5.12', 5.12, 320.00, TRUE),
('quartz', 'Moon White 20mm Polish', 'Polish', '20mm', '5.12', 5.12, 220.00, TRUE); 