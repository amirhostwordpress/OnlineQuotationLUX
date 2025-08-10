import React, { useState } from 'react';
import { useQuotation } from '../../context/QuotationContext';
import { User, Phone, MapPin, MessageSquare, FileText, Mail, Palette } from 'lucide-react';

const Step8ContactInfo: React.FC = () => {
  const { data, updateData, submitQuote } = useQuotation();
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUAEPhone = (phone: string): boolean => {
    // UAE phone number patterns: +971-XX-XXXXXXX or 0XX-XXXXXXX or 05X-XXXXXXX
    const phoneRegex = /^(\+971|0)?[25]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateName = (name: string): boolean => {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
  };

  const validateField = (field: string, value: string) => {
    let error = '';
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (!validateName(value)) {
          error = 'Name must be at least 2 characters and contain only letters';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!validateEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'contactNumber':
        if (!value.trim()) {
          error = 'Contact number is required';
        } else if (!validateUAEPhone(value)) {
          error = 'Please enter a valid UAE phone number (e.g., 0501234567 or +971501234567)';
        }
        break;
      case 'designerName':
        if (!value.trim()) {
          error = 'Designer name is required';
        } else if (!validateName(value)) {
          error = 'Designer name must be at least 2 characters and contain only letters';
        }
        break;
      case 'designerEmail':
        if (!value.trim()) {
          error = 'Designer email is required';
        } else if (!validateEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'designerContact':
        if (!value.trim()) {
          error = 'Designer contact number is required';
        } else if (!validateUAEPhone(value)) {
          error = 'Please enter a valid UAE phone number (e.g., 0501234567 or +971501234567)';
        }
        break;
      case 'location':
        if (!value.trim()) {
          error = 'Project location is required';
        }
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleFieldChange = (field: string, value: string) => {
    updateData({ [field]: value } as any);
    if (errors[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: string, value: string) => {
    validateField(field, value);
  };

  const locationOptions = [
    'Dubai',
    'Abu Dhabi', 
    'Sharjah',
    'Ajman',
    'Umm Al Quwain',
    'Ras Al Khaimah',
    'Fujairah'
  ];

  const handleSubmit = async () => {
    setSubmitting(true);
    setNotification(null);
    try {
      await submitQuote();
      setNotification({ type: 'success', message: 'Quote submitted successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to submit quote. Please try again or contact support.' });
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = () => {
    const requiredFields = ['name', 'email', 'contactNumber', 'location', 'designerName', 'designerContact', 'designerEmail'];
    const hasAllRequired = requiredFields.every(field => {
      const value = data[field as keyof typeof data] as string;
      return value && value.trim();
    });
    
    const hasNoErrors = Object.keys(errors).length === 0 || Object.values(errors).every(error => !error);
    
    return hasAllRequired && hasNoErrors;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {notification && (
        <div className={`mb-6 p-4 rounded-lg text-center font-semibold ${notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
          {notification.message}
        </div>
      )}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Step 7 (of 7) - Contact Information
        </h2>
        <p className="text-lg text-gray-600">
          Please provide client details and designer contact information.
        </p>
      </div>

      <div className="space-y-8">
        {/* Client Details Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <User size={24} className="mr-2 text-blue-600" />
            Client Details
          </h3>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="mr-2 text-blue-600" />
                  Client Name *
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  onBlur={(e) => handleBlur('name', e.target.value)}
                  placeholder="Client full name"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="mr-2 text-blue-600" />
                  Client Contact Number *
                </label>
                <input
                  type="tel"
                  value={data.contactNumber}
                  onChange={(e) => handleFieldChange('contactNumber', e.target.value)}
                  onBlur={(e) => handleBlur('contactNumber', e.target.value)}
                  placeholder="0501234567 or +971501234567"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.contactNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="mr-2 text-blue-600" />
                  Client Email Address *
                </label>
                <input
                  type="email"
                  value={data.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  onBlur={(e) => handleBlur('email', e.target.value)}
                  placeholder="client.email@example.com"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="mr-2 text-blue-600" />
                Project Location *
              </label>
              <select
                value={data.location}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                onBlur={(e) => handleBlur('location', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select project location</option>
                {locationOptions.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MessageSquare size={16} className="mr-2 text-blue-600" />
                Additional Comments or Project Details (Optional)
              </label>
              <textarea
                value={data.additionalComments}
                onChange={(e) => updateData({ additionalComments: e.target.value })}
                placeholder="Please share any additional details about the project:
• Current stage of renovation
• Access considerations for installation  
• Special requirements or preferences
• Preferred contact times
• Any other questions or concerns"
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                This information helps us provide the most accurate quote and service.
              </p>
            </div>
          </div>
        </div>

        {/* Designer Details Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Palette size={24} className="mr-2 text-purple-600" />
            Designer Details
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="mr-2 text-purple-600" />
                Designer Name *
              </label>
              <input
                type="text"
                value={data.designerName || ''}
                onChange={(e) => handleFieldChange('designerName', e.target.value)}
                onBlur={(e) => handleBlur('designerName', e.target.value)}
                placeholder="Designer full name"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                  errors.designerName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.designerName && (
                <p className="text-red-500 text-sm mt-1">{errors.designerName}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} className="mr-2 text-purple-600" />
                Designer Contact Number *
              </label>
              <input
                type="tel"
                value={data.designerContact || ''}
                onChange={(e) => handleFieldChange('designerContact', e.target.value)}
                onBlur={(e) => handleBlur('designerContact', e.target.value)}
                placeholder="0501234567 or +971501234567"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                  errors.designerContact ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.designerContact && (
                <p className="text-red-500 text-sm mt-1">{errors.designerContact}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} className="mr-2 text-purple-600" />
                Designer Email Address *
              </label>
              <input
                type="email"
                value={data.designerEmail || ''}
                onChange={(e) => handleFieldChange('designerEmail', e.target.value)}
                onBlur={(e) => handleBlur('designerEmail', e.target.value)}
                placeholder="designer.email@example.com"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                  errors.designerEmail ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.designerEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.designerEmail}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <FileText size={20} className="mr-2" />
          Privacy & Data Protection
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Your personal information is securely stored and will only be used to process your quotation request.</li>
          <li>• We will contact you within 24 hours to discuss your project requirements.</li>
          <li>• Your details will not be shared with third parties without your explicit consent.</li>
          <li>• You can request removal of your data at any time by contacting us.</li>
        </ul>
      </div>

      {/* Special Order/Fabrication Note */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mt-6 mb-2 rounded">
        <strong>Note:</strong> Any special order/fabrication can not be done.
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8">
        <button
                          onClick={() => updateData({ __currentStep: 6 } as unknown as Partial<typeof data>)}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <span>Back</span>
        </button>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid() || submitting}
          className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
            !isFormValid() || submitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
          }`}
        >
          <FileText size={20} />
          <span>{submitting ? 'Submitting...' : 'Generate Quote PDF'}</span>
        </button>
      </div>
    </div>
  );
};

export default Step8ContactInfo;