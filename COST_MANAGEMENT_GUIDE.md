# Cost Management System Guide

## Overview

The Cost Management system allows admins to organize and manage costs for different aspects of their business. This includes material costs, labor costs, overhead costs, transport costs, and custom costs. The system provides a hierarchical structure with categories and individual cost fields.

## Features

### 🏷️ **Cost Categories**
- **Category Management**: Create, edit, and delete cost categories
- **Description**: Add detailed descriptions for each category
- **Field Count**: Track number of cost fields in each category
- **Total Cost**: Automatic calculation of total costs per category

### 💰 **Cost Fields**
- **Field Types**: Material, Labor, Overhead, Transport, Custom
- **Base Costs**: Set individual cost amounts
- **Units**: Flexible unit system (per sq ft, per hour, fixed, etc.)
- **Descriptions**: Detailed descriptions for each cost field
- **Active/Inactive**: Toggle field status

### 📊 **Cost Tracking**
- **Real-time Calculations**: Automatic total cost calculations
- **Category Summaries**: Overview of costs by category
- **Field Statistics**: Detailed breakdown by field type
- **Cost Analysis**: Comprehensive cost reporting

## Database Structure

### Cost Categories Table
```sql
CREATE TABLE cost_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category_name (category_name),
  INDEX idx_created_at (created_at)
);
```

### Cost Fields Table
```sql
CREATE TABLE cost_fields (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  field_name VARCHAR(255) NOT NULL,
  field_type ENUM('material', 'labor', 'overhead', 'transport', 'custom') NOT NULL,
  base_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  unit VARCHAR(50) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES cost_categories(id) ON DELETE CASCADE,
  INDEX idx_category_id (category_id),
  INDEX idx_field_type (field_type),
  INDEX idx_is_active (is_active),
  INDEX idx_field_name (field_name)
);
```

## API Endpoints

### Cost Categories

#### Get All Categories
```
GET /api/cost_management/categories
```
- **Access**: Authenticated users
- **Response**: Array of categories with fields and totals

#### Create Category
```
POST /api/cost_management/categories
```
- **Access**: Authenticated users
- **Body**: `{ category_name, description }`
- **Response**: Created category

#### Update Category
```
PUT /api/cost_management/categories/:id
```
- **Access**: Authenticated users
- **Body**: `{ category_name, description }`
- **Response**: Success message

#### Delete Category
```
DELETE /api/cost_management/categories/:id
```
- **Access**: Authenticated users
- **Response**: Success message

### Cost Fields

#### Get All Fields
```
GET /api/cost_management/fields
```
- **Access**: Authenticated users
- **Response**: Array of all cost fields

#### Get Category Fields
```
GET /api/cost_management/categories/:id/fields
```
- **Access**: Authenticated users
- **Response**: Array of fields for specific category

#### Add Field to Category
```
POST /api/cost_management/categories/:id/fields
```
- **Access**: Authenticated users
- **Body**: `{ field_name, field_type, base_cost, unit, description }`
- **Response**: Created field

#### Update Field
```
PUT /api/cost_management/fields/:id
```
- **Access**: Authenticated users
- **Body**: `{ field_name, field_type, base_cost, unit, description, is_active }`
- **Response**: Success message

#### Delete Field
```
DELETE /api/cost_management/fields/:id
```
- **Access**: Authenticated users
- **Response**: Success message

### Statistics

#### Get Cost Statistics
```
GET /api/cost_management/statistics
```
- **Access**: Authenticated users
- **Response**: Overall cost statistics

#### Get Category Total
```
GET /api/cost_management/categories/:id/total
```
- **Access**: Authenticated users
- **Response**: Total cost for specific category

## Frontend Components

### CostManagement Component

Located at: `src/components/admin/CostManagement.tsx`

**Features:**
- View all cost categories and fields
- Add new cost categories
- Add cost fields to categories
- Edit existing categories and fields
- Delete categories and fields
- Real-time cost calculations
- Field type filtering
- Active/inactive status management

**Usage:**
```tsx
import CostManagement from './components/admin/CostManagement';

// In your admin panel
<CostManagement />
```

### Service Layer

Located at: `src/services/costManagementService.ts`

**Available Functions:**
- `fetchCostCategories()`: Get all categories
- `createCostCategory()`: Create new category
- `updateCostCategory()`: Update category
- `deleteCostCategory()`: Delete category
- `addCostField()`: Add field to category
- `updateCostField()`: Update field
- `deleteCostField()`: Delete field
- `getCostStatistics()`: Get overall statistics
- `calculateTotalCost()`: Calculate total for fields

## Setup Instructions

### 1. Database Migration

Run the migration script to create the tables:

```bash
cd luxonebackendrepo
node create-cost-management-tables.js
```

### 2. Backend Setup

The backend routes are already set up in:
- `luxonebackendrepo/src/routes/cost_management.ts`
- Added to main routes in `luxonebackendrepo/src/routes/index.ts`

### 3. Frontend Setup

The frontend components are ready to use:
- `src/components/admin/CostManagement.tsx`
- `src/services/costManagementService.ts`

### 4. Access Control

Ensure proper authentication:
- Cost management is available in the admin panel
- All endpoints require authentication
- JWT token validation is enforced

