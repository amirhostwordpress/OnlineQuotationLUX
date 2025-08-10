/*
# Luxone Quotation System Database - Updated Schema
# Compatible with the new 8-step quotation flow and admin cost management

## 📋 Overview
Complete SQL database structure for the Luxone Quotation System with:
- 8-step quotation flow
- Designer contact information
- Comprehensive cost management
- Admin panel functionality
- File upload management
*/

-- Create database
CREATE DATABASE IF NOT EXISTS luxone_quotation_system 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE luxone_quotation_system;

-- =====================================================
-- 1. ADMIN USERS TABLE
-- =====================================================
CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    full_name VARCHAR(100),
    role ENUM('admin', 'manager', 'viewer') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. COMPANY SETTINGS TABLE
-- =====================================================
CREATE TABLE company_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(100) DEFAULT 'Luxone',
    website VARCHAR(100) DEFAULT 'www.theluxone.com',
    address TEXT DEFAULT 'Dubai, UAE\nPremium Worktop Solutions',
    whatsapp_india VARCHAR(20) DEFAULT '+919648555355',
    whatsapp_uae VARCHAR(20) DEFAULT '+971585815601',
    admin_email VARCHAR(100) DEFAULT 'amirhost07@gmail.com',
    price_per_sqft DECIMAL(10,2) DEFAULT 150.00,
    aed_to_usd_rate DECIMAL(8,4) DEFAULT 3.6700,
    vat_rate DECIMAL(5,2) DEFAULT 5.00,
    consultant_name VARCHAR(100) DEFAULT 'Ahmed Al-Rashid',
    consultant_phone VARCHAR(20) DEFAULT '+971501234567',
    consultant_email VARCHAR(100) DEFAULT 'ahmed@theluxone.com',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. COST RULES TABLE (New - Admin Configurable Costs)
