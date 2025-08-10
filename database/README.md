# Luxone Quotation System Database

## 📋 Overview
Complete SQL database structure for the Luxone Quotation System. This database is designed to work seamlessly with phpMyAdmin and localhost MySQL installations.

## 🚀 Quick Setup

### 1. Import Database
1. Open **phpMyAdmin** in your browser (`http://localhost/phpmyadmin`)
2. Click **"Import"** tab
3. Choose the `luxone_quotation_system.sql` file
4. Click **"Go"** to import

### 2. Database Created
- **Database Name**: `luxone_quotation_system`
- **Character Set**: `utf8mb4_unicode_ci`
- **Tables**: 15 core tables + views and procedures

## 📊 Database Structure

### Core Tables

#### 1. **admin_users**
- Admin user management
- Default login: `admin` / `luxone2025`
- Role-based access control

#### 2. **company_settings**
- Company information
- Contact details
- Pricing configuration
- WhatsApp numbers

#### 3. **quotations**
- Main quote records
- Customer information
- Quote status tracking
- JSON data storage

#### 4. **quotation_pieces**
- Worktop piece dimensions
- Area calculations
- Linked to main quotes

#### 5. **form_fields**
- Dynamic form configuration
- Field types and validation
- Step-by-step organization

#### 6. **pdf_templates**
- PDF template management
- Color schemes
- Layout options

#### 7. **material_options**
- Quartz and porcelain options
- Pricing per material
- Availability status

#### 8. **sink_options**
- Sink categories and models
- Pricing information
- Bowl configurations

#### 9. **pricing_rules**
- Dynamic pricing logic
- Addon calculations
- Business rules

#### 10. **quotation_files**
- File upload management
- Slab photos and plans
- PDF storage

### Additional Tables
- `activity_logs` - Audit trail
- `email_templates` - Email automation
- `system_settings` - Configuration
- `quotation_summary` (View) - Quick overview
- `monthly_stats` (View) - Analytics

## 🔧 Features

### ✅ **Complete Data Management**
- Customer quotes and details
- Material and sink options
- Pricing calculations
- File uploads
- Admin settings

### ✅ **Dynamic Configuration**
- Form fields can be added/modified
- PDF templates customizable
- Pricing rules adjustable
- Material options manageable

### ✅ **Security & Audit**
- User authentication
- Activity logging
- Data validation
- Secure file storage

### ✅ **Analytics & Reporting**
- Quote statistics
- Monthly summaries
- Customer insights
- Performance metrics

## 📈 Sample Data Included

The database comes with:
- **3 sample quotations** with different configurations
- **Default form fields** for all 9 steps
- **Material options** (Quartz & Porcelain)
- **Sink options** (Stainless Steel & Corian)
- **Pricing rules** for calculations
- **PDF template** (default)
- **Admin user** (admin/luxone2025)

## 🔍 Key Views

### quotation_summary
```sql
SELECT * FROM quotation_summary;
```
Quick overview of all quotes with piece counts and total areas.

### monthly_stats
```sql
SELECT * FROM monthly_stats;
```
Monthly statistics for quotes and revenue.

## 🛠 Stored Procedures

### GenerateQuoteId()
```sql
CALL GenerateQuoteId(@new_id);
SELECT @new_id;
```
Generates unique quote IDs with format: LUX-YYYY-MM-XXXXX

### CalculateQuotePricing()
```sql
CALL CalculateQuotePricing('LUX-2025-01-ABC12', @total);
SELECT @total;
```
Calculates total pricing for a quote including all addons.

## 📱 Integration Ready

This database structure is designed to integrate with:
- **React Frontend** (current system)
- **PHP Backend** (for production)
- **REST APIs** (for mobile apps)
- **Reporting Tools** (for analytics)

## 🔐 Security Features

- Password hashing for admin users
- SQL injection prevention
- File upload validation
- Activity logging
- Role-based permissions

## 📊 Analytics Capabilities

- Quote conversion tracking
- Revenue analysis
- Customer behavior insights
- Material popularity
- Geographic distribution

## 🚀 Production Ready

- Optimized indexes for performance
- Foreign key constraints
- Data validation triggers
- Backup-friendly structure
- Scalable design

## 📞 Support

For database questions or customizations:
- Review the table structures
- Check the sample data
- Examine the stored procedures
- Test with the provided sample records

---

**🎯 Ready to use with phpMyAdmin!**
Simply import the SQL file and start managing your quotation system with a complete database backend.