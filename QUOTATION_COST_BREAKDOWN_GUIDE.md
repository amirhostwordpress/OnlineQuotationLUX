# Quotation Cost Breakdown System Guide

## Overview

The Quotation Cost Breakdown system provides a comprehensive view of all costs calculated in the quotation system. This feature allows admins to analyze detailed cost breakdowns for each quotation, including material costs, fabrication costs, add-on services, installation, and delivery costs.

## Features

### 📊 **Cost Analysis Dashboard**
- **Quotation Overview**: List of all quotations with key metrics
- **Detailed Breakdown**: Click any quotation to see complete cost analysis
- **Real-time Data**: Live data from the quotation system
- **Visual Categories**: Color-coded cost categories for easy identification

### 💰 **Cost Categories Displayed**

#### 1. **Material Costs** (Blue)
- Base material cost calculations
- Material pricing from Luxone catalog
- Customer-supplied material costs
- Brand supplier material costs

#### 2. **Fabrication Costs** (Green)
- **Cutting**: Cutting and shaping services (20 AED/sqm)
- **Top Polishing**: Top surface polishing (50 AED/sqm)
- **Polishing**: General polishing services (30 AED/sqm)

#### 3. **Add-on Services** (Purple)
- **Butt Joint Polish**: Butt joint polishing (50 AED/sqm)
- **Custom Edge**: Custom edge treatment (200 AED fixed)
- **Hob Cut Out**: Hob cut out service (100 AED fixed)
- **Drain Grooves**: Drain grooves installation (250 AED fixed)
- **Small Holes**: Small holes drilling (25 AED per hole)

#### 4. **Sink & Installation** (Orange)
- **Sink Cost**: Sink installation and materials
- **Installation**: Professional installation services (80 AED/sqm)

#### 5. **Delivery** (Yellow)
- **Delivery**: Transportation and delivery services
- Location-based pricing (Dubai vs UAE)

### 📈 **Summary Metrics**
- **Subtotal**: Base cost before margin
- **Margin**: 30% profit margin
- **Grand Total**: Final amount including VAT
- **VAT**: 5% value-added tax

### 🏗️ **Product Breakdown**
- Individual product costs
- Area calculations per product
- Material costs per product
- Processing costs per product
- Quantity tracking

## Database Integration

### Quotations Table
The system reads from the existing `quotations` table which includes:
- `pricing_data`: JSON field containing complete cost breakdown
- `total_amount`: Final quotation amount
- `total_area`: Total project area in square meters
- `quote_id`: Unique quotation identifier
- `customer_name`: Customer information
- `status`: Quotation status

### Pricing Data Structure
```json
{
  "materialCost": 1500.00,
  "cutting": 200.00,
  "topPolishing": 500.00,
  "polishing": 300.00,
  "buttJointPolish": 0.00,
  "customEdge": 200.00,
  "hobCutOut": 0.00,
  "drainGrooves": 0.00,
  "smallHoles": 0.00,
  "sinkCost": 900.00,
  "installation": 800.00,
  "delivery": 300.00,
  "subtotal": 4700.00,
  "margin": 1410.00,
  "subtotalWithMargin": 6110.00,
  "vat": 305.50,
  "grandTotal": 6415.50,
  "totalSqm": 10.0,
  "slabsRequired": 2,
  "productBreakdown": {
    "product1": {
      "productType": "Kitchen Worktop",
      "quantity": 1,
      "area": 8.5,
      "materialCost": 1275.00,
      "processingCost": 850.00,
      "totalCost": 2125.00
    }
  }
}
```

## Frontend Component

### Location
`src/components/admin/QuotationCostBreakdown.tsx`

### Key Features
- **Responsive Design**: Works on desktop and mobile
- **Modal Interface**: Detailed view in popup modal
- **Real-time Updates**: Refresh button for latest data
- **Search & Filter**: Easy navigation through quotations
- **Currency Formatting**: AED currency display
- **Date Formatting**: User-friendly date display

### Component Structure
```tsx
const QuotationCostBreakdown: React.FC = () => {
  // State management
  const [quotations, setQuotations] = useState<QuotationCostBreakdown[]>([]);
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationCostBreakdown | null>(null);
  
  // API integration
  const fetchQuotations = async () => { /* ... */ };
  
  // Cost categorization
  const getCostCategories = (pricing: any): CostCategory[] => { /* ... */ };
  
  // Utility functions
  const formatCurrency = (amount: number) => { /* ... */ };
  const formatDate = (dateString: string) => { /* ... */ };
  
  return (
    // Component JSX
  );
};
```

