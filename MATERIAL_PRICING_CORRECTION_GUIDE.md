# Material Pricing Correction Guide

## Overview

This document outlines the correction made to the material pricing system to ensure consistency between field names and actual units of measurement.

## Problem Identified

The material pricing system had a **field naming inconsistency**:
- **Field Name**: `price_per_sqft` (suggesting price per square foot)
- **Actual Values**: Prices were stored as **AED per square meter**
- **Impact**: Confusion in calculations and potential errors

## Solution Implemented

### 1. Field Name Correction
- **Before**: `price_per_sqft`
- **After**: `price_per_sqm`
- **Reason**: Field name now accurately reflects the unit of measurement

### 2. Files Updated

#### TypeScript Files
1. **`src/types/index.ts`**
   - Updated `MaterialOption` interface
   - Changed `price_per_sqft: string` to `price_per_sqm: string`
   - Added `deliveryLocation` field to `QuotationData`

2. **`src/utils/materialData.ts`**
   - Updated interface definition
   - Updated all hardcoded material objects
   - Updated utility functions to use new field name

3. **`src/utils/pricingCalculator.ts`**
   - Updated all references to use `price_per_sqm`
   - Enhanced debugging for material matching
   - Corrected calculation logic

4. **`src/services/materialService.ts`**
   - Renamed method from `getMaterialPricePerSqft` to `getMaterialPricePerSqm`
   - Updated error messages

#### Database Files
1. **`supabase/migrations/20250712000000_rename_price_per_sqft_to_price_per_sqm.sql`**
   - Migration to rename database column
   - Added clarifying comments

2. **`luxonebackendrepo/insert_materials.js`**
   - Updated comments to reflect correct units
   - Corrected pricing for specific materials

3. **`insert_quartz_materials.sql`**
   - Updated comments and pricing values
   - Added special pricing notes

## Material Pricing Structure

### Standard Quartz (280 AED/sqm)
- Golden River
- The Grold
- Royal Statuario
- Universe Grey
- Strike Light
- Grey Leather

### Premium Quartz (320 AED/sqm)
- White Pazzal
- The Saint (Polished)
- Super Wave
- White Beauty
- Grey Wonder
- Supreme Taj
- Golden Track
- The Glacier
- Imperial White
- Ambience Touch
- Amazed Grey
- The Ambience (Leather)

### Special Pricing
- **The Saint (Matt)**: 350 AED/sqm
- **Moon White**: 220 AED/sqm (Budget option)
- **Megistic White**: 260 AED/sqm

## Calculation Examples

### Example 1: Golden River Quartz
```
Material: Golden River
Price: 280 AED/sqm
Area: 4 sqm (2m × 2m)
Calculation: 4 × 280 = 1,120 AED
```

### Example 2: White Pazzal Quartz
```
Material: White Pazzal
Price: 320 AED/sqm
Area: 6 sqm (3m × 2m)
Calculation: 6 × 320 = 1,920 AED
```

### Example 3: Moon White (Budget)
```
Material: Moon White
Price: 220 AED/sqm
Area: 4 sqm (2m × 2m)
Calculation: 4 × 220 = 880 AED
```

## Database Migration

### Running the Migration
```sql
-- Execute the migration file
-- This will rename the column and add clarifying comments
ALTER TABLE material_options 
CHANGE COLUMN price_per_sqft price_per_sqm DECIMAL(10,2);

ALTER TABLE material_options 
MODIFY COLUMN price_per_sqm DECIMAL(10,2) COMMENT 'Price per square meter (AED/sqm)';
```

### Verification
```sql
-- Check the column was renamed correctly
DESCRIBE material_options;

-- Verify pricing data
SELECT color_name, price_per_sqm FROM material_options WHERE category = 'quartz';
```

## Testing Checklist

### Frontend Testing
- [ ] Material selection works correctly
- [ ] Pricing calculations are accurate
- [ ] Debug logs show correct field names
- [ ] No TypeScript errors

### Backend Testing
- [ ] API returns correct field names
- [ ] Database queries work with new column name
- [ ] Material insertion scripts work correctly

### Integration Testing
- [ ] Complete quotation flow works
- [ ] Pricing calculations match expected values
- [ ] PDF generation shows correct prices

## Benefits of Correction

### 1. Clarity
- Field names now accurately reflect units
- Reduced confusion for developers
- Clear documentation

### 2. Accuracy
- Eliminates potential calculation errors
- Consistent unit handling
- Proper material cost calculations

### 3. Maintainability
- Self-documenting code
- Easier to understand and modify
- Better debugging capabilities

## Rollback Plan

If issues arise, the following rollback steps can be taken:

### 1. Database Rollback
```sql
-- Revert the column rename
ALTER TABLE material_options 
CHANGE COLUMN price_per_sqm price_per_sqft DECIMAL(10,2);
```

### 2. Code Rollback
- Revert all TypeScript changes
- Restore original field names
- Update import statements

### 3. Verification
- Test material selection
- Verify pricing calculations
- Check API responses

## Future Considerations

### 1. API Versioning
- Consider API versioning for future changes
- Maintain backward compatibility where possible

### 2. Documentation
- Keep documentation updated
- Add unit testing for pricing calculations
- Document any new material additions

### 3. Monitoring
- Monitor for any calculation discrepancies
- Track material usage and pricing
- Regular validation of pricing data

## Conclusion

This correction ensures that the material pricing system is consistent, accurate, and maintainable. The field names now properly reflect the units of measurement, eliminating confusion and potential calculation errors.

The changes are backward-compatible in terms of functionality while improving code clarity and reducing the risk of future errors.
