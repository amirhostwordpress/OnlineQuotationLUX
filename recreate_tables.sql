-- Luxone Quotation System: Table Structure Only
-- This file contains only CREATE TABLE statements for all tables.

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `role` enum('admin','manager','viewer') DEFAULT 'admin',
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `company_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(100) DEFAULT 'Luxone',
  `website` varchar(100) DEFAULT 'www.theluxone.com',
  `address` text DEFAULT 'Dubai, UAE\nPremium Worktop Solutions',
  `whatsapp_india` varchar(20) DEFAULT '+919648555355',
  `whatsapp_uae` varchar(20) DEFAULT '+971585815601',
  `admin_email` varchar(100) DEFAULT 'admin@theluxone.com',
  `price_per_sqft` decimal(10,2) DEFAULT 150.00,
  `aed_to_usd_rate` decimal(10,4) DEFAULT 3.6700,
  `vat_rate` decimal(5,2) DEFAULT 5.00,
  `consultant_name` varchar(100) DEFAULT 'Ahmed Al-Rashid',
  `consultant_phone` varchar(20) DEFAULT '+971501234567',
  `consultant_email` varchar(100) DEFAULT 'ahmed@theluxone.com',
  `logo_url` varchar(255) DEFAULT 'https://theluxone.com/wp-content/uploads/2025/06/cropped-Luxone_HQ-1.png',
  `logo_file_name` varchar(255) DEFAULT NULL,
  `logo_file_path` varchar(500) DEFAULT NULL,
  `logo_file_size` int(11) DEFAULT NULL,
  `logo_mime_type` varchar(100) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `form_fields` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `field_id` varchar(50) NOT NULL,
  `field_type` enum('text','select','radio','checkbox','textarea','number','file') NOT NULL,
  `label` varchar(255) NOT NULL,
  `placeholder` varchar(255) DEFAULT NULL,
  `is_required` tinyint(1) DEFAULT 0,
  `options` json DEFAULT NULL,
  `validation_rules` json DEFAULT NULL,
  `step_number` int(11) DEFAULT 1,
  `category` varchar(50) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_visible` tinyint(1) DEFAULT 1,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `field_id` (`field_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `pdf_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `template_id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `header_logo` varchar(255) DEFAULT 'https://theluxone.com/wp-content/uploads/2025/06/cropped-Luxone_HQ-1.png',
  `header_text` varchar(255) DEFAULT 'Luxone - Premium Worktop Solutions',
  `footer_text` text DEFAULT '© 2025 Luxone - Premium Worktop Solutions | UAE | www.theluxone.com',
  `primary_color` varchar(7) DEFAULT '#3B82F6',
  `secondary_color` varchar(7) DEFAULT '#8B5CF6',
  `accent_color` varchar(7) DEFAULT '#F59E0B',
  `heading_font` varchar(100) DEFAULT 'Arial, sans-serif',
  `body_font` varchar(100) DEFAULT 'Arial, sans-serif',
  `show_client_info` tinyint(1) DEFAULT 1,
  `show_project_specs` tinyint(1) DEFAULT 1,
  `show_pricing` tinyint(1) DEFAULT 1,
  `show_terms` tinyint(1) DEFAULT 1,
  `custom_sections` json DEFAULT NULL,
  `layout_style` enum('standard','modern','minimal') DEFAULT 'standard',
  `is_active` tinyint(1) DEFAULT 1,
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `template_id` (`template_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `quotations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quote_id` varchar(50) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_email` varchar(100) DEFAULT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `customer_location` varchar(50) DEFAULT NULL,
  `service_level` varchar(50) DEFAULT NULL,
  `material_source` varchar(50) DEFAULT NULL,
  `material_type` varchar(50) DEFAULT NULL,
  `material_color` varchar(100) DEFAULT NULL,
  `worktop_layout` varchar(50) DEFAULT NULL,
  `project_type` varchar(100) DEFAULT NULL,
  `timeline` varchar(50) DEFAULT NULL,
  `sink_option` varchar(100) DEFAULT NULL,
  `additional_comments` text DEFAULT NULL,
  `quote_data` json NOT NULL,
  `pricing_data` json DEFAULT NULL,
  `total_amount` decimal(12,2) DEFAULT NULL,
  `currency` varchar(3) DEFAULT 'AED',
  `status` enum('pending','reviewed','approved','rejected','completed') DEFAULT 'pending',
  `pdf_generated` tinyint(1) DEFAULT 0,
  `pdf_path` varchar(255) DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  `follow_up_date` date DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `quote_id` (`quote_id`),
  KEY `idx_customer_email` (`customer_email`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `quotation_pieces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quotation_id` int(11) NOT NULL,
  `piece_letter` varchar(5) NOT NULL,
  `length_mm` decimal(10,2) DEFAULT NULL,
  `width_mm` decimal(10,2) DEFAULT NULL,
  `thickness_mm` decimal(10,2) DEFAULT NULL,
  `area_sqm` decimal(10,4) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `quotation_id` (`quotation_id`),
  CONSTRAINT `quotation_pieces_ibfk_1` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `quotation_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quotation_id` int(11) NOT NULL,
  `file_type` enum('slab_photo','plan_sketch','pdf_quote','other') NOT NULL,
  `original_filename` varchar(255) NOT NULL,
  `stored_filename` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` int(11) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `uploaded_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `quotation_id` (`quotation_id`),
  CONSTRAINT `quotation_files_ibfk_1` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `material_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` enum('quartz','porcelain','other') NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `color_code` varchar(50) DEFAULT NULL,
  `price_per_sqft` decimal(10,2) DEFAULT NULL,
  `slab_size` varchar(50) DEFAULT NULL,
  `thickness_options` json DEFAULT NULL,
  `finish_options` json DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `image_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_available` (`is_available`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sink_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `model_number` varchar(50) DEFAULT NULL,
  `material` varchar(50) DEFAULT NULL,
  `bowl_configuration` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `dimensions` varchar(100) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `image_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_available` (`is_available`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `pricing_rules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rule_name` varchar(100) NOT NULL,
  `rule_type` enum('base','addon','multiplier','fixed') NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `condition_field` varchar(50) DEFAULT NULL,
  `condition_value` varchar(100) DEFAULT NULL,
  `price_value` decimal(10,2) NOT NULL,
  `unit` varchar(20) DEFAULT 'AED',
  `is_active` tinyint(1) DEFAULT 1,
  `description` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_rule_type` (`rule_type`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `table_name` varchar(50) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `email_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `template_name` varchar(100) NOT NULL,
  `template_type` enum('quote_confirmation','admin_notification','follow_up','reminder') NOT NULL,
  `subject` varchar(255) NOT NULL,
  `body_html` text NOT NULL,
  `body_text` text DEFAULT NULL,
  `variables` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_template_type` (`template_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `system_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `setting_type` enum('string','number','boolean','json') DEFAULT 'string',
  `description` text DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 