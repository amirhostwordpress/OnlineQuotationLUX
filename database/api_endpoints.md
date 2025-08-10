# API Endpoints Documentation

## 🔗 Suggested API Structure for PHP Backend

When you're ready to create a PHP backend, here are the recommended API endpoints that work with this database structure:

## 🔐 Authentication Endpoints

```php
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
```

## 📋 Quotation Management

```php
// Public endpoints (for quotation form)
POST /api/quotes                    // Submit new quote
GET  /api/quotes/{quote_id}         // Get quote details
POST /api/quotes/{quote_id}/files   // Upload files

// Admin endpoints
GET    /api/admin/quotes            // List all quotes
GET    /api/admin/quotes/{id}       // Get quote details
PUT    /api/admin/quotes/{id}       // Update quote
DELETE /api/admin/quotes/{id}       // Delete quote
PUT    /api/admin/quotes/{id}/status // Update status
POST   /api/admin/quotes/{id}/pdf   // Generate PDF
```

## ⚙️ Settings Management

```php
GET  /api/admin/settings/company    // Get company settings
PUT  /api/admin/settings/company    // Update company settings
GET  /api/admin/settings/pricing    // Get pricing rules
PUT  /api/admin/settings/pricing    // Update pricing rules
```

## 📝 Form Fields Management

```php
GET    /api/admin/form-fields       // List all form fields
POST   /api/admin/form-fields       // Create new field
PUT    /api/admin/form-fields/{id}  // Update field
DELETE /api/admin/form-fields/{id}  // Delete field
PUT    /api/admin/form-fields/order // Reorder fields
```

## 🎨 PDF Templates

```php
GET    /api/admin/pdf-templates     // List templates
POST   /api/admin/pdf-templates     // Create template
PUT    /api/admin/pdf-templates/{id} // Update template
DELETE /api/admin/pdf-templates/{id} // Delete template
PUT    /api/admin/pdf-templates/{id}/activate // Set as active
```

## 🏗️ Materials & Options

```php
GET    /api/materials               // Get all materials
GET    /api/materials/quartz        // Get quartz options
GET    /api/materials/porcelain     // Get porcelain options
POST   /api/admin/materials         // Add material
PUT    /api/admin/materials/{id}    // Update material
DELETE /api/admin/materials/{id}    // Delete material

GET    /api/sinks                   // Get all sink options
POST   /api/admin/sinks             // Add sink option
PUT    /api/admin/sinks/{id}        // Update sink
DELETE /api/admin/sinks/{id}        // Delete sink
```

## 📊 Analytics & Reports

```php
GET /api/admin/analytics/dashboard  // Dashboard stats
GET /api/admin/analytics/monthly    // Monthly statistics
GET /api/admin/analytics/quotes     // Quote analytics
GET /api/admin/reports/export       // Export data
```

## 📁 File Management

```php
POST   /api/files/upload            // Upload file
GET    /api/files/{id}              // Download file
DELETE /api/admin/files/{id}        // Delete file
```

## 🔍 Search & Filters

```php
GET /api/admin/quotes?search=john&status=pending&date_from=2025-01-01
GET /api/admin/quotes?location=Dubai&material=quartz
GET /api/admin/quotes?sort=created_at&order=desc&page=1&limit=20
```

## 📧 Email & Notifications

```php
POST /api/admin/emails/send         // Send custom email
GET  /api/admin/email-templates     // List email templates
PUT  /api/admin/email-templates/{id} // Update template
POST /api/admin/notifications       // Send notification
```

## 💰 Pricing Calculator

```php
POST /api/calculate-price           // Calculate quote price
GET  /api/pricing-rules             // Get pricing rules
POST /api/admin/pricing/test        // Test pricing calculation
```

## 📱 Mobile API (Future)

```php
GET  /api/mobile/quotes/{user_id}   // User's quotes
POST /api/mobile/quotes/quick       // Quick quote
GET  /api/mobile/materials/gallery  // Material gallery
```

## 🔧 System Management

```php
GET  /api/admin/system/status       // System health
GET  /api/admin/system/logs         // Activity logs
POST /api/admin/system/backup       // Create backup
GET  /api/admin/system/settings     // System settings
```

## 📋 Sample PHP Implementation

```php
<?php
// Example: Get all quotes with filters
class QuoteController {
    public function index(Request $request) {
        $query = "SELECT * FROM quotation_summary WHERE 1=1";
        $params = [];
        
        if ($request->get('search')) {
            $query .= " AND (customer_name LIKE ? OR customer_email LIKE ?)";
            $search = '%' . $request->get('search') . '%';
            $params[] = $search;
            $params[] = $search;
        }
        
        if ($request->get('status')) {
            $query .= " AND status = ?";
            $params[] = $request->get('status');
        }
        
        if ($request->get('location')) {
            $query .= " AND customer_location = ?";
            $params[] = $request->get('location');
        }
        
        $query .= " ORDER BY created_at DESC";
        
        // Add pagination
        $page = $request->get('page', 1);
        $limit = $request->get('limit', 20);
        $offset = ($page - 1) * $limit;
        $query .= " LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        
        $quotes = $this->db->query($query, $params);
        
        return response()->json([
            'data' => $quotes,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $this->getTotalCount($request)
            ]
        ]);
    }
}
```

## 🔒 Security Considerations

```php
// JWT Authentication
$token = JWT::encode($payload, $secret_key, 'HS256');

// Input validation
$validator = new Validator($request->all(), [
    'customer_name' => 'required|string|max:100',
    'customer_email' => 'required|email|max:100',
    'customer_phone' => 'required|string|max:20',
    'quote_data' => 'required|json'
]);

// SQL injection prevention
$stmt = $pdo->prepare("SELECT * FROM quotations WHERE id = ?");
$stmt->execute([$quote_id]);

// File upload security
$allowed_types = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];
$max_size = 3 * 1024 * 1024; // 3MB
```

## 📊 Response Format

```json
{
    "success": true,
    "data": {
        "id": 1,
        "quote_id": "LUX-2025-01-ABC12",
        "customer_name": "John Smith",
        "total_amount": 8500.00,
        "status": "pending"
    },
    "message": "Quote retrieved successfully",
    "timestamp": "2025-01-20T10:30:00Z"
}
```

## 🚀 Getting Started

1. **Set up PHP backend** with your preferred framework (Laravel, CodeIgniter, etc.)
2. **Configure database connection** to the imported MySQL database
3. **Implement authentication** using the `admin_users` table
4. **Create API routes** following the structure above
5. **Add validation and security** measures
6. **Test with the sample data** provided in the database

This API structure will provide a complete backend solution for your Luxone quotation system!