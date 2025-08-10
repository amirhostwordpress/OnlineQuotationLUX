// Admin service for managing admin panel data
import { apiRequest, getAuthHeaders, API_BASE } from '../utils/apiUtils';

export async function getAdminUsers() {
  return apiRequest('/admin_users');
}

export async function createAdminUser(data: any) {
  return apiRequest('/admin_users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminUser(id: string, data: any) {
  return apiRequest(`/admin_users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminUser(id: string) {
  return apiRequest(`/admin_users/${id}`, {
    method: 'DELETE',
  });
}

// ===== COMPANY SETTINGS =====
export async function fetchCompanySettings() {
  return apiRequest('/company_settings');
}

export async function updateCompanySettings(settings: any) {
  return apiRequest('/company_settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}

export async function uploadCompanyLogo(file: File) {
  const formData = new FormData();
  formData.append('logo', file);
  
  const token = localStorage.getItem('authToken');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE}/company-logo`, {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to upload logo');
  return response.json();
}

// ===== FORM FIELDS =====
export async function fetchFormFields() {
  return apiRequest('/form_fields');
}

export async function createFormField(field: any) {
  return apiRequest('/form_fields', {
    method: 'POST',
    body: JSON.stringify(field),
  });
}

export async function updateFormField(id: number, field: any) {
  return apiRequest(`/form_fields/${id}`, {
    method: 'PUT',
    body: JSON.stringify(field),
  });
}

export async function deleteFormField(id: number) {
  return apiRequest(`/form_fields/${id}`, {
    method: 'DELETE',
  });
}

// ===== PDF TEMPLATES =====
export async function fetchPdfTemplates() {
  return apiRequest('/pdf_templates');
}

export async function createPdfTemplate(template: any) {
  return apiRequest('/pdf_templates', {
    method: 'POST',
    body: JSON.stringify(template),
  });
}

export async function updatePdfTemplate(id: number, template: any) {
  return apiRequest(`/pdf_templates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(template),
  });
}

export async function deletePdfTemplate(id: number) {
  return apiRequest(`/pdf_templates/${id}`, {
    method: 'DELETE',
  });
}

// ===== PRICING RULES =====
export async function fetchPricingRules() {
  return apiRequest('/pricing_rules');
}

export async function createPricingRule(rule: any) {
  return apiRequest('/pricing_rules', {
    method: 'POST',
    body: JSON.stringify(rule),
  });
}

export async function updatePricingRule(id: number, rule: any) {
  return apiRequest(`/pricing_rules/${id}`, {
    method: 'PUT',
    body: JSON.stringify(rule),
  });
}

export async function deletePricingRule(id: number) {
  return apiRequest(`/pricing_rules/${id}`, {
    method: 'DELETE',
  });
}

// ===== ANALYTICS =====
export async function fetchAnalytics() {
  return apiRequest('/analytics');
} 