-- =====================================================
CREATE TABLE cost_rules (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category ENUM('material', 'fabrication', 'installation', 'addon', 'delivery', 'business') NOT NULL,
    type ENUM('fixed', 'per_sqm', 'per_piece', 'percentage') NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. QUOTATIONS TABLE (Updated for 8 steps + Designer info)
-- =====================================================
CREATE TABLE quotations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quote_id VARCHAR(20) UNIQUE NOT NULL,
    
    -- Step 1: Scope of Work
    service_level ENUM('fabrication', 'fabrication-delivery', 'fabrication-delivery-installation') NOT NULL,
    
    -- Step 2: Material Options
    material_source ENUM('luxone', 'yourself', 'luxone-others') NOT NULL,
    material_type ENUM('quartz', 'porcelain') NULL,
    material_color VARCHAR(100) NULL,
    
    -- For "By Yourself" option
    slab_size VARCHAR(50) NULL,
    thickness VARCHAR(20) NULL,
    finish VARCHAR(50) NULL,
    
    -- For "Luxone Others" option
    luxone_others_slab_size VARCHAR(50) NULL,
    luxone_others_thickness VARCHAR(20) NULL,
    luxone_others_finish VARCHAR(50) NULL,
    required_slabs VARCHAR(20) NULL,
    price_per_slab VARCHAR(20) NULL,
    brand_supplier VARCHAR(100) NULL,
    luxone_others_color_name VARCHAR(100) NULL,
    
    -- Step 3: Worktop Layout
    worktop_layout ENUM('u-island', 'u-shape', 'l-island', 'l-shape', 'galley', '1-piece', 'custom') NOT NULL,
    
    -- Step 5: Design Options (Simplified)
    sink_option ENUM('client-provided', 'luxone-customized') NOT NULL,
    
    -- Step 6: Timeline
    timeline ENUM('asap-2weeks', '3-6weeks', '6weeks-plus') NOT NULL,
    
    -- Step 7: Project Type
    project_type VARCHAR(200) NOT NULL,
    
    -- Step 8: Contact Information
    -- Client Details
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_location ENUM('Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah') NOT NULL,
    additional_comments TEXT NULL,
    
    -- Designer Details (New)
    designer_name VARCHAR(100) NOT NULL,
    designer_contact VARCHAR(20) NOT NULL,
    designer_email VARCHAR(100) NOT NULL,
    
    -- Pricing and Status
    total_amount DECIMAL(10,2) NULL,
    status ENUM('pending', 'reviewed', 'quoted', 'approved', 'rejected') DEFAULT 'pending',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_quote_id (quote_id),
    INDEX idx_customer_email (customer_email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- 5. QUOTATION PIECES TABLE (Step 4: Worktop Dimensions)
-- =====================================================
CREATE TABLE quotation_pieces (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quotation_id INT NOT NULL,
    piece_label VARCHAR(10) NOT NULL, -- A, B, C, D, E, F
    length_mm INT NOT NULL,
    width_mm INT NOT NULL,
    thickness_mm INT NOT NULL,
    area_sqm DECIMAL(8,4) GENERATED ALWAYS AS ((length_mm * width_mm) / 1000000) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE,
    INDEX idx_quotation_id (quotation_id)
);

-- =====================================================
-- 6. FORM FIELDS TABLE (Admin Configurable)
-- =====================================================
CREATE TABLE form_fields (
    id VARCHAR(50) PRIMARY KEY,
    type ENUM('text', 'select', 'number', 'textarea', 'checkbox', 'radio', 'file') NOT NULL,
    label VARCHAR(200) NOT NULL,
    placeholder VARCHAR(200) NULL,
    required BOOLEAN DEFAULT FALSE,
    options JSON NULL, -- For select/radio options
    validation JSON NULL, -- Validation rules
    step_number INT NOT NULL,
    category VARCHAR(50) NULL,
    display_order INT NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_step_number (step_number),
    INDEX idx_display_order (display_order)
);

-- =====================================================
-- 7. PDF TEMPLATES TABLE
-- =====================================================
CREATE TABLE pdf_templates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    header_logo VARCHAR(500) NULL,
    header_text VARCHAR(200) NULL,
    footer_text TEXT NULL,
    colors JSON NULL, -- {primary, secondary, accent}
    fonts JSON NULL, -- {heading, body}
    sections JSON NULL, -- Section visibility settings
    layout ENUM('standard', 'modern', 'minimal') DEFAULT 'standard',
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 8. MATERIAL OPTIONS TABLE
-- =====================================================
CREATE TABLE material_options (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('quartz', 'porcelain') NOT NULL,
    color_name VARCHAR(100) NOT NULL,
    price_per_sqm DECIMAL(10,2) NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_available (is_available)
);

-- =====================================================
-- 9. QUOTATION FILES TABLE
-- =====================================================
CREATE TABLE quotation_files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quotation_id INT NOT NULL,
    file_type ENUM('slab_photo', 'plan_sketch', 'pdf_quote') NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE,
    INDEX idx_quotation_id (quotation_id),
    INDEX idx_file_type (file_type)
);

-- =====================================================
-- 10. ACTIVITY LOGS TABLE
-- =====================================================
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50) NULL,
    record_id INT NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- 11. EMAIL TEMPLATES TABLE
-- =====================================================
CREATE TABLE email_templates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT NULL,
    variables JSON NULL, -- Available template variables
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 12. SYSTEM SETTINGS TABLE
-- =====================================================
CREATE TABLE system_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

-- Quotation Summary View
CREATE VIEW quotation_summary AS
SELECT 
    q.id,
    q.quote_id,
    q.customer_name,
    q.customer_email,
    q.customer_phone,
    q.customer_location,
    q.designer_name,
    q.designer_email,
    q.service_level,
    q.material_source,
    q.material_type,
    q.material_color,
    q.worktop_layout,
    q.sink_option,
    q.timeline,
    q.project_type,
    q.total_amount,
    q.status,
    COUNT(qp.id) as piece_count,
    COALESCE(SUM(qp.area_sqm), 0) as total_area_sqm,
    q.created_at,
    q.updated_at
