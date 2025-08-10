import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { useQuotation } from '../../context/QuotationContext';
import { useAuth } from '../../context/AuthContext';
import type { QuoteRecord } from '../../context/AdminContext';

import FormFieldManager from './FormFieldManager';
import CostManagement from './CostManagement';
import QuotationCostBreakdown from './QuotationCostBreakdown';
import FileUpload from '../common/FileUpload';
import UserManagement from './UserManagement';
import AdminCompanySettings from './AdminCompanySettings';
import ApiTest from './ApiTest';
import Step1ScopeOfWork from '../steps/Step1ScopeOfWork';
import Step2MaterialOptions from '../steps/Step2MaterialOptions';
import Step5DesignOptions from '../steps/Step5DesignOptions';
import Step6Timeline from '../steps/Step6Timeline';
import Step8ProjectType from '../steps/Step8ProjectType';
import Step9ContactInfo from '../steps/Step9ContactInfo';
import QuoteSummary from '../QuoteSummary';

import { 
  Settings, 
  Users, 
  FileText, 
  DollarSign, 
  Save,
  Eye,
  Edit,
  Download,
  MessageCircle,
  ArrowLeft,
  FormInput,
  Database,
  BarChart3,
  LogOut,
  RefreshCw,
  Search,
  X,
  Shield,
  Crown
} from 'lucide-react';