## API Integration

### Endpoint
```
GET /api/quotations
```

### Authentication
- Requires JWT token authentication
- Admin role access only
- Automatic token validation

### Response Format
```json
[
  {
    "id": 1,
    "quote_id": "LUX-2025-001",
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "total_amount": 6415.50,
    "total_area": 10.0,
    "pricing_data": { /* complete pricing breakdown */ },
    "created_at": "2025-08-10T12:00:00Z",
    "status": "pending"
  }
]
```

## Usage Instructions

### Accessing the Feature
1. Login as Super Admin
2. Navigate to "Cost Breakdown" tab in the admin panel
3. View all quotations with cost summaries
4. Click any quotation to see detailed breakdown

### Understanding the Display
1. **Quotation Cards**: Overview of each quotation
   - Quote ID and status
   - Customer information
   - Total area and amount
   - Creation date

2. **Detailed Modal**: Complete cost analysis
   - Summary cards (Subtotal, Margin, Grand Total)
   - Cost categories with individual items
   - Product breakdown (if available)
   - Project details and timeline

### Cost Categories Explained
- **Material Costs**: Raw material expenses
- **Fabrication Costs**: Manufacturing and processing
- **Add-on Services**: Optional enhancements
- **Sink & Installation**: Installation services
- **Delivery**: Transportation costs

## Integration with Existing Systems

### Quotation System
- Reads from existing quotation data
- No changes to quotation creation process
- Real-time cost calculations
- Maintains data consistency

### Pricing Calculator
- Uses existing `calculatePricing` function
- Displays results from `pricingCalculator.ts`
- Shows all calculated costs
- Maintains calculation accuracy

### Admin Panel
- Integrated into Super Admin interface
- Consistent UI/UX design
- Proper authentication and authorization
- Responsive design patterns

## Benefits

### For Admins
- **Complete Visibility**: See all costs in one place
- **Cost Analysis**: Understand pricing breakdowns
- **Decision Making**: Make informed pricing decisions
- **Customer Support**: Provide detailed cost explanations

### For Business
- **Transparency**: Clear cost breakdown for customers
- **Profitability**: Track margins and profitability
- **Pricing Strategy**: Optimize pricing based on costs
- **Reporting**: Generate cost analysis reports

## Technical Details

### Performance
- Efficient data loading
- Optimized rendering
- Minimal API calls
- Responsive interface

### Security
- JWT authentication
- Role-based access control
- Data validation
- Secure API endpoints

### Scalability
- Handles large quotation volumes
- Efficient data processing
- Optimized database queries
- Future-ready architecture

## Troubleshooting

### Common Issues

1. **No Quotations Displayed**
   - Check authentication token
   - Verify API endpoint accessibility
   - Check database connectivity
   - Ensure quotations exist in database

2. **Cost Breakdown Not Showing**
   - Verify `pricing_data` field exists
   - Check JSON data format
   - Ensure pricing calculation completed
   - Validate quotation submission

3. **Currency Display Issues**
   - Check browser locale settings
   - Verify currency formatting function
   - Ensure numeric data types
   - Check for null/undefined values

### Debug Tools
- Browser console for JavaScript errors
- Network tab for API requests
- Database queries for data verification
- Component state inspection

## Future Enhancements

### Planned Features
- **Export Functionality**: PDF/Excel export
- **Cost Comparison**: Compare multiple quotations
- **Trend Analysis**: Cost trends over time
- **Filtering Options**: Filter by date, customer, status
- **Search Functionality**: Search within cost breakdowns

### Integration Plans
- **Reporting System**: Automated cost reports
- **Analytics Dashboard**: Cost analytics integration
- **Customer Portal**: Customer-facing cost breakdowns
- **Mobile App**: Mobile-optimized interface

## Support

For technical support or questions about the Quotation Cost Breakdown system:

1. Check the browser console for error details
2. Verify API endpoint accessibility
3. Test authentication and authorization
4. Review database connectivity
5. Check quotation data integrity
6. Consult the troubleshooting guide

## Version History

### v1.0.0 (Current)
- Initial release of Quotation Cost Breakdown
- Complete cost categorization
- Detailed modal interface
- Real-time data integration
- Responsive design
- Admin panel integration
- Comprehensive cost analysis
- Product breakdown display
- Currency and date formatting
- Authentication and security
