import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Package, 
  Scissors, 
  Wrench, 
  Truck, 
  Calculator,
  TrendingUp,
  FileText,
  Eye,
  Download,
  X
} from 'lucide-react';
import { apiRequest } from '../../utils/apiUtils';
import { useAuth } from '../../context/AuthContext';
import { findMaterialByName, getMaterialPrice } from '../../utils/materialData';

interface QuotationCostBreakdown {
  id: number;
  quote_id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  total_area: number;
  serviceLevel?: string;
  pricing_data: {
    materialCost: number;
    cutting: number;
    topPolishing: number;
    polishing: number;
    buttJointPolish: number;
    customEdge: number;
    hobCutOut: number;
    drainGrooves: number;
    smallHoles: number;
    sinkCost: number;
    installation: number;
    delivery: number;
    subtotal: number;
    margin: number;
    subtotalWithMargin: number;
    vat: number;
    grandTotal: number;
    totalSqm: number;
    slabsRequired: number;
    productBreakdown: {
      [productId: string]: {
        productType: string;
        quantity: number;
        area: number;
        materialCost: number;
        processingCost: number;
        totalCost: number;
      };
    };
  };
  created_at: string;
  status: string;
}

interface CostCategory {
  name: string;
  items: {
    label: string;
    value: number;
    description: string;
    icon: React.ReactNode;
  }[];
  total: number;
  color: string;
}

