# Hardcoded Materials System Guide

## Overview

The Hardcoded Materials system provides a reliable fallback mechanism for material pricing when the API is unavailable or fails. This ensures that quotation calculations continue to work even during API outages or network issues.

## Features

### 🔄 **API Fallback System**
- **Primary**: Uses API data when available
- **Fallback**: Automatically switches to hardcoded materials when API fails
- **Seamless**: No interruption to quotation calculations
- **Reliable**: Always provides material pricing

### 📊 **Material Data Structure**
- **20 Luxone Quartz Materials**: Complete with pricing and specifications
- **Multiple Finishes**: Polished, Matt, Leather options
- **Standard Thickness**: 20mm (configurable)
- **Accurate Pricing**: Real market prices in AED

### 🛠️ **Utility Functions**
- **Material Lookup**: Find materials by name, finish, and thickness
- **Price Calculation**: Get accurate pricing for any material
- **Category Filtering**: Filter materials by category
- **Data Validation**: Ensure data integrity

## Hardcoded Materials List

### Luxone Quartz Collection

| Material Name | Price/sqft | Finish | Category |
|---------------|------------|--------|----------|
| Golden River | 280.00 AED | Polished | Quartz |
| The Grold | 280.00 AED | Polished | Quartz |
| Megistic White | 260.00 AED | Polished | Quartz |
| Royal Statuario | 280.00 AED | Polished | Quartz |
| White Pazzal | 320.00 AED | Polished | Quartz |
| Universe Grey | 280.00 AED | Polished | Quartz |
| The Saint | 320.00 AED | Polished | Quartz |
| The Saint | 350.00 AED | Matt | Quartz |
| Super Wave | 320.00 AED | Polished | Quartz |
| White Beauty | 320.00 AED | Polished | Quartz |
| Grey Leather | 280.00 AED | Leather | Quartz |
| Strike Light | 280.00 AED | Polished | Quartz |
| Grey Wonder | 320.00 AED | Polished | Quartz |
| Supreme Taj | 320.00 AED | Polished | Quartz |
| Golden Track | 320.00 AED | Polished | Quartz |
| The Ambience | 320.00 AED | Leather | Quartz |
| The Glacier | 320.00 AED | Polished | Quartz |
| Imperial White | 320.00 AED | Polished | Quartz |
| Ambience Touch | 320.00 AED | Polished | Quartz |
| Amazed Grey | 320.00 AED | Polished | Quartz |
| Moon White | 220.00 AED | Polished | Quartz |

## Technical Implementation

### File Location
`src/utils/materialData.ts`

### Data Structure
```typescript
export interface MaterialOption {
  id?: number;
  category: string;
  brand: string;
  name: string;
  price_per_sqft: string | number;
  slab_size: string;
  thickness_options: string;
  finish_options: string;
  color_name?: string;
  finishing?: string;
  thickness?: string;
}
```

### Utility Functions

#### 1. Find Material by Name
```typescript
export const findMaterialByName = (
  colorName: string, 
  finishing: string = 'Polished', 
  thickness: string = '20mm'
): MaterialOption | undefined
```

#### 2. Get Material Price
```typescript
export const getMaterialPrice = (
  colorName: string, 
  finishing: string = 'Polished', 
  thickness: string = '20mm'
): number
```

#### 3. Get All Materials
```typescript
export const getAllHardcodedMaterials = (): MaterialOption[]
```

#### 4. Get Materials by Category
```typescript
export const getMaterialsByCategory = (category: string): MaterialOption[]
```

#### 5. Get Unique Material Names
```typescript
export const getUniqueMaterialNames = (): string[]
```

## Integration with Pricing Calculator

### Updated Logic Flow
1. **Try API First**: Attempt to fetch materials from API
2. **Check Material Match**: Look for exact match in API data
3. **Fallback to Hardcoded**: If API fails or material not found, use hardcoded data
4. **Calculate Pricing**: Use available material data for cost calculations

### Code Example
```typescript
// In pricingCalculator.ts
try {
  // Try to get materials from API first
  const materials = await materialService.getAllMaterials();
  const matchedMaterial = materials.find(/* ... */);
  
  if (matchedMaterial) {
    // Use API material data
    productMaterialCost = productArea * pricePerSqft;
  } else {
    // Fallback to hardcoded materials
    const hardcodedMaterial = findMaterialByName(
      product.materialColor,
      product.finish || 'Polished',
      String(product.thickness ?? '20mm')
    );
    if (hardcodedMaterial) {
      const pricePerSqft = getMaterialPrice(/* ... */);
      productMaterialCost = productArea * pricePerSqft;
    }
  }
} catch (error) {
  // API failed, use hardcoded materials
  const hardcodedMaterial = findMaterialByName(/* ... */);
  if (hardcodedMaterial) {
    const pricePerSqft = getMaterialPrice(/* ... */);
    productMaterialCost = productArea * pricePerSqft;
  }
}
```

