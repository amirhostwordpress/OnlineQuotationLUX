import emailjs from 'emailjs-com';

// EmailJS configuration - you'll need to set these up in EmailJS dashboard
const EMAILJS_SERVICE_ID = 'service_m3rmp0k'; // Gmail, Outlook, etc.
const EMAILJS_TEMPLATE_ID_ADMIN = 'template_bzpwkid'; // Replace with your actual admin template ID
const EMAILJS_TEMPLATE_ID_CUSTOMER = 'template_ihj0qk8'; // Replace with your actual customer template ID

const EMAILJS_PUBLIC_KEY = 'conH9eABYoW0pvDMk';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export interface EmailData {
  to_email: string;
  to_name: string;
  from_name: string;
  subject: string;
  message: string;
  quote_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_location: string;
  service_level: string;
  material_info: string;
  total_amount: string;
  quote_details: string;
  [key: string]: string;
}

export const sendAdminNotification = async (quoteData: any, quoteId: string, settings: any): Promise<boolean> => {
  try {
    // Get admin email from settings or use default
    const adminEmail = settings?.adminEmail || 'admin@theluxone.com';
    
    // Validate admin email exists
    if (!adminEmail || adminEmail.trim() === '') {
      console.error('Admin email is not configured');
      return false;
    }

    const totalAmount = await calculateTotalAmount(quoteData, settings);

    const emailData: EmailData = {
      to_email: adminEmail,
      to_name: 'Luxone Admin',
      from_name: 'Luxone Quotation System',
      subject: `New Quote Request - ${quoteId}`,
      message: generateAdminEmailContent(quoteData, quoteId),
      quote_id: quoteId,
      customer_name: quoteData.name || 'N/A',
      customer_email: quoteData.email || 'N/A',
      customer_phone: quoteData.contactNumber || 'N/A',
      customer_location: quoteData.location || 'N/A',
      service_level: getServiceLevelText(quoteData.serviceLevel),
      material_info: getMaterialInfo(quoteData),
      total_amount: totalAmount,
      quote_details: generateQuoteDetailsText(quoteData)
    };

    console.log('Sending admin notification to:', adminEmail);
    console.log('Email data:', emailData);

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_ADMIN,
      emailData
    );

    console.log('Admin notification sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    return false;
  }
};

export const sendCustomerQuote = async (quoteData: any, quoteId: string, settings: any): Promise<boolean> => {
  try {
    if (!quoteData.email) {
      console.error('❌ Customer email is missing from quote data');
      throw new Error('Customer email is required to send quote');
    }

    const totalAmount = await calculateTotalAmount(quoteData, settings);

    const emailData: EmailData = {
      to_email: quoteData.email,
      to_name: quoteData.name || 'Valued Customer',
      from_name: 'Luxone Team',
      subject: `Your Luxone Quotation - ${quoteId}`,
      message: generateCustomerEmailContent(quoteData, quoteId, settings),
      quote_id: quoteId,
      customer_name: quoteData.name || 'N/A',
      customer_email: quoteData.email,
      customer_phone: quoteData.contactNumber || 'N/A',
      customer_location: quoteData.location || 'N/A',
      service_level: getServiceLevelText(quoteData.serviceLevel),
      material_info: getMaterialInfo(quoteData),
      total_amount: totalAmount,
      quote_details: generateQuoteDetailsText(quoteData)
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_CUSTOMER,
      emailData
    );

    console.log('Customer quote sent successfully:', response);
    return true;
  } catch (error) {
    console.error('❌ Failed to send customer quote:', error);
    
    // Provide specific guidance for common EmailJS errors
    if (error && typeof error === 'object' && 'status' in error) {
      const emailError = error as { status: number; text: string };
      
      if (emailError.status === 422 && emailError.text?.includes('recipients address is empty')) {
        console.error(`
🔧 CONFIGURATION ERROR: EmailJS Template Not Configured Properly

The error indicates your EmailJS template is missing the recipient configuration.

TO FIX THIS:
1. Go to your EmailJS dashboard (https://dashboard.emailjs.com/)
2. Navigate to "Email Templates"
3. Find your customer template (ID: ${EMAILJS_TEMPLATE_ID_CUSTOMER})
4. In the template settings, set the "To Email" field to: {{to_email}}
5. Save the template

This tells EmailJS to use the email address provided by the application.
        `);
        throw new Error('EmailJS template configuration error: Please set "To Email" field to {{to_email}} in your customer template');
      }
    }
    
    throw error;
    return false;
  }
};

