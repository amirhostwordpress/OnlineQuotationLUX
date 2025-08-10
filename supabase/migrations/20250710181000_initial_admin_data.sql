-- Insert initial admin data for Luxone Quotation System

-- Insert default company settings
INSERT INTO company_settings (id, company_name, website, address, whatsapp_india, whatsapp_uae, admin_email, price_per_sqft, aed_to_usd_rate, vat_rate, consultant_name, consultant_phone, consultant_email) VALUES
(1, 'Luxone', 'www.theluxone.com', 'Dubai, UAE\nPremium Worktop Solutions', '+919648555355', '+971585815601', 'amirhost07@gmail.com', 150.00, 3.6700, 5.00, 'Ahmed Al-Rashid', '+971501234567', 'ahmed@theluxone.com')
ON DUPLICATE KEY UPDATE id=id;

-- Insert default form fields
INSERT INTO form_fields (field_id, field_type, label, is_required, options, step_number, category, display_order, is_visible) VALUES
('serviceLevel', 'radio', 'Scope of Work', 1, '["Fabrication Only", "Fabrication & Delivery", "Fabrication, Delivery & Installation"]', 1, 'Service', 1, 1),
('materialSource', 'radio', 'Material Source', 1, '["By Luxone Own Material", "By Yourself", "Luxone Others"]', 2, 'Material', 2, 1),
('materialType', 'select', 'Material Type', 0, '["Luxone Quartz", "Luxone Porcelain"]', 2, 'Material', 3, 1),
('worktopLayout', 'radio', 'Worktop Layout', 1, '["U + Island", "U Shape", "L + Island", "L Shape", "Galley", "1 Piece", "Custom"]', 3, 'Layout', 4, 1),
('customEdge', 'radio', 'Custom Edge Required', 0, '["YES", "NO"]', 5, 'Design', 5, 1),
('sinkCutOut', 'select', 'Sink Cut Out', 0, '["0", "1", "2"]', 5, 'Design', 6, 1),
('hobCutOut', 'select', 'Hob Cut Out', 0, '["0", "1", "2"]', 5, 'Design', 7, 1),
('underMountedSink', 'radio', 'Under Mounted Sink', 0, '["YES", "NO"]', 5, 'Design', 8, 1),
('steelFrame', 'radio', 'Steel Frame', 0, '["YES", "NO"]', 5, 'Design', 9, 1),
('timeline', 'radio', 'Project Timeline', 1, '["ASAP to 2 Weeks", "3 to 6 Weeks", "6 Weeks or more"]', 6, 'Timeline', 10, 1),
('sinkOption', 'select', 'Sink Options', 1, '["No thanks", "I will supply my own sink", "Stainless Steel - 1 Full Bowl", "Stainless Steel - 1 + 1/2 Bowl", "Stainless Steel - 2 Bowls"]', 7, 'Sink', 11, 1),
('projectType', 'select', 'Project Type & Application', 1, '["Kitchen - Ready for worktops now / ASAP", "Kitchen - Under renovation", "Kitchen - Planning stage", "Bathroom - Ready for worktops now / ASAP", "Bathroom - Under renovation", "Bathroom - Planning stage", "Commercial - Office space", "Commercial - Restaurant/Hotel", "Commercial - Retail", "Residential - New construction", "Residential - Renovation", "Other - Please specify in comments"]', 8, 'Project', 12, 1),
('name', 'text', 'Your Name', 1, NULL, 9, 'Contact', 13, 1),
('email', 'text', 'Email Address', 1, NULL, 9, 'Contact', 14, 1),
('contactNumber', 'text', 'Contact Number', 1, NULL, 9, 'Contact', 15, 1),
('location', 'select', 'Location', 1, '["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"]', 9, 'Contact', 16, 1),
('additionalComments', 'textarea', 'Additional Comments or Questions', 0, NULL, 9, 'Contact', 17, 1)
ON DUPLICATE KEY UPDATE field_id=field_id;

-- Insert default PDF template
INSERT INTO pdf_templates (template_id, name, header_logo, header_text, footer_text, primary_color, secondary_color, accent_color, heading_font, body_font, show_client_info, show_project_specs, show_pricing, show_terms, layout_style, is_active, is_default) VALUES
('default', 'Default Template', 'https://theluxone.com/wp-content/uploads/2025/06/cropped-Luxone_HQ-1.png', 'Luxone - Premium Worktop Solutions', '© 2025 Luxone - Premium Worktop Solutions | UAE | www.theluxone.com', '#3B82F6', '#8B5CF6', '#F59E0B', 'Arial, sans-serif', 'Arial, sans-serif', 1, 1, 1, 1, 'standard', 1, 1)
ON DUPLICATE KEY UPDATE template_id=template_id;

-- Insert default pricing rules
INSERT INTO pricing_rules (rule_id, label, value, is_active) VALUES
('material_base', 'Base Material Cost', 150.00, 1),
('cutting', 'Cutting Cost', 20.00, 1),
('top_polishing', 'Top Polishing', 50.00, 1),
('edge_polishing', 'Edge Polishing', 30.00, 1),
('installation', 'Installation Cost', 140.00, 1),
('sink_luxone', 'Luxone Sink Cost', 500.00, 1),
('delivery_dubai', 'Dubai Delivery', 500.00, 1),
('delivery_uae', 'UAE Delivery', 800.00, 1),
('margin', 'Business Margin', 20.00, 1),
('vat', 'VAT', 5.00, 1)
ON DUPLICATE KEY UPDATE rule_id=rule_id; 