const QuotationCostBreakdown: React.FC = () => {
  const { user } = useAuth();
  const [quotations, setQuotations] = useState<QuotationCostBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationCostBreakdown | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/quotations');
      setQuotations(response || []);
    } catch (error) {
      console.error('Error fetching quotations:', error);
      setMessage({ type: 'error', text: 'Failed to fetch quotations' });
    } finally {
      setLoading(false);
    }
  };

    const getCostCategories = (pricing: any, serviceLevel?: string): CostCategory[] => {
    const categories: CostCategory[] = [
      {
        name: 'Material Costs',
        color: 'bg-blue-50 border-blue-200',
        items: [
          {
            label: 'Material Cost',
            value: pricing.materialCost || 0,
            description: 'Base material cost',
            icon: <Package className="w-4 h-4" />
          }
        ],
        total: pricing.materialCost || 0
      }
    ];

    // Basic Processing Costs - ONLY for "Fabrication, Delivery & Installation"
    if (serviceLevel === 'fabrication-delivery-installation' && 
        ((pricing.cutting || 0) + (pricing.topPolishing || 0) + (pricing.polishing || 0)) > 0) {
      categories.push({
        name: 'Basic Processing Costs',
        color: 'bg-green-50 border-green-200',
        items: [
          {
            label: 'Cutting',
            value: pricing.cutting || 0,
            description: 'Cutting and shaping (40 AED/sqm)',
            icon: <Scissors className="w-4 h-4" />
          },
          {
            label: 'Top Polishing/Mitred',
            value: pricing.topPolishing || 0,
            description: 'Top surface polishing (80 AED/sqm)',
            icon: <TrendingUp className="w-4 h-4" />
          },
          {
            label: 'Polishing',
            value: pricing.polishing || 0,
            description: 'General polishing (40 AED/sqm)',
            icon: <TrendingUp className="w-4 h-4" />
          }
        ],
        total: (pricing.cutting || 0) + (pricing.topPolishing || 0) + (pricing.polishing || 0)
      });
    }

    // Optional Add-on Services - ONLY for "Fabrication, Delivery & Installation"
    if (serviceLevel === 'fabrication-delivery-installation' && 
        ((pricing.buttJointPolish || 0) + (pricing.customEdge || 0) + 
         (pricing.hobCutOut || 0) + (pricing.drainGrooves || 0) + (pricing.smallHoles || 0)) > 0) {
      categories.push({
        name: 'Optional Add-on Services',
        color: 'bg-purple-50 border-purple-200',
        items: [
          {
            label: 'Butt Joint & Polish',
            value: pricing.buttJointPolish || 0,
            description: 'Butt joint polishing (50 AED/sqm)',
            icon: <Wrench className="w-4 h-4" />
          },
          {
            label: 'Custom Edge',
            value: pricing.customEdge || 0,
            description: 'Custom edge treatment (200 AED fixed)',
            icon: <Wrench className="w-4 h-4" />
          },
          {
            label: 'Hob Cut Out',
            value: pricing.hobCutOut || 0,
            description: 'Hob cut out service (100 AED fixed)',
            icon: <Scissors className="w-4 h-4" />
          },
          {
            label: 'Drain Grooves',
            value: pricing.drainGrooves || 0,
            description: 'Drain grooves (250 AED fixed)',
            icon: <Wrench className="w-4 h-4" />
          },
          {
            label: 'Small Holes',
            value: pricing.smallHoles || 0,
            description: 'Small holes drilling (25 AED per hole)',
            icon: <Scissors className="w-4 h-4" />
          }
        ],
        total: (pricing.buttJointPolish || 0) + (pricing.customEdge || 0) + 
               (pricing.hobCutOut || 0) + (pricing.drainGrooves || 0) + (pricing.smallHoles || 0)
      });
    }

    // Sink Options - Available for ALL service levels
    if ((pricing.sinkCost || 0) > 0) {
      categories.push({
        name: 'Sink Options',
        color: 'bg-orange-50 border-orange-200',
        items: [
          {
            label: 'Sink Cost',
            value: pricing.sinkCost || 0,
            description: 'Sink installation (Client: 200-250 AED, Luxone: 900 AED)',
            icon: <Package className="w-4 h-4" />
          }
        ],
        total: pricing.sinkCost || 0
      });
    }

    // Installation - ONLY for "Fabrication, Delivery & Installation"
    if (serviceLevel === 'fabrication-delivery-installation' && (pricing.installation || 0) > 0) {
      categories.push({
        name: 'Installation',
        color: 'bg-indigo-50 border-indigo-200',
        items: [
          {
            label: 'Installation',
            value: pricing.installation || 0,
            description: 'Installation service (80 AED/sqm)',
            icon: <Wrench className="w-4 h-4" />
          }
        ],
        total: pricing.installation || 0
      });
    }

    // Delivery - for "Fabrication & Delivery" and "Fabrication, Delivery & Installation"
    if ((serviceLevel === 'fabrication-delivery' || serviceLevel === 'fabrication-delivery-installation') && 
        (pricing.delivery || 0) > 0) {
      categories.push({
        name: 'Packing & Delivery',
        color: 'bg-yellow-50 border-yellow-200',
        items: [
          {
            label: 'Delivery',
            value: pricing.delivery || 0,
            description: 'Location-based delivery (Dubai: 500 AED, Other UAE: 800 AED)',
            icon: <Truck className="w-4 h-4" />
          }
        ],
        total: pricing.delivery || 0
      });
    }

    return categories;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMaterialInfo = (materialColor: string, finish: string = 'Polished', thickness: string = '20mm') => {
    const material = findMaterialByName(materialColor, finish, thickness);
    if (material) {
      return {
        name: material.color_name || material.name,
        price: getMaterialPrice(materialColor, finish, thickness),
        brand: material.brand,
        category: material.category,
        finishing: material.finishing,
        thickness: material.thickness
      };
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quotation Cost Breakdown</h1>
              <p className="text-gray-600 mt-1">Detailed cost analysis for all quotations</p>
            </div>
            <button
              onClick={fetchQuotations}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Quotations List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {quotations.map((quotation) => (
            <div
              key={quotation.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedQuotation(quotation)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">{quotation.quote_id}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    quotation.status === 'completed' ? 'bg-green-100 text-green-800' :
                    quotation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {quotation.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{quotation.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Area:</span>
                    <span className="font-medium">{quotation.total_area} sqm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-lg text-green-600">
                      {formatCurrency(quotation.total_amount)}
                    </span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  Created: {formatDate(quotation.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Cost Breakdown Modal */}
        {selectedQuotation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Cost Breakdown - {selectedQuotation.quote_id}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {selectedQuotation.customer_name} • {selectedQuotation.customer_email}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedQuotation(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calculator className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">Subtotal</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">
                      {formatCurrency(selectedQuotation.pricing_data.subtotal)}
                    </div>
                  </div>
                  
                                     <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                     <div className="flex items-center space-x-2 mb-2">
                       <TrendingUp className="w-5 h-5 text-green-600" />
                       <span className="font-semibold text-green-900">Company Profit (20%)</span>
                     </div>
                     <div className="text-2xl font-bold text-green-900">
                       {formatCurrency(selectedQuotation.pricing_data.margin)}
                     </div>
                   </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-900">Grand Total</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">
                      {formatCurrency(selectedQuotation.pricing_data.grandTotal)}
                    </div>
                  </div>
                </div>

                                 {/* Cost Categories */}
                 <div className="space-y-6">
                   {getCostCategories(selectedQuotation.pricing_data, selectedQuotation.serviceLevel).map((category, index) => (
                    <div key={index} className={`border rounded-lg p-4 ${category.color}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                        <span className="text-xl font-bold text-gray-900">
                          {formatCurrency(category.total)}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center justify-between bg-white rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <div className="text-gray-500">{item.icon}</div>
                              <div>
                                <div className="font-medium text-gray-900">{item.label}</div>
                                <div className="text-sm text-gray-500">{item.description}</div>
                              </div>
                            </div>
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(item.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                                 {/* Material Information */}
                 {selectedQuotation.pricing_data.materialCost > 0 && (
                   <div className="mt-8">
                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Material Information</h3>
                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="bg-white rounded-lg p-4 border border-blue-200">
                           <h4 className="font-semibold text-blue-900 mb-2">Material Details</h4>
                           <div className="space-y-2 text-sm">
                             <div className="flex justify-between">
                               <span className="text-gray-600">Total Material Cost:</span>
                               <span className="font-bold text-blue-900">
                                 {formatCurrency(selectedQuotation.pricing_data.materialCost)}
                               </span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Total Area:</span>
                               <span className="font-medium">{selectedQuotation.pricing_data.totalSqm} sqm</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Slabs Required:</span>
                               <span className="font-medium">{selectedQuotation.pricing_data.slabsRequired}</span>
                             </div>
                           </div>
                         </div>
                         
                         <div className="bg-white rounded-lg p-4 border border-blue-200">
                           <h4 className="font-semibold text-blue-900 mb-2">Available Materials</h4>
                           <div className="space-y-2 text-sm">
                             <div className="text-gray-600 mb-2">Sample Luxone Quartz Colors:</div>
                             <div className="grid grid-cols-2 gap-2">
                               {['Golden River', 'Megistic White', 'Royal Statuario', 'White Pazzal', 'Universe Grey', 'The Saint'].map((colorName) => {
                                 const materialInfo = getMaterialInfo(colorName);
                                 return materialInfo ? (
                                   <div key={colorName} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                     <span className="text-xs font-medium">{materialInfo.name}</span>
                                     <span className="text-xs text-blue-600 font-bold">
                                       {formatCurrency(materialInfo.price)}/sqft
                                     </span>
                                   </div>
                                 ) : null;
                               })}
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}

                 {/* Product Breakdown */}
                 {selectedQuotation.pricing_data.productBreakdown && 
                  Object.keys(selectedQuotation.pricing_data.productBreakdown).length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Breakdown</h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="space-y-3">
                        {Object.entries(selectedQuotation.pricing_data.productBreakdown).map(([productId, product]) => (
                          <div key={productId} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-gray-900">{product.productType}</span>
                              <span className="text-sm text-gray-500">Qty: {product.quantity}</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Area:</span>
                                <span className="ml-1 font-medium">{product.area} sqm</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Material:</span>
                                <span className="ml-1 font-medium">{formatCurrency(product.materialCost)}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Processing:</span>
                                <span className="ml-1 font-medium">{formatCurrency(product.processingCost)}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Total:</span>
                                <span className="ml-1 font-bold text-green-600">{formatCurrency(product.totalCost)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Details */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Project Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Area:</span>
                        <span className="font-medium">{selectedQuotation.pricing_data.totalSqm} sqm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Slabs Required:</span>
                        <span className="font-medium">{selectedQuotation.pricing_data.slabsRequired}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">VAT (5%):</span>
                        <span className="font-medium">{formatCurrency(selectedQuotation.pricing_data.vat)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium">{formatDate(selectedQuotation.created_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedQuotation.status === 'completed' ? 'bg-green-100 text-green-800' :
                          selectedQuotation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedQuotation.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationCostBreakdown;
