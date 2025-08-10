import React, { useState, useEffect } from 'react';
import { useQuotation } from '../context/QuotationContext';
import { useAdmin } from '../context/AdminContext';
import { generateQuotePDF } from '../utils/pdfGenerator';
import { sendWhatsAppMessage } from '../utils/whatsappService';
import { calculatePricing, PricingBreakdown } from '../utils/pricingCalculator';
import { sendCustomerQuote } from '../services/emailService';
import { 
  CheckCircle, 
  Download, 
  Mail, 
  MessageCircle, 
  User,
  FileText,
  Clock,
  DollarSign,
  Info
} from 'lucide-react';

const QuoteSummary: React.FC = () => {
  const { data, quoteId, resetQuotation } = useQuotation();
  const { settings } = useAdmin();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);

  // Calculate pricing when data or settings change
  useEffect(() => {
    const calculatePricingAsync = async () => {
      try {
        const result = await calculatePricing(data);
        setPricing(result);
      } catch (error) {
        console.error('Error calculating pricing:', error);
      }
    };
    
    calculatePricingAsync();
  }, [data]);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      console.log('QuoteSummary - Settings being passed to PDF:', settings);
      console.log('QuoteSummary - Company Name:', settings.companyName);
      console.log('QuoteSummary - Website:', settings.website);
      console.log('QuoteSummary - Consultant Name:', settings.consultantName);
      await generateQuotePDF(data, quoteId, settings);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleWhatsAppContact = async (phoneNumber: string) => {
    if (!pricing) return;
    
    const message = `Hi! I've submitted a quote request with ID: ${quoteId}.

Project Details:
• Service: ${getServiceLevelText(data.serviceLevel)}
• Material: ${getMaterialInfo()}
• Layout: ${getLayoutText(data.worktopLayout)}
• Area: ${pricing.totalSqm.toFixed(2)} m²
• Location: ${data.location}
• Timeline: ${getTimelineText(data.timeline)}
• Total Quote: AED ${pricing.grandTotal.toLocaleString()}

I'd like to discuss my project requirements and proceed with the next steps.`;
    sendWhatsAppMessage(phoneNumber, message);
  };

  const handleEmailQuote = async () => {
    if (!data.email) {
      alert('Email address is required to send the quote. Please contact us directly.');
      return;
    }

    setIsSendingEmail(true);
    setEmailStatus('idle');

    try {
      const emailSent = await sendCustomerQuote(data, quoteId, settings);
      if (emailSent) {
        setEmailStatus('success');
        alert('Quote has been sent to your email address successfully!');
      } else {
        setEmailStatus('error');
        alert('Failed to send email. Please try again or contact us directly.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailStatus('error');
      alert('Failed to send email. Please try again or contact us directly.');
    } finally {
      setIsSendingEmail(false);
    }
  };
  const getServiceLevelText = (level: string) => {
    switch (level) {
      case 'fabrication': return 'Fabrication Only';
      case 'fabrication-delivery': return 'Fabrication & Delivery';
      case 'fabrication-delivery-installation': return 'Fabrication, Delivery & Installation';
      default: return level;
    }
  };

  const getMaterialInfo = () => {
    if (data.otherMaterialType || data.otherMaterialColor) {
      return `Other Material: ${data.otherMaterialType || ''}${data.otherMaterialType && data.otherMaterialColor ? ', ' : ''}${data.otherMaterialColor || ''}`;
    }
    
    // Handle new multi-product structure
    if (data.selectedProducts && data.selectedProducts.length > 0) {
      const materialInfo = data.selectedProducts.map(product => {
        const materialSource = product.materialSource === 'luxone' ? 'Luxone Material' :
                              product.materialSource === 'yourself' ? 'Client Supplied' :
                              product.materialSource === 'luxone-others' ? 'Luxone Others' : 'Not Selected';
        
        return `${product.productType} (${materialSource})`;
      }).join(', ');
      
      return materialInfo;
    }
    
    // Fallback to legacy structure
    if (data.materialSource === 'luxone') {
      return `${data.materialType === 'quartz' ? 'Luxone Quartz' : 'Luxone Porcelain'}`;
    } else if (data.materialSource === 'yourself') {
      return `Customer Supplied Material - ${data.slabSize || 'Size TBC'}, ${data.thickness || 'Thickness TBC'}, ${data.finish || 'Finish TBC'}`;
    } else if (data.materialSource === 'luxone-others') {
      return `${data.brandSupplier || 'Brand TBC'} - ${data.luxoneOthersColorName || 'Color TBC'}`;
    }
    return 'Material TBC';
  };

  const getLayoutText = (layout: string) => {
    const layouts = {
      'u-island': 'U + Island',
      'u-shape': 'U Shape',
      'l-island': 'L + Island', 
      'l-shape': 'L Shape',
      'galley': '2 Pieces (Galley)',
      '1-piece': '1 Piece',
      'custom': 'Custom'
    };
    return layouts[layout as keyof typeof layouts] || layout;
  };

  const getTimelineText = (timeline: string) => {
    switch (timeline) {
      case 'asap-2weeks': return 'ASAP to 2 Weeks';
      case '3-6weeks': return '3 to 6 Weeks';  
      case '6weeks-plus': return '6 Weeks or more';
      default: return timeline;
    }
  };



  // Show loading state if pricing is not calculated yet
  if (!pricing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Calculating pricing...</p>
        </div>
      </div>
    );
  }

  const usdPrice = pricing.grandTotal / (settings.aedToUsdRate || 3.67);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center justify-center text-center space-y-2">
  <img
    src="https://theluxone.com/wp-content/uploads/2025/06/cropped-Luxone_HQ-1.png" // <-- replace with your actual logo path
    alt="Company Logo"
    className="w-20 h-20 object-contain"
  />
  </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Luxone Stone</h1>
                <p className="text-sm text-gray-600">Quote Summary</p>
              </div>
            </div>
            <button
              onClick={resetQuotation}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              New Quote
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Quote Request Submitted!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your detailed requirements. Here's your personalized quotation.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-medium">
                📧 Email notifications sent successfully!
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Quotation ID</h3>
              <p className="text-2xl font-bold text-blue-700 mb-2">{quoteId}</p>
              <p className="text-sm text-blue-600">Please reference this ID in all communications</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Quote Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detailed Quotation */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText size={24} className="mr-2 text-blue-600" />
                Detailed Quotation
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Professional Estimate</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1"><strong>Scope of Work:</strong></p>
                    <p className="text-gray-900 mb-3">{getServiceLevelText(data.serviceLevel)}</p>
                    
                    <p className="text-gray-600 mb-1"><strong>Material:</strong></p>
                    <p className="text-gray-900 mb-3">{getMaterialInfo()}</p>
                    
                    <p className="text-gray-600 mb-1"><strong>Color:</strong></p>
                    <p className="text-gray-900 mb-3">
                      {(() => {
                        // Handle new multi-product structure
                        if (data.selectedProducts && data.selectedProducts.length > 0) {
                          const colors = data.selectedProducts
                            .map(product => product.materialColor)
                            .filter(color => color && color.trim() !== '')
                            .join(', ');
                          return colors || 'TBC';
                        }
                        // Fallback to legacy structure
                        return data.materialColor || data.luxoneOthersColorName || 'TBC';
                      })()}
                    </p>
                    
                    <p className="text-gray-600 mb-1"><strong>Layout:</strong></p>
                    <p className="text-gray-900">{data.worktopLayout ? getLayoutText(data.worktopLayout) : 'TBC'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1"><strong>Estimated Area:</strong></p>
                    <p className="text-gray-900 mb-3">{pricing.totalSqm.toFixed(2)} m²</p>
                    
                    <p className="text-gray-600 mb-1"><strong>Timeline:</strong></p>
                    <p className="text-gray-900 mb-3">{getTimelineText(data.timeline)}</p>
                    
                    <p className="text-gray-600 mb-1"><strong>Project Type:</strong></p>
                    <p className="text-gray-900 mb-3">{data.projectType}</p>
                    
                    <p className="text-gray-600 mb-1"><strong>Add-On Services:</strong></p>
                    <p className="text-gray-900 mb-3">
                      {(() => {
                        const services = [];
                        if (data.buttJointPolish) services.push('Butt Joint & Polish');
                        if (data.customEdgeAddon) services.push('Custom Edge');
                        if (data.hobCutOutAddon) services.push('Hob Cut Out');
                        if (data.drainGroovesAddon) services.push('Drain Grooves');
                        if (data.smallHoles && data.smallHoles > 0) services.push(`Small Holes: ${data.smallHoles} holes`);
                        return services.length > 0 ? services.join(', ') : 'None selected';
                      })()}
                    </p>
                    
                    <p className="text-gray-600 mb-1"><strong>Sink Selection:</strong></p>
                    <p className="text-gray-900 mb-3">
                      {data.sinkCategory ? (
                        <>
                          {data.sinkCategory === 'luxone' && 'Sink Provided by Luxone'}
                          {data.sinkCategory === 'client' && (
                            data.sinkType === 'top-mounted'
                              ? 'Sink Provided by Client - Top Mounted Sink'
                              : data.sinkType === 'under-mounted'
                              ? 'Sink Provided by Client - Under Mounted Sink'
                              : 'Sink Provided by Client'
                          )}
                        </>
                      ) : 'No sink selected'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-blue-100 mb-1">Quotation ID:</p>
                    <p className="font-bold">{quoteId}</p>
                  </div>
                  <DollarSign size={32} className="text-blue-200" />
                </div>
                
                <div className="border-t border-blue-400 pt-4">
                  <p className="text-blue-100 mb-2">
                    {getServiceLevelText(data.serviceLevel)}:
                  </p>
                  <p className="text-blue-100 text-sm mb-4">Including all selected features and options</p>
                  
                  <div className="text-center">
                    <p className="text-3xl font-bold mb-2">{pricing.grandTotal.toLocaleString()} AED</p>
                    <p className="text-blue-200 text-sm mb-2">Including VAT</p>
                    <p className="text-lg">≈ ${usdPrice.toFixed(0)} USD</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Breakdown */}
            {data.selectedProducts && data.selectedProducts.length > 0 && pricing.productBreakdown && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FileText size={24} className="mr-2 text-blue-600" />
                  Product Breakdown
                </h3>
                <div className="space-y-4">
                  {Object.entries(pricing.productBreakdown).map(([productId, breakdown]) => (
                    <div key={productId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {breakdown.productType} × {breakdown.quantity}
                        </h4>
                        <span className="text-sm text-gray-600">
                          {breakdown.area.toFixed(2)} m²
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Material Cost:</span>
                          <span className="ml-2 font-medium">AED {breakdown.materialCost.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Processing:</span>
                          <span className="ml-2 font-medium">AED {breakdown.processingCost.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="ml-2 font-semibold text-blue-600">AED {breakdown.totalCost.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Details */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <User size={24} className="mr-2 text-blue-600" />
                Customer Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 mb-1"><strong>Name:</strong></p>
                  <p className="text-gray-900 mb-3">{data.name}</p>
                  
                  <p className="text-gray-600 mb-1"><strong>Phone:</strong></p>
                  <p className="text-gray-900">{data.contactNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1"><strong>Location:</strong></p>
                  <p className="text-gray-900">{data.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="space-y-4">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Download size={20} />
                  <span>{isGeneratingPDF ? 'Generating...' : 'Download Quote PDF'}</span>
                </button>
                
                <button 
                  onClick={handleEmailQuote}
                  disabled={isSendingEmail || !data.email}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                    !data.email 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : emailStatus === 'success'
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : emailStatus === 'error'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Mail size={20} />
                  <span>
                    {isSendingEmail 
                      ? 'Sending...' 
                      : emailStatus === 'success'
                      ? 'Email Sent ✓'
                      : emailStatus === 'error'
                      ? 'Failed - Retry'
                      : !data.email
                      ? 'Email Required'
                      : 'Email Quote'
                    }
                  </span>
                </button>
                
                {!data.email && (
                  <p className="text-sm text-gray-500 text-center">
                    Email address is required to send quotes electronically
                  </p>
                )}
              </div>
            </div>

            {/* WhatsApp Contact */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MessageCircle size={20} className="mr-2 text-green-600" />
                💬 Instant Communication via WhatsApp
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Get instant responses to your questions! Choose your preferred contact method below.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleWhatsAppContact(settings.whatsappIndia || '+919648555355')}
                  className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle size={20} />
                  <span>WhatsApp India ({settings.whatsappIndia || '+91 96485 55355'})</span>
                </button>
                
                <button
                  onClick={() => handleWhatsAppContact(settings.whatsappUAE || '+971585815601')}
                  className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle size={20} />
                  <span>WhatsApp UAE ({settings.whatsappUAE || '+971 58 581 5601'})</span>
                </button>
              </div>
            </div>

            {/* Email Notifications */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                <Mail size={20} className="mr-2" />
                📧 Email Notifications Sent
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• A detailed quotation confirmation has been sent to: {data.email || 'Email not provided'}</li>
                <li>• Our admin team has been notified of your request</li>
                <li>• You will receive a confirmation call within 24 hours</li>
                {data.email && <li>• Check your spam folder if you don't see the email</li>}
                {!data.email && <li>• Use the "Email Quote" button above to receive your quote via email</li>}
              </ul>
            </div>

            {/* Important Information */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-yellow-900 mb-4 flex items-center">
                <Info size={20} className="mr-2" />
                Important Information
              </h3>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li>• This is a preliminary estimate based on your specifications</li>
                <li>• <strong>Actual quote will be shared upon final site measurements</strong></li>
                <li>• Template creation and precise measurements may affect the final cost</li>
                <li>• Installation costs are included in the quoted price</li>
                <li>• All prices are in UAE Dirhams (AED) and include VAT</li>
              </ul>
            </div>

            {/* What's Next */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Clock size={20} className="mr-2 text-blue-600" />
                What happens next?
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Our team will contact you within 24 hours to discuss your project</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>We'll arrange a convenient time for a professional site survey</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Precise measurements and template creation will be scheduled</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Final quote confirmation and installation timeline will be provided</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteSummary;