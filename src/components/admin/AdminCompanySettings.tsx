import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Edit, 
  Save, 
  X, 
  Building,
  User,
  Phone,
  MapPin,
  Percent,
  Mail,
  Plus,
  Trash2
} from 'lucide-react';
import { apiRequest } from '../../utils/apiUtils';
import { useAuth } from '../../context/AuthContext';
import { 
  fetchAllAdminCompanySettings, 
  updateAdminCompanySettings, 
  createCompanySettings,
  type CompanySettings,
  type AdminCompanySettings as AdminCompanySettingsType
} from '../../services/adminCompanySettingsService';

// Use types from service
type CompanySettings = CompanySettings;
type AdminCompanySettings = AdminCompanySettingsType;

const AdminCompanySettings: React.FC = () => {
  const { user } = useAuth();
  const [adminSettings, setAdminSettings] = useState<AdminCompanySettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingSettings, setEditingSettings] = useState<Partial<CompanySettings>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSettings, setNewSettings] = useState<Partial<CompanySettings>>({});

  useEffect(() => {
    // Check if user is super admin
    if (user?.role !== 'super_admin') {
      setMessage({ type: 'error', text: 'Access denied. Super admin privileges required.' });
      return;
    }
    
    fetchAdminSettings();
  }, [user]);

  const fetchAdminSettings = async () => {
    try {
      setLoading(true);
      const response = await fetchAllAdminCompanySettings();
      setAdminSettings(response);
    } catch (error) {
      console.error('Error fetching admin settings:', error);
      setMessage({ type: 'error', text: 'Failed to fetch admin settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (settings: AdminCompanySettings) => {
    setEditingId(settings.admin_user_id);
    setEditingSettings({
      company_name: settings.company_name,
      manager_name: settings.manager_name,
      sales_contact_name: settings.sales_contact_name,
      mobile_number: settings.mobile_number,
      address: settings.address,
      margin_rate: settings.margin_rate,
      email: settings.email,
      website: settings.website,
      logo_url: settings.logo_url
    });
  };

  const handleSave = async () => {
    if (!editingId) return;

    // Check if user is super admin
    if (user?.role !== 'super_admin') {
      setMessage({ type: 'error', text: 'Access denied. Super admin privileges required.' });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      console.log('Sending company settings update:', {
        adminId: editingId,
        data: editingSettings,
        currentUser: user
      });

      await updateAdminCompanySettings(editingId, editingSettings);

      setMessage({ type: 'success', text: 'Settings updated successfully!' });
      setEditingId(null);
      setEditingSettings({});
      fetchAdminSettings();
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage({ type: 'error', text: 'Failed to update settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddNew = async () => {
    try {
      setSaving(true);
      setMessage(null);

      await createCompanySettings(newSettings);

      setMessage({ type: 'success', text: 'New company settings added successfully!' });
      setShowAddForm(false);
      setNewSettings({});
      fetchAdminSettings();
    } catch (error) {
      console.error('Error adding settings:', error);
      setMessage({ type: 'error', text: 'Failed to add settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingSettings({});
    setShowAddForm(false);
    setNewSettings({});
  };

  const handleInputChange = (field: string, value: any, isNew = false) => {
    if (isNew) {
      setNewSettings(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setEditingSettings(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Check if user is super admin
  if (user?.role !== 'super_admin') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">Access Denied</div>
            <div className="text-gray-600">Super admin privileges required to access this feature.</div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading admin settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Admin Company Settings</h2>
        <div className="flex space-x-2">
          <button
            onClick={fetchAdminSettings}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Settings size={16} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
          >
            <Plus size={16} />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Add New Form */}
      {showAddForm && (
        <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Company Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                value={newSettings.company_name || ''}
                onChange={(e) => handleInputChange('company_name', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manager Name *
              </label>
              <input
                type="text"
                value={newSettings.manager_name || ''}
                onChange={(e) => handleInputChange('manager_name', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter manager name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sales Contact Name *
              </label>
              <input
                type="text"
                value={newSettings.sales_contact_name || ''}
                onChange={(e) => handleInputChange('sales_contact_name', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter sales contact name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                value={newSettings.mobile_number || ''}
                onChange={(e) => handleInputChange('mobile_number', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter mobile number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={newSettings.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Margin Rate (%) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={newSettings.margin_rate || ''}
                onChange={(e) => handleInputChange('margin_rate', parseFloat(e.target.value) || 0, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter margin rate"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                value={newSettings.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value, true)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter company address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                value={newSettings.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter website URL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo URL
              </label>
              <input
                type="url"
                value={newSettings.logo_url || ''}
                onChange={(e) => handleInputChange('logo_url', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter logo URL"
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleAddNew}
              disabled={saving}
              className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Save size={16} />
              <span>{saving ? 'Adding...' : 'Add Settings'}</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {adminSettings.map((settings) => (
          <div key={settings.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Building size={20} className="text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{settings.admin_name}</h3>
                  <p className="text-sm text-gray-600">{settings.admin_email}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    settings.admin_role === 'super_admin' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {settings.admin_role}
                  </span>
                </div>
              </div>
              {editingId === settings.admin_user_id ? (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    <Save size={14} />
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-1 bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                  >
                    <X size={14} />
                    <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit(settings)}
                  className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {editingId === settings.admin_user_id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={editingSettings.company_name || ''}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manager Name
                    </label>
                    <input
                      type="text"
                      value={editingSettings.manager_name || ''}
                      onChange={(e) => handleInputChange('manager_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sales Contact Name
                    </label>
                    <input
                      type="text"
                      value={editingSettings.sales_contact_name || ''}
                      onChange={(e) => handleInputChange('sales_contact_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={editingSettings.mobile_number || ''}
                      onChange={(e) => handleInputChange('mobile_number', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingSettings.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Margin Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={editingSettings.margin_rate || ''}
                      onChange={(e) => handleInputChange('margin_rate', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={editingSettings.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      value={editingSettings.logo_url || ''}
                      onChange={(e) => handleInputChange('logo_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={editingSettings.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Building size={16} className="text-gray-400" />
                  <span className="text-gray-600">Company:</span>
                  <span className="font-medium">{settings.company_name || 'Not set'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-400" />
                  <span className="text-gray-600">Manager:</span>
                  <span className="font-medium">{settings.manager_name || 'Not set'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-400" />
                  <span className="text-gray-600">Sales Contact:</span>
                  <span className="font-medium">{settings.sales_contact_name || 'Not set'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-600">Mobile:</span>
                  <span className="font-medium">{settings.mobile_number || 'Not set'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{settings.email || 'Not set'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Percent size={16} className="text-gray-400" />
                  <span className="text-gray-600">Margin Rate:</span>
                  <span className="font-medium">{settings.margin_rate ? `${settings.margin_rate}%` : 'Not set'}</span>
                </div>
                {settings.address && (
                  <div className="flex items-start space-x-2 md:col-span-2">
                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium">{settings.address}</span>
                  </div>
                )}
                {settings.website && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Website:</span>
                    <span className="font-medium">{settings.website}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {adminSettings.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No admin company settings found.
        </div>
      )}
    </div>
  );
};

export default AdminCompanySettings;