const generateAdminEmailContent = (data: any, quoteId: string): string => {
  return `
🔔 NEW QUOTATION REQUEST RECEIVED

Quote ID: ${quoteId}
Date: ${new Date().toLocaleString()}

👤 CUSTOMER INFORMATION:
• Name: ${data.name || 'N/A'}
• Email: ${data.email || 'N/A'}
• Phone: ${data.contactNumber || 'N/A'}
• Location: ${data.location || 'N/A'}

🏗️ PROJECT DETAILS:
• Service Level: ${getServiceLevelText(data.serviceLevel)}
• Material: ${getMaterialInfo(data)}
• Layout: ${getLayoutText(data.worktopLayout)}
• Timeline: ${getTimelineText(data.timeline)}
• Project Type: ${data.projectType || 'N/A'}

💰 ESTIMATED VALUE:
${calculateTotalAmount(data, {})} AED

📝 ADDITIONAL COMMENTS:
${data.additionalComments || 'None provided'}

⚡ ACTION REQUIRED:
Please review this quotation request and follow up with the customer within 24 hours.

Access Admin Panel: ${window.location.origin}/admin/dashboard

---
Luxone Quotation System
Automated Notification
  `;
};

const generateCustomerEmailContent = (data: any, quoteId: string, settings: any): string => {
  return `
Dear ${data.name || 'Valued Customer'},

Thank you for your interest in Luxone premium worktop solutions! We have received your quotation request and are excited to help bring your vision to life.

📋 YOUR QUOTATION DETAILS:
Quote ID: ${quoteId}
Date: ${new Date().toLocaleDateString()}

🏗️ PROJECT SUMMARY:
• Service: ${getServiceLevelText(data.serviceLevel)}
• Material: ${getMaterialInfo(data)}
• Layout: ${getLayoutText(data.worktopLayout)}
• Timeline: ${getTimelineText(data.timeline)}
• Location: ${data.location}
• Estimated Area: ${calculateArea(data)} m²

💰 ESTIMATED INVESTMENT:
${calculateTotalAmount(data, settings)} AED (Including VAT)

⏰ WHAT HAPPENS NEXT:
1. Our expert team will review your specifications
2. We'll contact you within 24 hours to discuss details
3. A site survey will be arranged at your convenience
4. Final measurements and quote confirmation
5. Professional installation by our certified team

📞 IMMEDIATE ASSISTANCE:
For urgent inquiries, contact us via WhatsApp:
• UAE: ${settings.whatsappUAE || '+971 58 581 5601'}
• India: ${settings.whatsappIndia || '+91 96485 55355'}

📧 Questions? Simply reply to this email.

Thank you for choosing Luxone - where premium quality meets exceptional service.

Best regards,
${settings.consultantName || 'Ahmed Al-Rashid'}
Sales Consultant
Luxone Premium Worktop Solutions

📍 ${settings.address || 'Dubai, UAE'}
🌐 ${settings.website || 'www.theluxone.com'}
📧 ${settings.consultantEmail || 'ahmed@theluxone.com'}

---
This is an automated message from our quotation system.
Quote ID: ${quoteId} | Generated: ${new Date().toLocaleString()}
  `;
};

const getServiceLevelText = (level: string): string => {
  switch (level) {
    case 'fabrication': return 'Fabrication Only';
    case 'fabrication-delivery': return 'Fabrication & Delivery';
    case 'fabrication-delivery-installation': return 'Fabrication, Delivery & Installation';
    default: return level || 'TBC';
  }
};

const getMaterialInfo = (data: any): string => {
  if (data.materialSource === 'luxone') {
    return `${data.materialType === 'quartz' ? 'Luxone Quartz' : 'Luxone Porcelain'} - ${data.materialColor || 'Color TBC'}`;
  } else if (data.materialSource === 'yourself') {
    return 'Customer Supplied Material';
  } else if (data.materialSource === 'luxone-others') {
    return `${data.brandSupplier || 'Brand TBC'} - ${data.luxoneOthersColorName || 'Color TBC'}`;
  }
  return 'Material TBC';
};

