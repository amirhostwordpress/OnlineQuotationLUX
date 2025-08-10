# 🏗️ **Luxone Quotation System - Comprehensive Guide**

## 📋 **System Overview**

This system implements a **multi-tier authentication system** with **complete data isolation** between different admin accounts. Each admin can only access their own company data and quotations.

---

## 🔐 **Authentication System**

### **Login URLs & User Types**

| User Type | Login URL | Access Level | Default Credentials |
|-----------|-----------|--------------|-------------------|
| **Super Admin** | `/super-admin-login` | Full system access | `superadmin@theluxone.com` / `superadmin123` |
| **Admin** | `/admin-login` | Company-specific access | `admin@theluxone.com` / `admin123` |
| **Regular User** | `/user-login` | Personal quotations only | Create via Super Admin |

### **Role-Based Permissions**

#### **Super Admin Permissions**
- ✅ Manage all users (create, edit, delete)
- ✅ Manage all admins (promote/demote)
- ✅ View all quotations across all companies
- ✅ Access all company settings
- ✅ View system analytics
- ✅ Change any user passwords
- ✅ Access super admin panel

#### **Admin Permissions**
- ❌ Cannot manage users
- ❌ Cannot manage other admins
- ✅ View/edit their own quotations only
- ✅ Manage their company settings
- ✅ View their analytics
- ❌ Cannot change passwords
- ❌ Cannot access super admin

#### **Regular User Permissions**
- ❌ No admin access
- ✅ View their own quotations only
- ❌ Cannot access company settings
- ❌ Cannot view analytics

---

## 🗄️ **Database Architecture**

### **Core Tables**

#### **1. Users Table**
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin', 'super_admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    permissions JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### **2. Company Settings Table**
```sql
CREATE TABLE company_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_user_id INT NOT NULL,  -- Links to specific admin
    company_name VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    address TEXT,
    logo_url VARCHAR(500),
    whatsapp_india VARCHAR(50),
    whatsapp_uae VARCHAR(50),
    admin_email VARCHAR(255),
    form_fields JSON,
    pdf_templates JSON,
    active_pdf_template VARCHAR(255),
    pricing_rules JSON,
    FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_admin_settings (admin_user_id)
);
```

#### **3. Quotations Table**
```sql
CREATE TABLE quotations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quote_id VARCHAR(255) UNIQUE,
    admin_user_id INT NOT NULL,  -- Which admin owns this quote
    user_id INT NULL,            -- Regular user who submitted (optional)
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    -- ... other fields
    FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

---

## 🔒 **Data Isolation Implementation**

### **1. Database-Level Isolation**
- **Foreign Key Constraints**: All data is linked to specific admin users
- **Unique Constraints**: Each admin can only have one company settings record
- **Cascade Deletes**: When an admin is deleted, all their data is removed

### **2. API-Level Isolation**
- **JWT Authentication**: Each request includes user role and ID
- **Query Filtering**: APIs automatically filter data based on user role
- **Access Control**: Super admin sees all, admins see only their data

### **3. Frontend-Level Isolation**
- **Route Protection**: Different login URLs for different user types
- **Component Access**: UI components show/hide based on user permissions
- **Data Filtering**: Frontend only displays authorized data

---

## 🛠️ **Troubleshooting Guide**

### **Issue 1: Company Details Not Saving**

**Problem**: Company settings are not being saved to the database.

**Root Causes & Solutions**:

1. **Missing admin_user_id in requests**
   ```javascript
   // ❌ Wrong - No admin association
   {
     "company_name": "My Company",
     "website": "example.com"
   }
   
   // ✅ Correct - Includes admin association
   {
     "admin_user_id": 2,
     "company_name": "My Company", 
     "website": "example.com"
   }
   ```

2. **Authentication token missing**
   ```javascript
   // ❌ Wrong - No authorization header
   fetch('/api/company-settings', {
     method: 'PUT',
     body: JSON.stringify(data)
   });
   
   // ✅ Correct - Includes authorization
   fetch('/api/company-settings', {
     method: 'PUT',
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify(data)
   });
   ```

3. **Database connection issues**
   ```bash
   # Check if backend is running
   curl http://localhost:5000/health
   
   # Check database connection
   curl http://localhost:5000/api/users/db-test
   ```

### **Issue 2: Users Can't Access Their Data**

**Problem**: Users are seeing data from other admins.

**Solutions**:

1. **Verify JWT token includes role**
   ```javascript
   // Token should include role
   {
     "userId": 2,
     "email": "admin@example.com",
     "role": "admin"  // This is crucial
   }
   ```

2. **Check API query filtering**
   ```sql
   -- For admin users
   SELECT * FROM quotations WHERE admin_user_id = ?
   
   -- For super admin
   SELECT * FROM quotations  -- No filter needed
   ```

### **Issue 3: Login Not Working**

**Problem**: Users can't log in to the system.

**Solutions**:

1. **Check user exists in database**
   ```sql
   SELECT email, role, is_active FROM users WHERE email = 'admin@example.com';
   ```

2. **Verify password hash**
   ```javascript
   // Password should be hashed with bcrypt
   const hash = await bcrypt.hash('admin123', 10);
   ```

3. **Check login endpoint**
   ```bash
   # Test admin login
   curl -X POST http://localhost:5000/api/users/admin-login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@theluxone.com","password":"admin123"}'
   ```

---

## 🚀 **Setup Instructions**

### **1. Database Setup**
```bash
# Run the essential tables script
cd luxonebackendrepo
node create-essential-tables.js
```

### **2. Backend Setup**
```bash
# Install dependencies
npm install

