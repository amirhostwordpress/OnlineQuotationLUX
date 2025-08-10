import React, { useState } from 'react';
import { Mail, Settings, CheckCircle, AlertCircle, Copy } from 'lucide-react';

const EmailSetupGuide: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  const adminTemplate = `Subject: New Quote Request - {{quote_id}} 

🔔 NEW QUOTATION REQUEST RECEIVED

Quote ID: {{quote_id}}
Date: {{date}}

👤 CUSTOMER INFORMATION:
• Name: {{customer_name}}
• Email: {{customer_email}}
• Phone: {{customer_phone}}
• Location: {{customer_location}}

🏗️ PROJECT DETAILS:
• Service Level: {{service_level}}
• Material: {{material_info}}
• Total Amount: {{total_amount}} AED

📝 MESSAGE:
{{message}}

⚡ ACTION REQUIRED:
Please review this quotation request and follow up with the customer within 24 hours.

---
Luxone Quotation System
Automated Notification`;

  const customerTemplate = `Subject: Your Luxone Quotation - {{quote_id}}

Dear {{customer_name}},

Thank you for your interest in Luxone premium worktop solutions!

📋 YOUR QUOTATION DETAILS:
Quote ID: {{quote_id}}
Estimated Investment: {{total_amount}} AED

{{message}}

Best regards,
Luxone Team
www.theluxone.com`;

  const steps = [
    {
      title: 'Create EmailJS Account',
      description: 'Sign up for a free EmailJS account to handle email sending',
      content: (
        <div className="space-y-4">
          <p>1. Go to <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://www.emailjs.com/</a></p>
          <p>2. Click "Sign Up" and create your account</p>
          <p>3. Verify your email address</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800 text-sm">💡 EmailJS allows you to send emails directly from your frontend without a backend server.</p>
          </div>
        </div>
      )
    },
    {
      title: 'Add Email Service',
      description: 'Connect your email provider (Gmail, Outlook, etc.)',
      content: (
        <div className="space-y-4">
          <p>1. In EmailJS dashboard, go to "Email Services"</p>
          <p>2. Click "Add New Service"</p>
          <p>3. Choose your email provider (Gmail recommended)</p>
          <p>4. Follow the authentication steps</p>
          <p>5. Copy your <strong>Service ID</strong></p>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-800 text-sm">⚠️ For Gmail, you'll need to enable 2-factor authentication and create an app password.</p>
          </div>
        </div>
      )
    },
    {
      title: 'Create Email Templates',
      description: 'Set up templates for admin notifications and customer quotes',
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Admin Notification Template</h4>
            <div className="bg-gray-50 p-4 rounded-lg relative">
              <button
                onClick={() => copyToClipboard(adminTemplate, 'admin')}
                className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
                title="Copy template"
              >
                <Copy size={16} />
              </button>
              <pre className="text-sm whitespace-pre-wrap">{adminTemplate}</pre>
            </div>
            {copiedText === 'admin' && (
              <p className="text-green-600 text-sm mt-2">✓ Admin template copied!</p>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-2">Customer Quote Template</h4>
            <div className="bg-gray-50 p-4 rounded-lg relative">
              <button
                onClick={() => copyToClipboard(customerTemplate, 'customer')}
                className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
                title="Copy template"
              >
                <Copy size={16} />
              </button>
              <pre className="text-sm whitespace-pre-wrap">{customerTemplate}</pre>
            </div>
            {copiedText === 'customer' && (
              <p className="text-green-600 text-sm mt-2">✓ Customer template copied!</p>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800 text-sm">
              💡 In EmailJS dashboard, go to "Email Templates" → "Create New Template" and paste these templates.
              Make sure to copy the Template IDs after creating them.<br />
              <strong>⚠️ CRITICAL:</strong> In your EmailJS template settings, you MUST set the "To Email" field to <code>{"{{to_email}}"}</code> for both templates.
              <br />Without this configuration, you will get a "recipients address is empty" error.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Update Configuration',
      description: 'Add your EmailJS credentials to the email service',
      content: (
        <div className="space-y-4">
          <p>Update the following values in <code>src/services/emailService.ts</code>:</p>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <div>const EMAILJS_SERVICE_ID = 'your_service_id';</div>
            <div>const EMAILJS_TEMPLATE_ID_ADMIN = 'admin_template_id';</div>
            <div>const EMAILJS_TEMPLATE_ID_CUSTOMER = 'customer_template_id';</div>
            <div>const EMAILJS_PUBLIC_KEY = 'your_public_key';</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-800 text-sm">
              🔑 Find these values in your EmailJS dashboard:
              <br />• Service ID: In "Email Services"
              <br />• Template IDs: In "Email Templates"
              <br />• Public Key: In "Account" → "General"
              <br />• <strong>⚠️ CRITICAL STEP:</strong> Set "To Email" field to <code>{"{{to_email}}"}</code> in BOTH templates
              <br />• <strong>Common Error:</strong> If you get "recipients address is empty", the "To Email" field is not configured
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Test Integration',
      description: 'Verify that emails are working correctly',
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <p>✅ Submit a test quotation</p>
            <p>✅ Check admin email for notification</p>
            <p>✅ Test "Email Quote" button from quote summary</p>
            <p>✅ Verify customer receives quote email</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 text-sm">
              🎉 Once testing is complete, your automated email system will be fully operational!
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail size={32} className="text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Email System Setup Guide</h1>
        <p className="text-gray-600">Configure automated emails for your quotation system</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                activeStep > index + 1
                  ? 'bg-green-500 text-white'
                  : activeStep === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {activeStep > index + 1 ? <CheckCircle size={20} /> : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  activeStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-600 font-bold">{activeStep}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{steps[activeStep - 1].title}</h2>
            <p className="text-gray-600">{steps[activeStep - 1].description}</p>
          </div>
        </div>

        <div className="mb-8">{steps[activeStep - 1].content}</div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
            disabled={activeStep === 1}
            className={`px-6 py-2 rounded-lg font-medium ${
              activeStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setActiveStep(Math.min(steps.length, activeStep + 1))}
            disabled={activeStep === steps.length}
            className={`px-6 py-2 rounded-lg font-medium ${
              activeStep === steps.length
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {activeStep === steps.length ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Settings size={20} className="mr-2" />
          Quick Reference
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Template Variables</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• {{quote_id}} - Quote ID</li>
              <li>• {{customer_name}} - Customer name</li>
              <li>• {{customer_email}} - Customer email</li>
              <li>• {{total_amount}} - Quote total</li>
              <li>• {{message}} - Email content</li>
              <li>• <strong>{{to_email}} - REQUIRED in "To Email" field</strong></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Email Triggers</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Quote submission → Admin notification</li>
              <li>• "Email Quote" button → Customer email</li>
              <li>• Automatic formatting included</li>
              <li>• Error handling built-in</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-semibold text-red-900 mb-2 flex items-center">
            <AlertCircle size={16} className="mr-2" />
            Common Configuration Error
          </h4>
          <p className="text-red-800 text-sm">
            <strong>Error:</strong> "recipients address is empty"<br />
            <strong>Solution:</strong> In EmailJS dashboard, edit both templates and set the "To Email" field to <code>{"{{to_email}}"}</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailSetupGuide;