const getLayoutText = (layout: string): string => {
  const layouts = {
    'u-island': 'U Shape + Island',
    'u-shape': 'U Shape',
    'l-island': 'L Shape + Island', 
    'l-shape': 'L Shape',
    'galley': '2 Pieces (Galley)',
    '1-piece': '1 Piece',
    'custom': 'Custom Layout'
  };
  return layouts[layout as keyof typeof layouts] || layout || 'TBC';
};

const getTimelineText = (timeline: string): string => {
  switch (timeline) {
    case 'asap-2weeks': return 'ASAP to 2 Weeks';
    case '3-6weeks': return '3 to 6 Weeks';  
    case '6weeks-plus': return '6 Weeks or more';
    default: return timeline || 'TBC';
  }
};

const generateQuoteDetailsText = (data: any): string => {
  const pieces = Object.entries(data.pieces || {}).filter(([_, piece]: [string, any]) => 
    piece && piece.length && piece.width
  );
  
  let details = `Project Specifications:\n`;
  details += `• Layout: ${getLayoutText(data.worktopLayout)}\n`;
  details += `• Material: ${getMaterialInfo(data)}\n`;
  details += `• Service: ${getServiceLevelText(data.serviceLevel)}\n`;
  details += `• Timeline: ${getTimelineText(data.timeline)}\n`;
  
  if (pieces.length > 0) {
    details += `\nDimensions:\n`;
    pieces.forEach(([letter, piece]: [string, any]) => {
      details += `• Piece ${letter}: ${piece.length}m x ${piece.width}m x 20mm\n`;
    });
  }
  
  if (data.sinkCategory) {
    if (data.sinkCategory === 'luxone') {
      details += `\nSink: Customised sink by luxone\n`;
    } else if (data.sinkCategory === 'client') {
      if (data.sinkType === 'top-mounted') {
        details += `\nSink: Top mount as per selection sink by client\n`;
      } else if (data.sinkType === 'under-mounted') {
        details += `\nSink: Under mount as per selection sink by client\n`;
      }
    }
  }
  
  if (data.additionalComments) {
    details += `\nSpecial Requirements:\n${data.additionalComments}\n`;
  }
  
  return details;
};

const calculateArea = (data: any): string => {
  const pieces = Object.values(data.pieces || {}).filter((piece: any) => 
    piece && piece.length && piece.width
  );
  
  if (pieces.length === 0) return 'TBC';
  
  const totalAreaM2 = pieces.reduce((total: number, piece: any) => {
    const length = parseFloat(piece.length) || 0;
    const width = parseFloat(piece.width) || 0;
    return total + (length * width);
  }, 0);
  
  return totalAreaM2.toFixed(2);
};

const calculateTotalAmount = async (data: any, settings: any): Promise<string> => {
  try {
    // Import the pricing calculator
    const { calculatePricing } = await import('../utils/pricingCalculator');
    const pricing = await calculatePricing(data, settings.costRules);
    return pricing.grandTotal.toLocaleString();
  } catch (error) {
    console.error('Error calculating total amount for email:', error);
    return 'TBC - Requires site survey';
  }
};

// Email configuration setup guide
export const getEmailSetupInstructions = (): string => {
  return `
📧 EMAIL SETUP INSTRUCTIONS:

1. Create EmailJS Account:
   • Go to https://www.emailjs.com/
   • Sign up for a free account
   • Create a new service (Gmail, Outlook, etc.)

2. Create Email Templates:
   • Template 1: Admin Notification
   • Template 2: Customer Quote

3. Update Configuration:
   • Replace EMAILJS_SERVICE_ID with your service ID
   • Replace EMAILJS_TEMPLATE_ID_ADMIN with admin template ID
   • Replace EMAILJS_TEMPLATE_ID_CUSTOMER with customer template ID
   • Replace EMAILJS_PUBLIC_KEY with your public key

4. Template Variables to Use:
   {{to_email}}, {{to_name}}, {{from_name}}, {{subject}}, {{message}},
   {{quote_id}}, {{customer_name}}, {{customer_email}}, {{customer_phone}},
   {{customer_location}}, {{service_level}}, {{material_info}}, {{total_amount}}

5. Test the Integration:
   • Submit a test quote
   • Check admin email for notification
   • Test customer email from quote summary
  `;
};