FROM quotations q
LEFT JOIN quotation_pieces qp ON q.id = qp.quotation_id
GROUP BY q.id;

-- Monthly Statistics View
CREATE VIEW monthly_stats AS
SELECT 
    YEAR(created_at) as year,
    MONTH(created_at) as month,
    COUNT(*) as total_quotes,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_quotes,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_quotes,
    AVG(total_amount) as avg_quote_amount,
    SUM(total_amount) as total_revenue
FROM quotations
GROUP BY YEAR(created_at), MONTH(created_at)
ORDER BY year DESC, month DESC;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Generate unique quote ID
CREATE PROCEDURE GenerateQuoteId(OUT new_quote_id VARCHAR(20))
BEGIN
    DECLARE counter INT DEFAULT 1;
    DECLARE year_month VARCHAR(7);
    DECLARE base_id VARCHAR(15);
    DECLARE temp_id VARCHAR(20);
    
    SET year_month = DATE_FORMAT(NOW(), '%Y-%m');
    SET base_id = CONCAT('LUX-', year_month, '-');
    
    quote_loop: LOOP
        SET temp_id = CONCAT(base_id, LPAD(counter, 5, '0'));
        
        IF NOT EXISTS (SELECT 1 FROM quotations WHERE quote_id = temp_id) THEN
            SET new_quote_id = temp_id;
            LEAVE quote_loop;
        END IF;
        
        SET counter = counter + 1;
        
        IF counter > 99999 THEN
            SET new_quote_id = CONCAT(base_id, 'ERR');
            LEAVE quote_loop;
        END IF;
    END LOOP;
END //

-- Calculate quote pricing
CREATE PROCEDURE CalculateQuotePricing(IN quote_id_param VARCHAR(20), OUT total_price DECIMAL(10,2))
BEGIN
    DECLARE total_area DECIMAL(10,4) DEFAULT 0;
    DECLARE base_price DECIMAL(10,2) DEFAULT 0;
    DECLARE material_cost DECIMAL(10,2) DEFAULT 0;
    DECLARE fabrication_cost DECIMAL(10,2) DEFAULT 0;
    DECLARE installation_cost DECIMAL(10,2) DEFAULT 0;
    DECLARE addon_cost DECIMAL(10,2) DEFAULT 0;
    DECLARE delivery_cost DECIMAL(10,2) DEFAULT 0;
    DECLARE margin_cost DECIMAL(10,2) DEFAULT 0;
    DECLARE vat_cost DECIMAL(10,2) DEFAULT 0;
    DECLARE subtotal DECIMAL(10,2) DEFAULT 0;
    
    -- Get total area
    SELECT COALESCE(SUM(area_sqm), 0) INTO total_area
    FROM quotation_pieces qp
    JOIN quotations q ON qp.quotation_id = q.id
    WHERE q.quote_id = quote_id_param;
    
    -- Calculate costs based on cost rules
    SELECT value INTO material_cost FROM cost_rules WHERE id = 'material_base' AND is_active = TRUE;
    SELECT value INTO fabrication_cost FROM cost_rules WHERE id = 'cutting' AND is_active = TRUE;
    SELECT value INTO installation_cost FROM cost_rules WHERE id = 'installation' AND is_active = TRUE;
    
    SET material_cost = COALESCE(material_cost, 150) * total_area;
    SET fabrication_cost = COALESCE(fabrication_cost, 100) * total_area;
    SET installation_cost = COALESCE(installation_cost, 1) * total_area;
    
    -- Add sink cost if Luxone customized
    IF EXISTS (SELECT 1 FROM quotations WHERE quote_id = quote_id_param AND sink_option = 'luxone-customized') THEN
        SELECT value INTO addon_cost FROM cost_rules WHERE id = 'sink_luxone' AND is_active = TRUE;
        SET addon_cost = COALESCE(addon_cost, 500);
    END IF;
    
    -- Calculate delivery cost based on location
    SELECT 
        CASE 
            WHEN customer_location = 'Dubai' THEN 
                (SELECT value FROM cost_rules WHERE id = 'delivery_dubai' AND is_active = TRUE)
            ELSE 
                (SELECT value FROM cost_rules WHERE id = 'delivery_uae' AND is_active = TRUE)
        END INTO delivery_cost
    FROM quotations WHERE quote_id = quote_id_param;
    
    SET delivery_cost = COALESCE(delivery_cost, 500);
    
    -- Calculate subtotal
    SET subtotal = material_cost + fabrication_cost + installation_cost + addon_cost + delivery_cost;
    
    -- Add margin
    SELECT value INTO margin_cost FROM cost_rules WHERE id = 'margin' AND is_active = TRUE;
    SET margin_cost = subtotal * (COALESCE(margin_cost, 20) / 100);
    SET subtotal = subtotal + margin_cost;
    
    -- Add VAT
    SELECT value INTO vat_cost FROM cost_rules WHERE id = 'vat' AND is_active = TRUE;
    SET vat_cost = subtotal * (COALESCE(vat_cost, 5) / 100);
    
    SET total_price = subtotal + vat_cost;
