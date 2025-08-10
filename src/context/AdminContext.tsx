import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminSettings, FormField, PDFTemplate } from '../types/admin';
import { QuotationData } from '../types';
import { 
  fetchCompanySettings, 
  updateCompanySettings, 
  fetchFormFields, 
  fetchPdfTemplates,
  createFormField as createFormFieldApi,
  updateFormField as updateFormFieldApi,
  deleteFormField as deleteFormFieldApi,
  createPdfTemplate as createPdfTemplateApi,
  updatePdfTemplate as updatePdfTemplateApi,
  deletePdfTemplate as deletePdfTemplateApi,
  uploadCompanyLogo,
  fetchPricingRules
} from '../services/adminService';
import { fetchQuotations } from '../services/quotationService';

export interface QuoteRecord {
  id: string;
  quote_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_location: string;
  service_level: string;
  material_source: string;
  material_type: string;
  material_color: string;
  worktop_layout: string;
  project_type: string;
  timeline: string;
  sink_option: string;
  additional_comments: string;
  quote_data: Record<string, unknown>;
  pricing_data: Record<string, unknown>;
  total_area: number;
  total_amount: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
  data: QuotationData;
  createdAt: string;
}

interface AdminContextType {
  settings: AdminSettings;
  updateSettings: (newSettings: AdminSettings) => void;
  uploadLogo: (file: File) => Promise<void>;
  quotes: QuoteRecord[];
  addQuote: (quote: QuoteRecord) => void;
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  updateFormField: (field: FormField) => void;
  deleteFormField: (fieldId: string) => void;
  addFormField: (field: FormField) => void;
  updatePdfTemplate: (template: PDFTemplate) => void;
  deletePdfTemplate: (templateId: string) => void;
  addPdfTemplate: (template: PDFTemplate) => void;
  refreshQuotes: () => Promise<void>;
  refreshCostRules: () => Promise<void>;
}

const defaultFormFields: FormField[] = [
  {
    id: 'serviceLevel',
    type: 'radio',
    label: 'Scope of Work',
    required: true,
    options: ['Fabrication Only', 'Fabrication & Delivery', 'Fabrication, Delivery & Installation'],
    step: 1,
    category: 'Service',
    order: 1,
    visible: true
  },
  {
    id: 'materialSource',
    type: 'radio',
    label: 'Material Source',
    required: true,
    options: ['By Luxone Own Material', 'By Yourself', 'Luxone Others'],
    step: 2,
    category: 'Material',
    order: 2,
    visible: true
  },
  {
    id: 'worktopLayout',
    type: 'radio',
    label: 'Worktop Layout',
    required: true,
    options: ['U + Island', 'U Shape', 'L + Island', 'L Shape', 'Galley', '1 Piece', 'Custom'],
    step: 3,
    category: 'Layout',
    order: 3,
    visible: true
  },
  {
    id: 'timeline',
    type: 'radio',
    label: 'Project Timeline',
    required: true,
    options: ['ASAP to 2 Weeks', '3 to 6 Weeks', '6 Weeks or more'],
    step: 6,
    category: 'Timeline',
    order: 6,
    visible: true
  },
  {
    id: 'projectType',
    type: 'select',
    label: 'Project Type & Application',
    required: true,
    options: [
      'Kitchen - Ready for worktops now / ASAP',
      'Kitchen - Under renovation',
      'Kitchen - Planning stage',
      'Bathroom - Ready for worktops now / ASAP',
      'Bathroom - Under renovation',
      'Bathroom - Planning stage',
      'Commercial - Office space',
      'Commercial - Restaurant/Hotel',
      'Commercial - Retail',
      'Residential - New construction',
      'Residential - Renovation',
      'Other - Please specify in comments'
    ],
    step: 8,
    category: 'Project',
    order: 8,
    visible: true
  },
  {
    id: 'name',
    type: 'text',
    label: 'Your Name',
    placeholder: 'First name / Surname',
    required: true,
    step: 9,
    category: 'Contact',
    order: 9,
    visible: true
  },
  {
    id: 'email',
    type: 'text',
    label: 'Email Address',
    placeholder: 'your.email@example.com',
    required: true,
    step: 9,
    category: 'Contact',
    order: 10,
    visible: true
  },
  {
    id: 'contactNumber',
    type: 'text',
    label: 'Contact Number',
    placeholder: '01234 567890',
    required: true,
    step: 9,
    category: 'Contact',
    order: 11,
    visible: true
  },
  {
    id: 'location',
    type: 'select',
    label: 'Location',
    required: true,
    options: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'],
    step: 9,
    category: 'Contact',
    order: 12,
    visible: true
  }
];

