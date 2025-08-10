import { apiRequest } from '../utils/apiUtils';

export interface CompanySettings {
  id?: number;
  admin_user_id: number;
  company_name: string;
  manager_name: string;
  sales_contact_name: string;
  mobile_number: string;
  address: string;
  margin_rate: number;
  email: string;
  website?: string;
  logo_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminCompanySettings {
  id: number;
  admin_user_id: number;
  admin_name: string;
  admin_email: string;
  admin_role: string;
  company_name: string;
  manager_name: string;
  sales_contact_name: string;
  mobile_number: string;
  address: string;
  margin_rate: number;
  email: string;
  website: string;
  logo_url: string;
  created_at: string;
  updated_at: string;
}

// Get all admin company settings (super admin only)
export async function fetchAllAdminCompanySettings(): Promise<AdminCompanySettings[]> {
  return apiRequest('/company_settings/all');
}

// Get current admin's company settings
export async function fetchCompanySettings(): Promise<CompanySettings> {
  return apiRequest('/company_settings');
}

// Create new company settings
export async function createCompanySettings(settings: Partial<CompanySettings>): Promise<{ success: boolean; message: string }> {
  return apiRequest('/company_settings', {
    method: 'POST',
    body: JSON.stringify(settings),
  });
}

// Update current admin's company settings
export async function updateCompanySettings(settings: Partial<CompanySettings>): Promise<{ success: boolean; message: string }> {
  return apiRequest('/company_settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}

// Update specific admin's company settings (super admin only)
export async function updateAdminCompanySettings(adminId: number, settings: Partial<CompanySettings>): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/company_settings/${adminId}`, {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}

// Get specific admin's company settings
export async function fetchAdminCompanySettings(adminId: number): Promise<CompanySettings> {
  return apiRequest(`/company_settings/${adminId}`);
}

// Test authentication
export async function testAuth(): Promise<any> {
  return apiRequest('/company_settings/auth-test');
}

// Test data handling
export async function testData(data: any): Promise<any> {
  return apiRequest('/company_settings/test-data', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