END //

DELIMITER ;

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Default admin user (username: admin, password: luxone2025)
INSERT INTO admin_users (username, password_hash, email, full_name, role) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@theluxone.com', 'System Administrator', 'admin');

-- Default company settings
INSERT INTO company_settings (id) VALUES (1);

-- Default cost rules
INSERT INTO cost_rules (id, name, category, type, value, description, is_active) VALUES
('material_base', 'Base Material Cost', 'material', 'per_sqm', 150.00, 'Base price per square meter for materials', TRUE),
('cutting', 'Cutting Cost', 'fabrication', 'per_sqm', 20.00, 'Cost for cutting per square meter', TRUE),
('top_polishing', 'Top Polishing', 'fabrication', 'per_sqm', 50.00, 'Top polishing cost per square meter', TRUE),
('edge_polishing', 'Edge Polishing', 'fabrication', 'per_sqm', 30.00, 'Edge polishing cost per square meter', TRUE),
('installation', 'Installation Cost', 'installation', 'per_sqm', 140.00, 'Installation cost per square meter', TRUE),
('sink_luxone', 'Luxone Sink Cost', 'addon', 'fixed', 500.00, 'Cost for Luxone customized sink', TRUE),
('delivery_dubai', 'Dubai Delivery', 'delivery', 'fixed', 500.00, 'Delivery cost within Dubai', TRUE),
('delivery_uae', 'UAE Delivery', 'delivery', 'fixed', 800.00, 'Delivery cost to other UAE emirates', TRUE),
('margin', 'Business Margin', 'business', 'percentage', 20.00, '20% business margin', TRUE),
('vat', 'VAT', 'business', 'percentage', 5.00, '5% VAT', TRUE);

-- Default form fields for 8 steps
INSERT INTO form_fields (id, type, label, required, step_number, category, display_order, is_visible) VALUES
('service_level', 'radio', 'Scope of Work', TRUE, 1, 'Service', 1, TRUE),
('material_source', 'radio', 'Material Source', TRUE, 2, 'Material', 2, TRUE),
('worktop_layout', 'radio', 'Worktop Layout', TRUE, 3, 'Layout', 3, TRUE),
('sink_option', 'radio', 'Sink Option', TRUE, 5, 'Design', 5, TRUE),
('timeline', 'radio', 'Project Timeline', TRUE, 6, 'Timeline', 6, TRUE),
('project_type', 'select', 'Project Type & Application', TRUE, 7, 'Project', 7, TRUE),
('customer_name', 'text', 'Client Name', TRUE, 8, 'Contact', 8, TRUE),
('customer_email', 'text', 'Client Email Address', TRUE, 8, 'Contact', 9, TRUE),
('customer_phone', 'text', 'Client Contact Number', TRUE, 8, 'Contact', 10, TRUE),
('customer_location', 'select', 'Project Location', TRUE, 8, 'Contact', 11, TRUE),
('designer_name', 'text', 'Designer Name', TRUE, 8, 'Designer', 12, TRUE),
('designer_contact', 'text', 'Designer Contact Number', TRUE, 8, 'Designer', 13, TRUE),
('designer_email', 'text', 'Designer Email Address', TRUE, 8, 'Designer', 14, TRUE);

