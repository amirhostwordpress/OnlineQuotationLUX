# Admin Company Settings System Guide

## Overview

The Admin Company Settings system allows super admins to manage company details for all admin users in the system. This includes company information, contact details, and commission rates.

## Features

### 🔧 **Company Information Management**
- **Company Name**: The official name of the company
- **Manager Name**: The primary manager/owner of the company
- **Sales Contact Name**: The main sales contact person
- **Mobile Number**: Primary contact phone number
- **Email**: Primary contact email address
- **Address**: Complete company address
- **Website**: Company website URL (optional)
- **Logo URL**: Company logo image URL (optional)

### 💰 **Commission Management**
- **Margin Rate**: Commission percentage for quotations (0-100%)

### 👥 **User Management**
- **Admin User Association**: Each company setting is linked to a specific admin user
- **Role-Based Access**: Only super admins can manage all company settings
- **Individual Access**: Regular admins can only view/edit their own settings

## Database Structure

### Company Settings Table
```sql
CREATE TABLE company_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_user_id INT NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  manager_name VARCHAR(255) NOT NULL,
  sales_contact_name VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  margin_rate DECIMAL(5,2) DEFAULT 0.00,
  email VARCHAR(255) NOT NULL,
  website VARCHAR(500),
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_admin_settings (admin_user_id),
  INDEX idx_admin_user (admin_user_id),
  INDEX idx_company_name (company_name)
);
```

## API Endpoints

### Super Admin Endpoints

#### Get All Company Settings
```
GET /api/company_settings/all
```
- **Access**: Super admin only
- **Response**: Array of all company settings with admin user details

#### Update Specific Admin's Settings
```
PUT /api/company_settings/:adminId
```
- **Access**: Super admin only
- **Body**: Company settings object
- **Response**: Success message

### Admin Endpoints

#### Get Current Admin's Settings
```
GET /api/company_settings
```
- **Access**: Authenticated admin
- **Response**: Current admin's company settings

#### Create New Settings
```
POST /api/company_settings
```
- **Access**: Authenticated admin
- **Body**: Company settings object
- **Response**: Success message

#### Update Current Admin's Settings
```
PUT /api/company_settings
```
- **Access**: Authenticated admin
- **Body**: Company settings object
- **Response**: Success message

#### Get Specific Admin's Settings
```
GET /api/company_settings/:adminId
```
- **Access**: Super admin or the admin themselves
- **Response**: Specific admin's company settings

## Frontend Components

### AdminCompanySettings Component

Located at: `src/components/admin/AdminCompanySettings.tsx`

**Features:**
- View all admin company settings (super admin only)
- Add new company settings
- Edit existing company settings
- Real-time validation
- Success/error messaging
- Responsive design

**Usage:**
```tsx
import AdminCompanySettings from './components/admin/AdminCompanySettings';

// In your admin panel
<AdminCompanySettings />
```

### Service Layer

Located at: `src/services/adminCompanySettingsService.ts`

**Available Functions:**
- `fetchAllAdminCompanySettings()`: Get all settings (super admin)
- `fetchCompanySettings()`: Get current admin's settings
- `createCompanySettings()`: Create new settings
- `updateCompanySettings()`: Update current admin's settings
- `updateAdminCompanySettings()`: Update specific admin's settings (super admin)
- `fetchAdminCompanySettings()`: Get specific admin's settings

## Setup Instructions

### 1. Database Migration

Run the migration script to update the database:

```bash
cd luxonebackendrepo
node update-company-settings-table.js
```

### 2. Backend Setup

The backend routes are already updated in:
- `luxonebackendrepo/src/routes/company_settings.ts`

### 3. Frontend Setup

The frontend components are ready to use:
- `src/components/admin/AdminCompanySettings.tsx`
- `src/services/adminCompanySettingsService.ts`

### 4. Access Control

Ensure proper authentication:
- Super admins can access `/super-admin` route
- Regular admins can access `/admin` route
- Company settings are available in the admin panel

## Usage Examples

### Adding New Company Settings

1. Navigate to the Admin Company Settings page
2. Click "Add New" button
3. Fill in the required fields:
   - Company Name
   - Manager Name
   - Sales Contact Name
   - Mobile Number
   - Email
   - Margin Rate
   - Address
4. Optionally add Website and Logo URL
5. Click "Add Settings"

### Editing Existing Settings

1. Find the admin's company settings in the list
2. Click "Edit" button
3. Modify the desired fields
4. Click "Save" to update

### Viewing Settings

Settings are displayed in a clean, organized format showing:
- Admin name and role
- Company information
- Contact details
- Commission rate
- Address and website

## Data Validation

### Required Fields
- Company Name
- Manager Name
- Sales Contact Name
- Mobile Number
- Email
- Address
- Margin Rate

### Optional Fields
- Website
- Logo URL

### Validation Rules
- Email must be valid format
- Mobile number should include country code
- Margin rate must be between 0-100%
- Website and logo URLs must be valid URLs

## Error Handling

The system includes comprehensive error handling:

### Frontend Errors
- Form validation errors
- API request failures
- Authentication errors
- Network errors

### Backend Errors
- Database connection errors
- Validation errors
- Authorization errors
- Data integrity errors

## Security Features

### Authentication
- JWT token-based authentication
- Role-based access control
- Session management

### Authorization
- Super admin can manage all settings
- Regular admins can only manage their own settings
- API endpoints are protected by middleware

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

## Troubleshooting

### Common Issues

1. **400 Bad Request Error**
   - Check that all required fields are filled
   - Verify data types (especially margin_rate as number)
   - Ensure user is authenticated as super admin

2. **403 Forbidden Error**
   - Verify user has super admin role
   - Check JWT token is valid
   - Ensure proper authentication headers

3. **500 Internal Server Error**
   - Check database connection
   - Verify table structure
   - Check server logs for details

### Debug Tools

The system includes built-in debugging:

1. **Test API Button**: Test authentication and data handling
2. **Console Logs**: Detailed logging for troubleshooting
3. **Error Messages**: User-friendly error messages
4. **Network Tab**: Monitor API requests and responses

## Future Enhancements

### Planned Features
- Bulk import/export of company settings
- Advanced filtering and search
- Company settings templates
- Audit trail for changes
- Email notifications for updates
- File upload for company logos

### Integration Points
- Quotation system integration
- Email template system
- PDF generation system
- Analytics and reporting
- User management system

## Support

For technical support or questions about the Admin Company Settings system:

1. Check the console logs for error details
2. Verify database connectivity
3. Test API endpoints manually
4. Review authentication and authorization
5. Check network connectivity

## Version History

### v1.0.0 (Current)
- Initial release of Admin Company Settings system
- Basic CRUD operations
- Super admin management interface
- Database migration script
- Service layer implementation
- Frontend component with validation