const defaultPdfTemplate: PDFTemplate = {
  id: 'default',
  name: 'Default Template',
  headerLogo: 'https://theluxone.com/wp-content/uploads/2025/06/cropped-Luxone_HQ-1.png',
  headerText: 'Luxone - Premium Worktop Solutions',
  footerText: '© 2025 Luxone - Premium Worktop Solutions | UAE | www.theluxone.com',
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#F59E0B'
  },
  fonts: {
    heading: 'Arial, sans-serif',
    body: 'Arial, sans-serif'
  },
  sections: {
    showClientInfo: true,
    showProjectSpecs: true,
    showPricing: true,
    showTerms: true,
    customSections: []
  },
  layout: 'standard'
};

const defaultSettings: AdminSettings = {
  companyName: 'Luxone',
  website: 'www.theluxone.com',
  address: 'Dubai, UAE\nPremium Worktop Solutions',
  whatsappIndia: '+919648555355',
  whatsappUAE: '+971585815601',
  adminEmail: 'amirhost07@gmail.com',
  pricePerSqft: 150,
  aedToUsdRate: 3.67,
  vatRate: 5,
  consultantName: 'Ahmed Al-Rashid',
  consultantPhone: '+971501234567',
  consultantEmail: 'ahmed@theluxone.com',
  logoUrl: 'https://theluxone.com/wp-content/uploads/2025/06/cropped-Luxone_HQ-1.png',
  formFields: defaultFormFields,
  pdfTemplates: [defaultPdfTemplate],
  activePdfTemplate: 'default'
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [quotes, setQuotes] = useState<QuoteRecord[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load all admin data from database
  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Load company settings
      const companySettings = await fetchCompanySettings();
      console.log('AdminContext - Raw company settings from DB:', companySettings as Record<string, unknown>);
      
      // Load form fields
      const formFields = await fetchFormFields();
      
      // Load PDF templates
      const pdfTemplates = await fetchPdfTemplates();
      
      // Load cost rules
      const costRules = await fetchPricingRules();
      
      // Map database fields to frontend format
      const mappedCompanySettings = {
        companyName: companySettings.company_name,
        website: companySettings.website,
        address: companySettings.address,
        whatsappIndia: companySettings.whatsapp_india,
        whatsappUAE: companySettings.whatsapp_uae,
        adminEmail: companySettings.admin_email,
        pricePerSqft: companySettings.price_per_sqft,
        aedToUsdRate: companySettings.aed_to_usd_rate,
        vatRate: companySettings.vat_rate,
        consultantName: companySettings.consultant_name,
        consultantPhone: companySettings.consultant_phone,
        consultantEmail: companySettings.consultant_email,
        logoUrl: companySettings.logo_url,
        logoFileName: companySettings.logo_file_name,
        logoFilePath: companySettings.logo_file_path,
        logoFileSize: companySettings.logo_file_size,
        logoMimeType: companySettings.logo_mime_type,
        costRules: costRules
      };
      
      console.log('AdminContext - Mapped company settings:', mappedCompanySettings as Record<string, unknown>);
      
      // Update settings with database data
      setSettings(prev => ({
        ...prev,
        ...mappedCompanySettings,
        formFields: formFields.length > 0 ? formFields : prev.formFields,
        pdfTemplates: pdfTemplates.length > 0 ? pdfTemplates : prev.pdfTemplates,
        costRules: costRules
      }));
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshQuotes = async () => {
    try {
      console.log('AdminContext - Fetching quotations...');
      const data = await fetchQuotations();
      console.log('AdminContext - Quotations fetched:', data.length, 'quotes');
      setQuotes(data);
    } catch (err) {
      console.error('Failed to fetch quotations:', err);
    }
  };

  // After any cost rule update, reload costRules
  const refreshCostRules = async () => {
    const costRules = await fetchPricingRules();
    setSettings(prev => ({ ...prev, costRules }));
  };

  useEffect(() => {
    loadAdminData();
    refreshQuotes();
  }, []);

  const updateSettings = async (newSettings: AdminSettings) => {
    try {
      // Extract only company settings fields for the backend
      const companySettingsData = {
        companyName: newSettings.companyName,
        website: newSettings.website,
        address: newSettings.address,
        whatsappIndia: newSettings.whatsappIndia,
        whatsappUAE: newSettings.whatsappUAE,
        adminEmail: newSettings.adminEmail,
        pricePerSqft: newSettings.pricePerSqft,
        aedToUsdRate: newSettings.aedToUsdRate,
        vatRate: newSettings.vatRate,
        consultantName: newSettings.consultantName,
        consultantPhone: newSettings.consultantPhone,
        consultantEmail: newSettings.consultantEmail,
        logoUrl: newSettings.logoUrl,
      };
      
      // Save company settings to database
      await updateCompanySettings(companySettingsData);
      
      // Update local state
    setSettings(newSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  const addQuote = (quote: QuoteRecord) => {
    setQuotes(prev => [quote, ...prev]);
  };

  const updateFormField = async (field: FormField) => {
    try {
      if (field.id && field.id !== 'new') {
        // Update existing field
        await updateFormFieldApi(parseInt(field.id), field);
      } else {
        // Create new field
        const result = await createFormFieldApi(field);
        field.id = result.id.toString();
      }
      
      // Update local state
    setSettings(prev => ({
      ...prev,
      formFields: prev.formFields.map(f => f.id === field.id ? field : f)
    }));
    } catch (error) {
      console.error('Failed to update form field:', error);
      throw error;
    }
  };

  const deleteFormField = async (fieldId: string) => {
    try {
      await deleteFormFieldApi(parseInt(fieldId));
      
      // Update local state
    setSettings(prev => ({
      ...prev,
      formFields: prev.formFields.filter(f => f.id !== fieldId)
    }));
    } catch (error) {
      console.error('Failed to delete form field:', error);
      throw error;
    }
  };

  const addFormField = async (field: FormField) => {
    try {
      const result = await createFormFieldApi(field);
      field.id = result.id.toString();
      
      // Update local state
    setSettings(prev => ({
      ...prev,
      formFields: [...prev.formFields, field]
    }));
    } catch (error) {
      console.error('Failed to add form field:', error);
      throw error;
    }
  };

  const updatePdfTemplate = async (template: PDFTemplate) => {
    try {
      if (template.id && template.id !== 'new') {
        // Update existing template
        await updatePdfTemplateApi(parseInt(template.id), template);
      } else {
        // Create new template
        const result = await createPdfTemplateApi(template);
        template.id = result.id.toString();
      }
      
      // Update local state
    setSettings(prev => ({
      ...prev,
      pdfTemplates: prev.pdfTemplates.map(t => t.id === template.id ? template : t)
    }));
    } catch (error) {
      console.error('Failed to update PDF template:', error);
      throw error;
    }
  };

  const deletePdfTemplate = async (templateId: string) => {
    try {
      await deletePdfTemplateApi(parseInt(templateId));
      
      // Update local state
    setSettings(prev => ({
      ...prev,
      pdfTemplates: prev.pdfTemplates.filter(t => t.id !== templateId)
    }));
    } catch (error) {
      console.error('Failed to delete PDF template:', error);
      throw error;
    }
  };

  const addPdfTemplate = async (template: PDFTemplate) => {
    try {
      const result = await createPdfTemplateApi(template);
      template.id = result.id.toString();
      
      // Update local state
    setSettings(prev => ({
      ...prev,
      pdfTemplates: [...prev.pdfTemplates, template]
    }));
    } catch (error) {
      console.error('Failed to add PDF template:', error);
      throw error;
    }
  };

  const uploadLogo = async (file: File) => {
    try {
      const response = await uploadCompanyLogo(file);
      console.log('Logo upload response:', response);
      
      // Update settings with the new logo information
      setSettings(prev => ({
        ...prev,
        logoUrl: `http://localhost:5000/api${response.file.path}`,
        logoFileName: response.file.originalName,
        logoFilePath: response.file.path,
        logoFileSize: response.file.size,
        logoMimeType: response.file.mimeType,
      }));
    } catch (error) {
      console.error('Failed to upload logo:', error);
      throw error;
    }
  };

  const value = {
    settings,
    updateSettings,
    uploadLogo,
    quotes,
    addQuote,
    isAdminMode,
    setIsAdminMode,
    updateFormField,
    deleteFormField,
    addFormField,
    updatePdfTemplate,
    deletePdfTemplate,
    addPdfTemplate,
    refreshQuotes,
    refreshCostRules,
    loading,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};