-- Default PDF template
INSERT INTO pdf_templates (id, name, header_logo, header_text, footer_text, colors, fonts, sections, layout, is_active) VALUES
('default', 'Default Template', 'https://demo.theluxone.com/wp-content/uploads/2025/06/cropped-Luxone_HQ-1.png', 'Luxone - Premium Worktop Solutions', '© 2025 Luxone - Premium Worktop Solutions | UAE | www.theluxone.com', 
'{"primary": "#3B82F6", "secondary": "#8B5CF6", "accent": "#F59E0B"}', 
'{"heading": "Arial, sans-serif", "body": "Arial, sans-serif"}', 
'{"showClientInfo": true, "showProjectSpecs": true, "showPricing": true, "showTerms": true, "customSections": []}', 
'standard', TRUE);

-- Material options
INSERT INTO material_options (type, color_name, price_per_sqm, is_available) VALUES
-- Quartz colors
('quartz', 'AMBIENCE TOUCH', 180.00, TRUE),
('quartz', 'GOLDEN TRACK', 185.00, TRUE),
('quartz', 'GREY LEATHER', 175.00, TRUE),
('quartz', 'GOLDEN RIVER', 190.00, TRUE),
('quartz', 'IMPERIAL WHITE', 170.00, TRUE),
('quartz', 'GREY WONDER', 175.00, TRUE),
('quartz', 'MOON WHITE', 165.00, TRUE),
('quartz', 'MAJESTIC WHITE', 180.00, TRUE),
('quartz', 'REBORN GREY', 175.00, TRUE),
('quartz', 'ROYAL STATUARIO', 200.00, TRUE),
-- Porcelain colors
('porcelain', 'ARCTIC WHITE', 160.00, TRUE),
('porcelain', 'CHARCOAL GREY', 165.00, TRUE),
('porcelain', 'CREAM MARBLE', 170.00, TRUE),
('porcelain', 'DARK STONE', 165.00, TRUE),
('porcelain', 'ELEGANT BLACK', 175.00, TRUE);

-- Email templates
INSERT INTO email_templates (id, name, subject, body_html, variables, is_active) VALUES
('admin_notification', 'Admin Notification', 'New Quote Request - {{quote_id}}', 
'<h2>New Quotation Request</h2><p>Quote ID: {{quote_id}}</p><p>Customer: {{customer_name}}</p><p>Email: {{customer_email}}</p>', 
'["quote_id", "customer_name", "customer_email", "total_amount"]', TRUE),
('customer_quote', 'Customer Quote', 'Your Luxone Quotation - {{quote_id}}', 
'<h2>Thank you for your quotation request</h2><p>Quote ID: {{quote_id}}</p><p>Total: {{total_amount}} AED</p>', 
'["quote_id", "customer_name", "total_amount"]', TRUE);

-- System settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('site_maintenance', 'false', 'boolean', 'Enable maintenance mode'),
('max_file_size', '3145728', 'number', 'Maximum file upload size in bytes (3MB)'),
('allowed_file_types', '["jpg", "jpeg", "png", "gif", "pdf"]', 'json', 'Allowed file upload types'),
('email_notifications', 'true', 'boolean', 'Enable email notifications'),
('backup_frequency', 'daily', 'string', 'Database backup frequency');