const SuperAdmin: React.FC = () => {
  const { settings, updateSettings, uploadLogo, quotes, setIsAdminMode } = useAdmin();
  const { currentStep, isQuoteSubmitted, resetQuotation } = useQuotation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('quotation');
  const [editingSettings, setEditingSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRecord | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      navigate('/super-admin-login');
    } else {
      console.log('User authenticated:', user);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      setSaveMessage(null);
      
      // Debug: Check if user is logged in
      const token = localStorage.getItem('authToken');
      console.log('Current auth token:', token ? 'Present' : 'Missing');
      
      if (selectedLogoFile) {
        await uploadLogo(selectedLogoFile);
        setSelectedLogoFile(null);
      }
      
      await updateSettings(tempSettings);
      setEditingSettings(false);
      setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleCancelEdit = () => {
    setTempSettings(settings);
    setEditingSettings(false);
    setSaveMessage(null);
  };

  const tabs = [
    { id: 'quotation', label: 'Quotation System', icon: FileText },
    { id: 'admin-management', label: 'Admin Management', icon: Shield },
    { id: 'admin-settings', label: 'Admin Company Settings', icon: Crown },
    { id: 'settings', label: 'Company Settings', icon: Settings },
    { id: 'cost-management', label: 'Cost Management', icon: DollarSign },
    { id: 'cost-breakdown', label: 'Cost Breakdown', icon: BarChart3 },
    { id: 'form-fields', label: 'Form Fields', icon: FormInput },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'quotes', label: 'Quote Requests', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'database', label: 'Data Export', icon: Database },
    { id: 'api-test', label: 'API Test', icon: Database }
  ];

  const renderQuotationStep = () => {
    if (isQuoteSubmitted) {
      return <QuoteSummary />;
    }

    switch (currentStep) {
      case 1:
        return <Step1ScopeOfWork />;
      case 2:
        return <Step2MaterialOptions />;
      case 3:
        return <Step5DesignOptions />;
      case 4:
        return <Step6Timeline />;
      case 5:
        return <Step8ProjectType />;
      case 6:
        return <Step9ContactInfo />;
      default:
        return <Step1ScopeOfWork />;
    }
  };

  const handleLogout = () => {
    setIsAdminMode(false);
    resetQuotation();
    navigate('/');
  };

  const handleRefreshQuotes = async () => {
    try {
      setIsRefreshing(true);
      window.location.reload();
    } catch (error) {
      console.error('Failed to refresh quotes:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const searchLower = searchTerm.toLowerCase();
    return (
      quote.id?.toString().toLowerCase().includes(searchLower) ||
      quote.customer_name?.toLowerCase().includes(searchLower) ||
      quote.customer_email?.toLowerCase().includes(searchLower) ||
      quote.customer_phone?.toLowerCase().includes(searchLower) ||
      quote.customer_location?.toLowerCase().includes(searchLower) ||
      quote.project_type?.toLowerCase().includes(searchLower) ||
      quote.service_level?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {settings.logoFilePath ? (
                <img 
                  src={`https://theluxone.com/wp-content/uploads/2025/06/cropped-Luxone_HQ-1.png`}
                  alt="Company Logo"
                  className="w-12 h-12 object-contain rounded-lg"
                />
              ) : settings.logoUrl ? (
                <img 
                  src={settings.logoUrl}
                  alt="Company Logo"
                  className="w-12 h-12 object-contain rounded-lg"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <img
  src="../logo.webp"
  alt="Company Logo"
  className="mr-3 object-contain"
/>

                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Luxone Super Admin</h1>
                <p className="text-sm text-gray-600">Complete system management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Quotation</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'quotation' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Quotation System</h2>
                  <div className="flex items-center space-x-2">
                                         <span className="text-sm text-gray-600">Step {currentStep} of 6</span>
                    {isQuoteSubmitted && (
                      <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                        Quote Submitted
                      </span>
                    )}
                  </div>
                </div>
                {renderQuotationStep()}
              </div>
            )}

                         {activeTab === 'admin-management' && (
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                 <h2 className="text-xl font-bold text-gray-900 mb-6">Admin Management</h2>
                 <UserManagement />
               </div>
             )}

             {activeTab === 'admin-settings' && (
               <AdminCompanySettings />
             )}

             {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Company Settings</h2>
                    {!editingSettings ? (
                      <button
                        onClick={() => setEditingSettings(true)}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        <Edit size={16} />
                        <span>Edit Settings</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveSettings}
                          disabled={savingSettings}
                          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                        >
                          <Save size={16} />
                          <span>{savingSettings ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                        >
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {saveMessage && (
                    <div className={`mb-4 p-3 rounded-lg ${
                      saveMessage.type === 'success' 
                        ? 'bg-green-50 border border-green-200 text-green-700' 
                        : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                      {saveMessage.text}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Company Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Company Information
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={tempSettings.companyName}
                          onChange={(e) => setTempSettings({...tempSettings, companyName: e.target.value})}
                          disabled={!editingSettings}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          type="text"
                          value={tempSettings.website}
                          onChange={(e) => setTempSettings({...tempSettings, website: e.target.value})}
                          disabled={!editingSettings}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Address
                        </label>
                        <textarea
                          value={tempSettings.address}
                          onChange={(e) => setTempSettings({...tempSettings, address: e.target.value})}
                          disabled={!editingSettings}
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Logo
                        </label>
                        <FileUpload
                          onFileSelect={setSelectedLogoFile}
                          selectedFile={selectedLogoFile}
                          acceptedTypes="image/*"
                          maxSize={5 * 1024 * 1024}
                          label="Upload Company Logo"
                        />
                        {tempSettings.logoUrl && !selectedLogoFile && (
                          <div className="mt-2 p-2 bg-gray-50 rounded border">
                            <p className="text-sm text-gray-600">Current logo: {tempSettings.logoFileName || 'Company Logo'}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Contact Information
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          WhatsApp India
                        </label>
                        <input
                          type="text"
                          value={tempSettings.whatsappIndia}
                          onChange={(e) => setTempSettings({...tempSettings, whatsappIndia: e.target.value})}
                          disabled={!editingSettings}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          WhatsApp UAE
                        </label>
                        <input
                          type="text"
                          value={tempSettings.whatsappUAE}
                          onChange={(e) => setTempSettings({...tempSettings, whatsappUAE: e.target.value})}
                          disabled={!editingSettings}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Email
                        </label>
                        <input
                          type="email"
                          value={tempSettings.adminEmail}
                          onChange={(e) => setTempSettings({...tempSettings, adminEmail: e.target.value})}
                          disabled={!editingSettings}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cost-management' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <CostManagement />
              </div>
            )}

            {activeTab === 'cost-breakdown' && (
              <QuotationCostBreakdown />
            )}

            {activeTab === 'form-fields' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <FormFieldManager />
              </div>
            )}

                         {activeTab === 'users' && (
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                 <UserManagement />
               </div>
             )}

             {activeTab === 'api-test' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <ApiTest />
              </div>
            )}

            {activeTab === 'quotes' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Quote Requests</h2>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handleRefreshQuotes}
                        disabled={isRefreshing}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                        <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                      </button>
                      <span className="text-sm text-gray-600">
                        Total Quotes: {filteredQuotes.length} / {quotes.length}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search quotes by ID, name, contact, location, service, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {filteredQuotes.length === 0 ? (
                    <div className="text-center py-12">
                      {searchTerm ? (
                        <>
                          <Search size={48} className="mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No quotes found</h3>
                          <p className="text-gray-600">No quotes match your search criteria.</p>
                          <button
                            onClick={() => setSearchTerm('')}
                            className="mt-4 text-blue-600 hover:text-blue-700 underline"
                          >
                            Clear search
                          </button>
                        </>
                      ) : (
                        <>
                          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No quotes yet</h3>
                          <p className="text-gray-600">Quote requests will appear here when customers submit them.</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Quote ID</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Service</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Total Cost</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredQuotes.map((quote) => {
                            let totalCost = 'N/A';
                            try {
                              if (quote.pricing_data) {
                                let pricingData;
                                if (typeof quote.pricing_data === 'string') {
                                  pricingData = JSON.parse(quote.pricing_data);
                                } else {
                                  pricingData = quote.pricing_data;
                                }
                                totalCost = pricingData.grandTotal 
                                  ? `AED ${Number(pricingData.grandTotal).toFixed(2)}`
                                  : 'N/A';
                              }
                            } catch (error) {
                              console.error('Error parsing pricing data for quote:', quote.id, error);
                            }

                            return (
                              <tr key={quote.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 font-mono text-sm">{quote.id}</td>
                                <td className="py-3 px-4">{quote.customer_name || 'N/A'}</td>
                                <td className="py-3 px-4">{quote.customer_phone || 'N/A'}</td>
                                <td className="py-3 px-4">{quote.customer_location || 'N/A'}</td>
                                <td className="py-3 px-4 text-sm">{quote.service_level || 'N/A'}</td>
                                <td className="py-3 px-4 font-mono text-sm font-semibold text-green-700">
                                  {totalCost}
                                </td>
                                                                 <td className="py-3 px-4 text-sm">{new Date(quote.created_at).toLocaleDateString()}</td>
                                <td className="py-3 px-4">
                                  <div className="flex space-x-2">
                                    <button
                                      className="text-blue-600 hover:text-blue-700"
                                      onClick={() => {
                                        setSelectedQuote(quote);
                                        setShowQuoteModal(true);
                                      }}
                                    >
                                      <Eye size={16} />
                                    </button>
                                    <button 
                                      className="text-green-600 hover:text-green-700"
                                      onClick={async () => {
                                        try {
                                          if (quote.quote_data) {
                                            let quoteData;
                                            
                                            if (typeof quote.quote_data === 'string') {
                                              quoteData = JSON.parse(quote.quote_data);
                                            } else {
                                              quoteData = quote.quote_data;
                                            }
                                            
                                            // Import the PDF generator
                                            const { generateQuotePDF } = await import('../../utils/pdfGenerator');
                                            await generateQuotePDF(quoteData, quote.id.toString(), settings);
                                          } else {
                                            alert('No quote data available for download');
                                          }
                                        } catch (error) {
                                          console.error('Error generating PDF:', error);
                                          alert('Error generating PDF. Please try again.');
                                        }
                                      }}
                                    >
                                      <Download size={16} />
                                    </button>
                                    <button className="text-green-600 hover:text-green-700">
                                      <MessageCircle size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Quotes</p>
                        <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
                      </div>
                      <FileText size={32} className="text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">This Month</p>
                                                 <p className="text-2xl font-bold text-gray-900">
                           {quotes.filter(q => new Date(q.created_at).getMonth() === new Date().getMonth()).length}
                         </p>
                      </div>
                      <Users size={32} className="text-green-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Form Fields</p>
                        <p className="text-2xl font-bold text-gray-900">{settings.formFields.length}</p>
                      </div>
                      <FormInput size={32} className="text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'database' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Data Management</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            const dataStr = JSON.stringify(quotes, null, 2);
                            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                            const exportFileDefaultName = `luxone_quotes_${new Date().toISOString().slice(0, 10)}.json`;
                            const linkElement = document.createElement('a');
                            linkElement.setAttribute('href', dataUri);
                            linkElement.setAttribute('download', exportFileDefaultName);
                            linkElement.click();
                          }}
                          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                        >
                          <Download size={16} />
                          <span>Export Quotes Data</span>
                        </button>
                        <button
                          onClick={() => {
                            const dataStr = JSON.stringify(settings, null, 2);
                            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                            const exportFileDefaultName = `luxone_settings_${new Date().toISOString().slice(0, 10)}.json`;
                            const linkElement = document.createElement('a');
                            linkElement.setAttribute('href', dataUri);
                            linkElement.setAttribute('download', exportFileDefaultName);
                            linkElement.click();
                          }}
                          className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                        >
                          <Download size={16} />
                          <span>Export Settings Data</span>
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Statistics</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Quotes:</span>
                          <span className="font-medium">{quotes.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Form Fields:</span>
                          <span className="font-medium">{settings.formFields.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">PDF Templates:</span>
                          <span className="font-medium">{settings.pdfTemplates.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Active Template:</span>
                          <span className="font-medium">{settings.activePdfTemplate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quote Details Modal */}
      {showQuoteModal && selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-lg">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
                onClick={() => setShowQuoteModal(false)}
              >
                ×
              </button>
              <h2 className="text-xl font-bold pr-8">Quote Details - {selectedQuote.id}</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                 <div className="space-y-4">
                   <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                     Quote Information
                   </h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     <div className="bg-gray-50 p-3 rounded-lg">
                       <div className="font-semibold text-gray-700 mb-1 text-sm">Customer Name</div>
                       <div className="text-gray-900 break-words text-sm">{selectedQuote.customer_name || 'N/A'}</div>
                     </div>
                     <div className="bg-gray-50 p-3 rounded-lg">
                       <div className="font-semibold text-gray-700 mb-1 text-sm">Customer Email</div>
                       <div className="text-gray-900 break-words text-sm">{selectedQuote.customer_email || 'N/A'}</div>
                     </div>
                     <div className="bg-gray-50 p-3 rounded-lg">
                       <div className="font-semibold text-gray-700 mb-1 text-sm">Customer Phone</div>
                       <div className="text-gray-900 break-words text-sm">{selectedQuote.customer_phone || 'N/A'}</div>
                     </div>
                     <div className="bg-gray-50 p-3 rounded-lg">
                       <div className="font-semibold text-gray-700 mb-1 text-sm">Customer Location</div>
                       <div className="text-gray-900 break-words text-sm">{selectedQuote.customer_location || 'N/A'}</div>
                     </div>
                     <div className="bg-gray-50 p-3 rounded-lg">
                       <div className="font-semibold text-gray-700 mb-1 text-sm">Project Type</div>
                       <div className="text-gray-900 break-words text-sm">{selectedQuote.project_type || 'N/A'}</div>
                     </div>
                     <div className="bg-gray-50 p-3 rounded-lg">
                       <div className="font-semibold text-gray-700 mb-1 text-sm">Service Level</div>
                       <div className="text-gray-900 break-words text-sm">{selectedQuote.service_level || 'N/A'}</div>
                     </div>
                     <div className="bg-gray-50 p-3 rounded-lg">
                       <div className="font-semibold text-gray-700 mb-1 text-sm">Timeline</div>
                       <div className="text-gray-900 break-words text-sm">{selectedQuote.timeline || 'N/A'}</div>
                     </div>
                     <div className="bg-gray-50 p-3 rounded-lg">
                       <div className="font-semibold text-gray-700 mb-1 text-sm">Total Area</div>
                       <div className="text-gray-900 break-words text-sm">{selectedQuote.total_area || 'N/A'}</div>
                     </div>
                     <div className="bg-gray-50 p-3 rounded-lg">
                       <div className="font-semibold text-gray-700 mb-1 text-sm">Scope of Work</div>
                       <div className="text-gray-900 break-words text-sm">{selectedQuote.service_level || 'N/A'}</div>
                     </div>
                     <div className="bg-gray-50 p-3 rounded-lg">
                       <div className="font-semibold text-gray-700 mb-1 text-sm">Additional Comments</div>
                       <div className="text-gray-900 break-words text-sm">{selectedQuote.additional_comments || 'N/A'}</div>
                     </div>
                   </div>
                   
                   {/* Detailed Quote Data */}
                   {selectedQuote.quote_data && (
  <div className="mt-6">
    <h4 className="text-md font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
      Detailed Quote Data
    </h4>
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Field
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Value
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {Object.entries(
            typeof selectedQuote.quote_data === 'string'
              ? JSON.parse(selectedQuote.quote_data)
              : selectedQuote.quote_data
          ).map(([key, value]) => (
            <tr key={key} className="hover:bg-gray-50">
              <td className="px-4 py-2 font-medium text-gray-700">{key}</td>
              <td className="px-4 py-2 text-gray-900">
                {typeof value === 'object' ? (
                  <pre className="whitespace-pre-wrap text-xs text-gray-600">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                ) : (
                  value?.toString()
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

                 </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Pricing Breakdown
                  </h3>
                  {selectedQuote.pricing_data ? (
                    <div className="space-y-4">
                      {(() => {
                        let pricingData;
                        try {
                          if (selectedQuote.pricing_data) {
                            if (typeof selectedQuote.pricing_data === 'string') {
                              pricingData = JSON.parse(selectedQuote.pricing_data);
                            } else {
                              pricingData = selectedQuote.pricing_data;
                            }
                          } else {
                            pricingData = {};
                          }
                        } catch (error) {
                          console.error('Error parsing pricing data:', error);
                          pricingData = {};
                        }

                        return (
                          <div className="bg-gray-100 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-3 text-sm">Pricing Data</h4>
                            <div className="grid grid-cols-1 gap-2">
                              {Object.entries(pricingData).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-xs border-b border-gray-200 py-1 last:border-b-0">
                                  <span className="text-gray-600 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                  </span>
                                  <span className="font-mono text-gray-800">
                                    {typeof value === 'number' ? `AED ${value.toFixed(2)}` : String(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-yellow-800 text-sm">No pricing data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;
