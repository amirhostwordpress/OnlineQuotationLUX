import { apiRequest } from '../utils/apiUtils';

export interface CostField {
  id?: number;
  category_id?: number;
  field_name: string;
  field_type: 'material' | 'labor' | 'overhead' | 'transport' | 'custom';
  base_cost: number;
  unit: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CostCategory {
  id?: number;
  category_name: string;
  description?: string;
  fields?: CostField[];
  total_cost?: number;
  field_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CostStatistics {
  total_categories: number;
  total_fields: number;
  total_cost: number;
  field_types: {
    material: number;
    labor: number;
    overhead: number;
    transport: number;
    custom: number;
  };
}

// Cost Categories

// Get all cost categories
export async function fetchCostCategories(): Promise<CostCategory[]> {
  return apiRequest('/cost_management/categories');
}

// Create new cost category
export async function createCostCategory(category: Partial<CostCategory>): Promise<{ success: boolean; category: CostCategory }> {
  return apiRequest('/cost_management/categories', {
    method: 'POST',
    body: JSON.stringify(category),
  });
}

// Update cost category
export async function updateCostCategory(categoryId: number, category: Partial<CostCategory>): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/cost_management/categories/${categoryId}`, {
    method: 'PUT',
    body: JSON.stringify(category),
  });
}

// Delete cost category
export async function deleteCostCategory(categoryId: number): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/cost_management/categories/${categoryId}`, {
    method: 'DELETE',
  });
}

// Get cost fields for a category
export async function fetchCategoryFields(categoryId: number): Promise<CostField[]> {
  return apiRequest(`/cost_management/categories/${categoryId}/fields`);
}

// Calculate total cost for a category
export async function getCategoryTotalCost(categoryId: number): Promise<{ total_cost: number }> {
  return apiRequest(`/cost_management/categories/${categoryId}/total`);
}

// Cost Fields

// Get all cost fields
export async function fetchAllCostFields(): Promise<CostField[]> {
  return apiRequest('/cost_management/fields');
}

// Get cost field by ID
export async function fetchCostField(fieldId: number): Promise<CostField> {
  return apiRequest(`/cost_management/fields/${fieldId}`);
}

// Add cost field to category
export async function addCostField(categoryId: number, field: Partial<CostField>): Promise<{ success: boolean; field: CostField }> {
  return apiRequest(`/cost_management/categories/${categoryId}/fields`, {
    method: 'POST',
    body: JSON.stringify(field),
  });
}

// Update cost field
export async function updateCostField(fieldId: number, field: Partial<CostField>): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/cost_management/fields/${fieldId}`, {
    method: 'PUT',
    body: JSON.stringify(field),
  });
}

// Delete cost field
export async function deleteCostField(fieldId: number): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/cost_management/fields/${fieldId}`, {
    method: 'DELETE',
  });
}

// Statistics

// Get cost management statistics
export async function getCostStatistics(): Promise<CostStatistics> {
  return apiRequest('/cost_management/statistics');
}

// Utility Functions

// Calculate total cost for a list of fields
export function calculateTotalCost(fields: CostField[]): number {
  return fields.reduce((total, field) => total + (field.base_cost || 0), 0);
}

// Get field type label
export function getFieldTypeLabel(type: string): string {
  const typeLabels: Record<string, string> = {
    material: 'Material Cost',
    labor: 'Labor Cost',
    overhead: 'Overhead Cost',
    transport: 'Transport Cost',
    custom: 'Custom Cost'
  };
  return typeLabels[type] || 'Custom';
}

// Get field type icon
export function getFieldTypeIcon(type: string): string {
  const typeIcons: Record<string, string> = {
    material: 'Package',
    labor: 'Calculator',
    overhead: 'TrendingUp',
    transport: 'Truck',
    custom: 'DollarSign'
  };
  return typeIcons[type] || 'DollarSign';
}

// Validate cost field data
export function validateCostField(field: Partial<CostField>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!field.field_name?.trim()) {
    errors.push('Field name is required');
  }

  if (!field.field_type) {
    errors.push('Field type is required');
  }

  if (field.base_cost === undefined || field.base_cost < 0) {
    errors.push('Base cost must be a non-negative number');
  }

  if (!field.unit?.trim()) {
    errors.push('Unit is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validate cost category data
export function validateCostCategory(category: Partial<CostCategory>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!category.category_name?.trim()) {
    errors.push('Category name is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Format cost for display
export function formatCost(cost: number, unit: string): string {
  return `$${cost.toFixed(2)} ${unit}`;
}

// Get available field types
export const FIELD_TYPES = [
  { value: 'material', label: 'Material Cost', icon: 'Package' },
  { value: 'labor', label: 'Labor Cost', icon: 'Calculator' },
  { value: 'overhead', label: 'Overhead Cost', icon: 'TrendingUp' },
  { value: 'transport', label: 'Transport Cost', icon: 'Truck' },
  { value: 'custom', label: 'Custom Cost', icon: 'DollarSign' }
];

// Get available units
export const AVAILABLE_UNITS = [
  'per sq ft',
  'per sq meter', 
  'per piece',
  'per hour',
  'per day',
  'per kg',
  'per liter',
  'per unit',
  'fixed',
  'percentage'
];