## Usage Examples

### Adding a New Cost Category

1. Navigate to the Cost Management page
2. Click "Add Category" button
3. Fill in the required fields:
   - Category Name (required)
   - Description (optional)
4. Click "Add Category"

### Adding Cost Fields

1. Find the category you want to add fields to
2. Click "Add Field" button
3. Fill in the required fields:
   - Field Name (required)
   - Field Type (required): Material, Labor, Overhead, Transport, or Custom
   - Base Cost (required): Numeric value
   - Unit (required): Select from available units
   - Description (optional)
4. Click "Add Field"

### Editing Costs

1. Find the category or field you want to edit
2. Click "Edit" button
3. Modify the desired fields
4. Click "Save" to update

### Managing Field Status

1. Edit a cost field
2. Toggle the "Active" status
3. Save changes to enable/disable the field

## Field Types

### Material Costs
- Raw materials and supplies
- Examples: Quartz, Granite, Marble, Edge Banding

### Labor Costs
- Workforce and skilled labor
- Examples: Fabrication Labor, Installation Labor, Cutting Services

### Overhead Costs
- General business overhead
- Examples: Shop Rent, Equipment Maintenance, Utilities

### Transport Costs
- Transportation and delivery
- Examples: Local Delivery, Long Distance Delivery, Fuel Surcharge

### Custom Costs
- Specialized or custom services
- Examples: Sink Cutout, Faucet Installation, Sealing Service

## Available Units

- **per sq ft**: Per square foot
- **per sq meter**: Per square meter
- **per piece**: Per individual piece
- **per hour**: Per hour of work
- **per day**: Per day of work
- **per kg**: Per kilogram
- **per liter**: Per liter
- **per unit**: Per unit
- **fixed**: Fixed amount
- **percentage**: Percentage-based

## Data Validation

### Required Fields
- Category Name
- Field Name
- Field Type
- Base Cost
- Unit

### Validation Rules
- Category name must not be empty
- Field name must not be empty
- Field type must be one of the predefined types
- Base cost must be a non-negative number
- Unit must be selected from available options

### Optional Fields
- Category Description
- Field Description
- Field Active Status (defaults to true)

## Error Handling

The system includes comprehensive error handling:

### Frontend Errors
- Form validation errors
- API request failures
- Network errors
- User-friendly error messages

### Backend Errors
- Database connection errors
- Validation errors
- Foreign key constraint errors
- Detailed error logging

## Security Features

### Authentication
- JWT token-based authentication
- All endpoints require valid tokens
- Session management

### Authorization
- Role-based access control
- Admin-only access to cost management
- API endpoint protection

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Data integrity constraints

## Sample Data

The system comes with pre-loaded sample data:

### Sample Categories
- Material Costs
- Labor Costs
- Overhead Costs
- Transport Costs
- Installation Costs

### Sample Fields
- Quartz Material: $45.00 per sq ft
- Granite Material: $35.00 per sq ft
- Fabrication Labor: $25.00 per hour
- Installation Labor: $30.00 per hour
- Shop Rent: $2000.00 per month
- Local Delivery: $50.00 per delivery
- Sink Cutout: $75.00 per cutout

## Integration Points

### Quotation System
- Cost fields can be referenced in quotations
- Automatic cost calculations
- Material cost integration
- Labor cost tracking

### Reporting System
- Cost analysis reports
- Category-wise summaries
- Field type breakdowns
- Cost trend analysis

### Admin Panel
- Centralized cost management
- User-friendly interface
- Real-time updates
- Bulk operations

## Troubleshooting

### Common Issues

1. **Category Not Saving**
   - Check that category name is provided
   - Verify database connection
   - Check authentication token

2. **Field Not Adding**
   - Ensure all required fields are filled
   - Verify field type is selected
   - Check base cost is numeric

3. **Cost Calculations Wrong**
   - Verify field is active
   - Check base cost values
   - Ensure proper unit selection

4. **API Errors**
   - Check authentication headers
   - Verify endpoint URLs
   - Check request body format

### Debug Tools

1. **Browser Console**: Check for JavaScript errors
2. **Network Tab**: Monitor API requests
3. **Server Logs**: Check backend error messages
4. **Database Queries**: Verify data integrity

## Future Enhancements

### Planned Features
- Bulk import/export of costs
- Cost templates
- Cost history tracking
- Advanced filtering and search
- Cost comparison tools
- Budget management
- Cost forecasting

### Integration Plans
- Advanced quotation integration
- Automated cost updates
- Multi-currency support
- Cost optimization suggestions
- Vendor management
- Purchase order integration

## Support

For technical support or questions about the Cost Management system:

1. Check the console logs for error details
2. Verify database connectivity
3. Test API endpoints manually
4. Review authentication and authorization
5. Check network connectivity
6. Consult the troubleshooting guide

## Version History

### v1.0.0 (Current)
- Initial release of Cost Management system
- Basic CRUD operations for categories and fields
- Five field types: Material, Labor, Overhead, Transport, Custom
- Real-time cost calculations
- Sample data included
- Service layer implementation
- Frontend component with validation
- Comprehensive API endpoints
- Database migration script