## Integration with Cost Breakdown

### Material Information Display
The Quotation Cost Breakdown component now shows:
- **Material Details**: Total cost, area, slabs required
- **Available Materials**: Sample of Luxone quartz colors with pricing
- **Real-time Pricing**: Current prices from hardcoded data

### Enhanced Features
- **Material Lookup**: Find specific materials by name
- **Price Display**: Show pricing per square foot
- **Category Information**: Display material categories
- **Finish Options**: Show available finishes

## Benefits

### For System Reliability
- **No Downtime**: Quotations work even when API is down
- **Consistent Pricing**: Always have accurate material costs
- **Data Integrity**: Maintain pricing consistency
- **Performance**: Faster lookups with local data

### For Business Operations
- **Uninterrupted Service**: Continue generating quotations
- **Accurate Pricing**: Real market prices for materials
- **Customer Confidence**: Reliable cost calculations
- **Operational Efficiency**: No delays due to API issues

### For Development
- **Easy Testing**: Consistent data for testing
- **Offline Development**: Work without API dependency
- **Data Validation**: Compare API vs hardcoded data
- **Fallback Strategy**: Robust error handling

## Usage Examples

### Basic Material Lookup
```typescript
import { findMaterialByName, getMaterialPrice } from '../utils/materialData';

// Find a specific material
const material = findMaterialByName('Golden River', 'Polished', '20mm');
if (material) {
  console.log(`Material: ${material.name}, Price: ${material.price_per_sqft}/sqft`);
}

// Get price for a material
const price = getMaterialPrice('Golden River', 'Polished', '20mm');
console.log(`Price per sqft: ${price} AED`);
```

### Material List Operations
```typescript
import { getAllHardcodedMaterials, getMaterialsByCategory } from '../utils/materialData';

// Get all materials
const allMaterials = getAllHardcodedMaterials();

// Get only quartz materials
const quartzMaterials = getMaterialsByCategory('quartz');

// Get unique material names
const materialNames = getUniqueMaterialNames();
```

### Integration in Components
```typescript
// In QuotationCostBreakdown component
const getMaterialInfo = (materialColor: string, finish: string = 'Polished', thickness: string = '20mm') => {
  const material = findMaterialByName(materialColor, finish, thickness);
  if (material) {
    return {
      name: material.color_name || material.name,
      price: getMaterialPrice(materialColor, finish, thickness),
      brand: material.brand,
      category: material.category,
      finishing: material.finishing,
      thickness: material.thickness
    };
  }
  return null;
};
```

## Maintenance and Updates

### Adding New Materials
1. **Update Array**: Add new material to `HARDCODED_MATERIALS` array
2. **Follow Structure**: Ensure all required fields are included
3. **Test Integration**: Verify pricing calculations work correctly
4. **Update Documentation**: Keep this guide current

### Updating Prices
1. **Modify Price**: Update `price_per_sqft` field
2. **Validate Data**: Ensure price format is correct
3. **Test Calculations**: Verify quotation calculations
4. **Update Records**: Keep track of price changes

### Adding New Categories
1. **Extend Interface**: Update `MaterialOption` interface if needed
2. **Add Materials**: Include materials in new category
3. **Update Functions**: Modify utility functions if necessary
4. **Test Integration**: Ensure all features work with new category

## Troubleshooting

### Common Issues

1. **Material Not Found**
   - Check spelling and case sensitivity
   - Verify finish and thickness parameters
   - Ensure material exists in hardcoded list

2. **Price Calculation Errors**
   - Verify price format (string or number)
   - Check for null/undefined values
   - Ensure proper type conversion

3. **Integration Issues**
   - Check import statements
   - Verify function signatures
   - Test with sample data

### Debug Tools
- **Console Logging**: Check for API fallback messages
- **Data Validation**: Verify material data structure
- **Price Verification**: Compare API vs hardcoded prices
- **Function Testing**: Test utility functions independently

## Future Enhancements

### Planned Features
- **More Materials**: Add additional material categories
- **Dynamic Pricing**: Support for price updates
- **Material Images**: Add visual material references
- **Advanced Filtering**: More sophisticated search options

### Integration Plans
- **Database Sync**: Sync hardcoded data with database
- **Price Updates**: Automated price update system
- **Material Management**: Admin interface for material management
- **API Health Monitoring**: Proactive API status checking

## Support

For technical support or questions about the Hardcoded Materials system:

1. Check the console logs for API fallback messages
2. Verify material data structure and format
3. Test utility functions with sample data
4. Review integration points in pricing calculator
5. Consult the troubleshooting guide
6. Check for recent price updates or changes

## Version History

### v1.0.0 (Current)
- Initial release of Hardcoded Materials system
- 20 Luxone Quartz materials with accurate pricing
- Complete utility function suite
- API fallback integration
- Cost breakdown display integration
- Comprehensive error handling
- TypeScript interface definitions
- Material lookup and price calculation functions