-- Sample quotations for testing
INSERT INTO quotations (quote_id, service_level, material_source, material_type, material_color, worktop_layout, sink_option, timeline, project_type, customer_name, customer_email, customer_phone, customer_location, designer_name, designer_contact, designer_email, total_amount, status) VALUES
('LUX-2025-01-00001', 'fabrication-delivery-installation', 'luxone', 'quartz', 'IMPERIAL WHITE', 'l-shape', 'luxone-customized', '3-6weeks', 'Kitchen - Ready for worktops now / ASAP', 'John Smith', 'john.smith@email.com', '+971501234567', 'Dubai', 'Sarah Designer', '+971509876543', 'sarah@design.com', 8500.00, 'pending'),
('LUX-2025-01-00002', 'fabrication-delivery', 'yourself', '', '', 'u-shape', 'client-provided', 'asap-2weeks', 'Kitchen - Under renovation', 'Ahmed Al-Mansouri', 'ahmed@email.com', '+971507654321', 'Abu Dhabi', 'Mike Designer', '+971508765432', 'mike@design.com', 6200.00, 'reviewed'),
('LUX-2025-01-00003', 'fabrication', 'luxone-others', '', '', '1-piece', 'luxone-customized', '6weeks-plus', 'Bathroom - Planning stage', 'Maria Garcia', 'maria@email.com', '+971506543210', 'Sharjah', 'Lisa Designer', '+971507654321', 'lisa@design.com', 4800.00, 'quoted');

-- Sample quotation pieces
INSERT INTO quotation_pieces (quotation_id, piece_label, length_mm, width_mm, thickness_mm) VALUES
(1, 'A', 2400, 600, 20),
(1, 'B', 1800, 600, 20),
(2, 'A', 3000, 650, 30),
(2, 'B', 2200, 650, 30),
(2, 'C', 1500, 400, 30),
(3, 'A', 1200, 500, 20);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_quotations_customer_name ON quotations(customer_name);
CREATE INDEX idx_quotations_designer_name ON quotations(designer_name);
CREATE INDEX idx_quotations_material_type ON quotations(material_type);
CREATE INDEX idx_quotations_location ON quotations(customer_location);
CREATE INDEX idx_cost_rules_category ON cost_rules(category);
CREATE INDEX idx_activity_logs_table_record ON activity_logs(table_name, record_id);

-- =====================================================
-- TRIGGERS FOR AUDIT LOGGING
-- =====================================================
DELIMITER //

CREATE TRIGGER quotations_audit_insert 
AFTER INSERT ON quotations
FOR EACH ROW
BEGIN
    INSERT INTO activity_logs (action, table_name, record_id, new_values, created_at)
    VALUES ('INSERT', 'quotations', NEW.id, JSON_OBJECT(
        'quote_id', NEW.quote_id,
        'customer_name', NEW.customer_name,
        'customer_email', NEW.customer_email,
        'status', NEW.status
    ), NOW());
END //

CREATE TRIGGER quotations_audit_update 
AFTER UPDATE ON quotations
FOR EACH ROW
BEGIN
    INSERT INTO activity_logs (action, table_name, record_id, old_values, new_values, created_at)
    VALUES ('UPDATE', 'quotations', NEW.id, 
        JSON_OBJECT('status', OLD.status, 'total_amount', OLD.total_amount),
        JSON_OBJECT('status', NEW.status, 'total_amount', NEW.total_amount),
        NOW());
END //

DELIMITER ;

-- =====================================================
-- FINAL SETUP
-- =====================================================

-- Create indexes for better performance
ANALYZE TABLE quotations;
ANALYZE TABLE quotation_pieces;
ANALYZE TABLE cost_rules;

-- Show database summary
SELECT 'Database created successfully!' as status;
SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'luxone_quotation_system';
SELECT COUNT(*) as sample_quotations FROM quotations;
SELECT COUNT(*) as cost_rules_count FROM cost_rules;
SELECT COUNT(*) as form_fields_count FROM form_fields;