# Start the server
npm run dev
```

### **3. Frontend Setup**
```bash
# In the main directory
npm install
npm run dev
```

### **4. Test the System**
```bash
# Test API endpoints
curl http://localhost:5000/api/users
curl http://localhost:5000/api/company-settings/test
```

---

## 📊 **API Endpoints Reference**

### **Authentication Endpoints**
- `POST /api/users/login` - Regular user login
- `POST /api/users/admin-login` - Admin login  
- `POST /api/users/super-admin-login` - Super admin login

### **Company Settings Endpoints**
- `GET /api/company-settings` - Get current admin's settings
- `PUT /api/company-settings` - Update current admin's settings
- `GET /api/company-settings/all` - Get all settings (super admin only)

### **Quotations Endpoints**
- `GET /api/quotations` - Get quotations (filtered by role)
- `POST /api/quotations` - Create new quotation
- `PUT /api/quotations/:id` - Update quotation
- `DELETE /api/quotations/:id` - Delete quotation

### **User Management Endpoints**
- `GET /api/users` - List users (super admin only)
- `POST /api/users` - Create user (super admin only)
- `PUT /api/users/:id` - Update user (super admin only)
- `DELETE /api/users/:id` - Delete user (super admin only)

---

## 🔍 **Security Measures**

### **1. Data Isolation**
- **Database Constraints**: Foreign keys prevent cross-admin access
- **API Filtering**: All queries include user role checks
- **Frontend Protection**: Routes and components respect user permissions

### **2. Authentication**
- **JWT Tokens**: Secure token-based authentication
- **Role-Based Access**: Different endpoints for different user types
- **Password Hashing**: Bcrypt encryption for all passwords

### **3. Audit Trail**
- **Activity Logs**: All actions are logged with user context
- **Database Triggers**: Automatic logging of data changes
- **Access Tracking**: Last login times and user activity

---

## 📝 **Default Credentials**

| User Type | Email | Password | Role |
|-----------|-------|----------|------|
| Super Admin | `superadmin@theluxone.com` | `superadmin123` | `super_admin` |
| Admin | `admin@theluxone.com` | `admin123` | `admin` |

---

## 🎯 **Key Features Implemented**

✅ **Separate login URLs** for different user types  
✅ **Complete data isolation** between admin accounts  
✅ **Role-based permissions** with granular control  
✅ **Company settings** that save per admin  
✅ **Audit trail** for all system activities  
✅ **Secure authentication** with JWT tokens  
✅ **Database constraints** preventing data leakage  
✅ **API-level filtering** based on user roles  
✅ **Frontend route protection** and component access control  

---

## 🆘 **Support & Troubleshooting**

If you encounter issues:

1. **Check the browser console** for JavaScript errors
2. **Check the backend logs** for API errors  
3. **Verify database connectivity** with the test endpoints
4. **Ensure all tables exist** by running the setup script
5. **Test with default credentials** to verify basic functionality

For additional help, check the individual component files and API route implementations.
