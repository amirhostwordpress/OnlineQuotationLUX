import React, { useEffect, useState } from 'react';
import { useQuotation } from '../../context/QuotationContext';
import NavigationButtons from '../common/NavigationButtons';
import { MaterialOption, ProductSelection, ProductPiece } from '../../types';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const Step2MaterialOptions: React.FC = () => {
  const { data, updateData } = useQuotation();
  const [materials, setMaterials] = useState<MaterialOption[]>([]);
  const [expandedProducts, setExpandedProducts] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetch('https://luxonebackendrepo.onrender.com/api/material_options')
      .then(res => res.json())
      .then(data => {
        console.log('Step2 - Materials API response:', data);
        setMaterials(data);
      })
      .catch(error => {
        console.error('Step2 - Error fetching materials:', error);
      });
  }, []);

  // Initialize selectedProducts if it doesn't exist
  React.useEffect(() => {
    if (!data.selectedProducts) {
      updateData({ selectedProducts: [] });
    }
  }, [data.selectedProducts, updateData]);

  const productTypes = [
    'Kitchen Top',
    'Island', 
    'Backsplash',
    'Bar BQ Counter',
    'Flooring',
    'Walls',
    'Staircase'
  ] as const;

  const handleAddProduct = () => {
    const newProduct: ProductSelection = {
      id: `product_${Date.now()}`,
      productType: 'Kitchen Top',
      quantity: 1,
      materialSource: '',
      materialType: '',
      materialColor: '',
    };

    const updatedProducts = [...(data.selectedProducts || []), newProduct];
    updateData({ selectedProducts: updatedProducts });
    
    // Expand the new product
    setExpandedProducts(prev => ({
      ...prev,
      [newProduct.id]: true
    }));
  };

  const handleRemoveProduct = (productId: string) => {
    const updatedProducts = (data.selectedProducts || []).filter(p => p.id !== productId);
    updateData({ selectedProducts: updatedProducts });
    
    // Remove from expanded state
    setExpandedProducts(prev => {
      const newState = { ...prev };
      delete newState[productId];
      return newState;
    });
  };

  const handleProductChange = (productId: string, updates: Partial<ProductSelection>) => {
    const updatedProducts = (data.selectedProducts || []).map(product => 
      product.id === productId ? { ...product, ...updates } : product
    );
    console.log('Step2 - Updating product:', { productId, updates, updatedProducts });
    updateData({ selectedProducts: updatedProducts });
    
    // If product type changed, update the available area
    if (updates.productType) {
      updateTotalAvailableArea(productId, updates);
    }
  };

  const toggleProductExpansion = (productId: string) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Calculate total available area for 'By Yourself' option
  const calculateTotalArea = (product: ProductSelection) => {
    console.log('Step2 - calculateTotalArea called with:', {
      materialSource: product.materialSource,
      slabSize: product.slabSize,
      numberOfSlabs: product.numberOfSlabs
    });
    
    if (product.materialSource === 'yourself') {
      if (!product.slabSize || !product.numberOfSlabs) {
        console.log('Step2 - Missing required fields for yourself calculation');
        return null; // Return null to indicate missing data
      }
      
      // Support both "3.2x1.6" and "3200x1600" formats
      const sizeMatch = product.slabSize.match(/(\d+\.?\d*)x(\d+\.?\d*)/);
      console.log('Step2 - sizeMatch result:', sizeMatch);
      if (sizeMatch) {
        let length = parseFloat(sizeMatch[1]);
        let width = parseFloat(sizeMatch[2]);
        
        // If dimensions are in mm (large numbers), convert to meters
        if (length > 100 || width > 100) {
          length = length / 1000;
          width = width / 1000;
        }
        
        const totalArea = length * width * product.numberOfSlabs;
        console.log('Step2 - Area calculation:', { length, width, numberOfSlabs: product.numberOfSlabs, totalArea });
        return totalArea;
      }
    }
    console.log('Step2 - calculateTotalArea returning 0');
    return 0;
  };

  // Calculate total quantity for 'Luxone Others' option
  const calculateLuxoneOthersTotal = (product: ProductSelection) => {
    console.log('Step2 - calculateLuxoneOthersTotal called with:', {
      materialSource: product.materialSource,
      luxoneOthersSlabSize: product.luxoneOthersSlabSize,
      requiredSlabs: product.requiredSlabs
    });
    
    if (product.materialSource === 'luxone-others') {
      if (!product.luxoneOthersSlabSize || !product.requiredSlabs) {
        console.log('Step2 - Missing required fields for luxone-others calculation');
        return null; // Return null to indicate missing data
      }
      
      // Support both "3.05x1.35" and "3050x1350" formats
      const sizeMatch = product.luxoneOthersSlabSize.match(/(\d+\.?\d*)x(\d+\.?\d*)/);
      console.log('Step2 - Luxone Others sizeMatch result:', sizeMatch);
      if (sizeMatch) {
        let length = parseFloat(sizeMatch[1]);
        let width = parseFloat(sizeMatch[2]);
        
        // If dimensions are in mm (large numbers), convert to meters
        if (length > 100 || width > 100) {
          length = length / 1000;
          width = width / 1000;
        }
        
        const slabs = parseInt(product.requiredSlabs) || 0;
        const totalArea = length * width * slabs;
        console.log('Step2 - Luxone Others area calculation:', { length, width, slabs, totalArea });
        return totalArea;
      }
    }
    console.log('Step2 - calculateLuxoneOthersTotal returning 0');
    return 0;
  };

  // Update total available area when slab specifications change
  const updateTotalAvailableArea = (productId: string, updates: Partial<ProductSelection>) => {
    console.log('Step2 - updateTotalAvailableArea called with:', { productId, updates });
    
    // First update the product with the new values
    const updatedProducts = (data.selectedProducts || []).map(product => 
      product.id === productId ? { ...product, ...updates } : product
    );
    
    // Find the updated product
    const updatedProduct = updatedProducts.find(p => p.id === productId);
    if (!updatedProduct) return;
    
    // Calculate total area based on the updated product
    let totalArea = 0;
    
    console.log('Step2 - Calculating area for product:', {
      productId,
      productType: updatedProduct.productType,
      materialSource: updatedProduct.materialSource,
      materialType: updatedProduct.materialType,
      materialColor: updatedProduct.materialColor,
      slabSize: updatedProduct.slabSize,
      numberOfSlabs: updatedProduct.numberOfSlabs,
      luxoneOthersSlabSize: updatedProduct.luxoneOthersSlabSize,
      requiredSlabs: updatedProduct.requiredSlabs
    });
    
    // Check for fixed area first (Island, Backsplash)
    const fixedArea = getFixedAvailableArea(updatedProduct.productType);
    if (fixedArea !== null) {
      totalArea = fixedArea;
      console.log('Step2 - Fixed area calculation result:', totalArea);
    } else if (updatedProduct.materialSource === 'yourself') {
      const area = calculateTotalArea(updatedProduct);
      totalArea = area !== null ? area : 0;
      console.log('Step2 - Yourself calculation result:', totalArea);
    } else if (updatedProduct.materialSource === 'luxone-others') {
      const area = calculateLuxoneOthersTotal(updatedProduct);
      totalArea = area !== null ? area : 0;
      console.log('Step2 - Luxone Others calculation result:', totalArea);
    } else if (updatedProduct.materialSource === 'luxone') {
      // For Luxone own materials, unlimited quantity
      totalArea = Infinity;
      console.log('Step2 - Luxone calculation result: Infinity');
    }
    
    // Update with both the original updates and the calculated area
    const finalUpdates = { ...updates, totalAvailableArea: totalArea };
    const finalProducts = (data.selectedProducts || []).map(product => 
      product.id === productId ? { ...product, ...finalUpdates } : product
    );
    
    console.log('Step2 - Updating product with area calculation:', { productId, finalUpdates, totalArea });
    updateData({ selectedProducts: finalProducts });
  };

  // Filter materials by selected material type
  const getFilteredMaterials = (materialType: string) => {
    console.log('Step2 - getFilteredMaterials called with:', { materialType, materialsCount: materials.length });
    // Map materialType to category: 'quartz' -> 'quartz', 'porcelain' -> 'porcelain'
    const filtered = materials.filter(mat => mat.category === materialType);
    console.log('Step2 - Filtered materials:', filtered);
    return filtered;
  };

  const isNextDisabled = () => {
    if (!data.selectedProducts || data.selectedProducts.length === 0) return true;
    
    return data.selectedProducts.some(product => {
      if (!product.materialSource) return true;
      
      if (product.materialSource === 'luxone') {
        return !product.materialType || !product.materialColor;
      }
      
      if (product.materialSource === 'yourself') {
        return !product.slabSize || !product.thickness || !product.finish || !product.numberOfSlabs;
      }
      
      if (product.materialSource === 'luxone-others') {
        return !product.luxoneOthersSlabSize || !product.luxoneOthersThickness || 
               !product.luxoneOthersFinish || !product.requiredSlabs || 
               !product.pricePerSlab || !product.brandSupplier || !product.luxoneOthersColorName;
      }
      
      return false;
    });
  };



  // Calculate fixed available area based on product type
  const getFixedAvailableArea = (productType: string) => {
    if (productType === 'Island') {
      return 10.24; // Fixed 10.24 sqm for Island
    }
    if (productType === 'Backsplash') {
      return 20.58; // Fixed 20.58 sqm for Backsplash
    }
    return null; // For other products, calculate based on user input
  };

  // Get worktop layout name based on product type
  const getWorktopLayoutName = (productType: string) => {
    switch (productType) {
      case 'Kitchen Top':
        return 'Kitchen Worktop Layout';
      case 'Island':
        return 'Island Worktop Layout';
      case 'Backsplash':
        return 'Backsplash Layout';
      case 'Bar BQ Counter':
        return 'Bar BQ Counter Layout';
      case 'Flooring':
        return 'Flooring Layout';
      case 'Walls':
        return 'Wall Cladding Layout';
      case 'Staircase':
        return 'Staircase Layout';
      default:
        return 'Worktop Layout';
    }
  };

  // Get product specifications based on product type
  const getProductSpecifications = (productType: string) => {
    switch (productType) {
      case 'Island':
        return {
          availableArea: 10.24,
          finish: 'Matt',
          thickness: '12mm'
        };
      case 'Backsplash':
        return {
          availableArea: 20.58,
          finish: 'Leather',
          thickness: '10mm'
        };
      default:
        return null;
    }
  };

  // Calculate used area for a product
  const calculateUsedArea = (product: ProductSelection) => {
    if (!product.pieces || Object.keys(product.pieces).length === 0) {
      return 0;
    }
    
    let totalUsed = 0;
    Object.values(product.pieces).forEach(piece => {
      if (piece.area) {
        totalUsed += piece.area;
      }
    });
    return totalUsed;
  };

  // Calculate remaining area
  const calculateRemainingArea = (product: ProductSelection) => {
    const availableArea = product.totalAvailableArea || getFixedAvailableArea(product.productType);
    if (availableArea === null || availableArea === Infinity) {
      return null; // Unlimited or not calculated
    }
    
    const usedArea = calculateUsedArea(product);
    return availableArea - usedArea;
  };

  // Add a new piece to a product
  const addPiece = (productId: string) => {
    const product = data.selectedProducts?.find(p => p.id === productId);
    if (!product) return;

    const pieceId = `piece_${Date.now()}`;
    const newPiece = {
      length: '',
      width: '',
      thickness: '',
      area: 0
    };

    const updatedPieces = {
      ...product.pieces,
      [pieceId]: newPiece
    };

    handleProductChange(productId, { pieces: updatedPieces });
  };

  // Update a piece
  const updatePiece = (productId: string, pieceId: string, updates: Partial<ProductPiece>) => {
    const product = data.selectedProducts?.find(p => p.id === productId);
    if (!product) return;

    const currentPiece = product.pieces?.[pieceId] || { length: '', width: '', thickness: '', area: 0 };
    const updatedPiece = { ...currentPiece, ...updates };
    
    // Calculate area if length and width are provided
    if (updatedPiece.length && updatedPiece.width) {
      const length = parseFloat(updatedPiece.length);
      const width = parseFloat(updatedPiece.width);
      if (!isNaN(length) && !isNaN(width)) {
        updatedPiece.area = length * width;
      }
    }

    const updatedPieces: { [pieceId: string]: ProductPiece } = {
      ...product.pieces,
      [pieceId]: updatedPiece as ProductPiece
    };

    handleProductChange(productId, { pieces: updatedPieces });
  };

  // Remove a piece
  const removePiece = (productId: string, pieceId: string) => {
    const product = data.selectedProducts?.find(p => p.id === productId);
    if (!product) return;

    const updatedPieces = { ...product.pieces };
    delete updatedPieces[pieceId];

    handleProductChange(productId, { pieces: updatedPieces });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Step 2 (of 7) - Product & Material Selection
        </h2>
        <p className="text-lg text-gray-600">
          Select your products and specify material requirements for each.
        </p>
      </div>

      <div className="space-y-8">
        {/* Product Selection Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Product Selection
            </h3>
            <button
              onClick={handleAddProduct}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={18} className="mr-2" /> Add New Product
            </button>
          </div>

          {(!data.selectedProducts || data.selectedProducts.length === 0) ? (
            <div className="text-center py-8 text-gray-500">
              <p>No products selected yet. Click "Add New Product" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.selectedProducts.map((product, index) => (
                <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <div className="flex items-center space-x-3">
                                                 <select
                           value={product.productType}
                           onChange={(e) => handleProductChange(product.id, { 
                             productType: e.target.value as 'Kitchen Top' | 'Island' | 'Backsplash' | 'Bar BQ Counter' | 'Flooring' | 'Walls' | 'Staircase'
                           })}
                           className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:ring-0"
                         >
                          {productTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <span className="text-gray-500">×</span>
                        <input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) => handleProductChange(product.id, { 
                            quantity: parseInt(e.target.value) || 1 
                          })}
                          className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleProductExpansion(product.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {expandedProducts[product.id] ? (
                          <ChevronUp size={20} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-500" />
                        )}
                      </button>
                      <button
                        onClick={() => handleRemoveProduct(product.id)}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {expandedProducts[product.id] && (
                    <div className="p-4 space-y-6">
                      {/* Material Source Selection */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Material Source for {product.productType}
                        </h4>
                        <div className="grid gap-3 md:grid-cols-3">
                          {[
                            { id: 'luxone', title: 'Luxone Own Material', desc: 'Choose from our premium collections' },
                            { id: 'yourself', title: 'By Yourself', desc: 'Provide your own material specifications' },
                            { id: 'luxone-others', title: 'Luxone Others', desc: 'Other material options with custom specs' }
                          ].map(source => (
                            <div
                              key={source.id}
                                                                                             onClick={() => {
                                  updateTotalAvailableArea(product.id, { 
                                    materialSource: source.id as 'luxone' | 'yourself' | 'luxone-others',
                                    materialType: '',
                                    materialColor: ''
                                  });
                                }}
                              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                                product.materialSource === source.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <h5 className="text-lg font-semibold text-gray-900 mb-1">
                                {source.title}
                              </h5>
                              <p className="text-gray-600 text-sm">
                                {source.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Material Specifications based on source */}
                      {product.materialSource === 'luxone' && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h5 className="text-lg font-semibold text-gray-900 mb-4">
                            Luxone Material Options
                          </h5>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Material Type *
                              </label>
                                                            <select
                                value={product.materialType}
                                onChange={(e) => {
                                  console.log('Step2 - Material type changed:', e.target.value);
                                  updateTotalAvailableArea(product.id, { 
                                    materialType: e.target.value as 'quartz' | 'porcelain',
                                    materialColor: ''
                                  });
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select Material Type</option>
                                <option value="quartz">Luxone Quartz</option>
                                <option value="porcelain">Luxone Porcelain</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color *
                              </label>
                              <select
                                value={product.materialColor}
                                onChange={(e) => {
                                  console.log('Step2 - Material color changed:', e.target.value);
                                  handleProductChange(product.id, { materialColor: e.target.value });
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={!product.materialType}
                              >
                                <option value="">Select Color</option>
                                {getFilteredMaterials(product.materialType).map(mat => {
                                  console.log('Step2 - Rendering material option:', mat);
                                  return (
                                    <option key={mat.id} value={mat.name}>{mat.name}</option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                          {product.materialType && product.materialColor && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-sm text-green-700">
                                <strong>Available Quantity:</strong> Unlimited (Luxone Own Material)
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {product.materialSource === 'yourself' && (
                        <div className="bg-yellow-50 rounded-lg p-4">
                          <h5 className="text-lg font-semibold text-gray-900 mb-4">
                            Your Material Details
                          </h5>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Slab Size (L × W) *
                              </label>
                              <input
                                type="text"
                                value={product.slabSize || ''}
                                                                  onChange={(e) => {
                                    updateTotalAvailableArea(product.id, { slabSize: e.target.value });
                                  }}
                                placeholder="e.g., 3.2x1.6"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thickness *
                              </label>
                              <input
                                type="text"
                                value={product.thickness || ''}
                                onChange={(e) => handleProductChange(product.id, { thickness: e.target.value })}
                                placeholder="e.g., 12mm"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Finish *
                              </label>
                              <input
                                type="text"
                                value={product.finish || ''}
                                onChange={(e) => handleProductChange(product.id, { finish: e.target.value })}
                                placeholder="e.g., Matt"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Number of Slabs *
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={product.numberOfSlabs || ''}
                                                                  onChange={(e) => {
                                    updateTotalAvailableArea(product.id, { numberOfSlabs: parseInt(e.target.value) || 0 });
                                  }}
                                placeholder="e.g., 2"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          
                          {product.slabSize && product.numberOfSlabs && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-sm text-blue-700">
                                <strong>Total Available Material:</strong> {calculateTotalArea(product)?.toFixed(2) || '0.00'} m²
                              </p>
                              <p className="text-xs text-blue-600 mt-1">
                                This is the maximum quantity available for your {product.productType} pieces
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {product.materialSource === 'luxone-others' && (
                        <div className="bg-green-50 rounded-lg p-4">
                          <h5 className="text-lg font-semibold text-gray-900 mb-4">
                            Luxone Others Details
                          </h5>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Slab Size (L × W) *
                              </label>
                              <input
                                type="text"
                                value={product.luxoneOthersSlabSize || ''}
                                                                  onChange={(e) => {
                                    updateTotalAvailableArea(product.id, { luxoneOthersSlabSize: e.target.value });
                                  }}
                                placeholder="e.g., 3.05x1.35"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thickness *
                              </label>
                              <input
                                type="text"
                                value={product.luxoneOthersThickness || ''}
                                onChange={(e) => handleProductChange(product.id, { luxoneOthersThickness: e.target.value })}
                                placeholder="e.g., 10mm"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Finish *
                              </label>
                              <input
                                type="text"
                                value={product.luxoneOthersFinish || ''}
                                onChange={(e) => handleProductChange(product.id, { luxoneOthersFinish: e.target.value })}
                                placeholder="e.g., Leather"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Required Slabs *
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={product.requiredSlabs || ''}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  handleProductChange(product.id, { requiredSlabs: value.toString() });
                                  updateTotalAvailableArea(product.id, { requiredSlabs: value.toString() });
                                }}
                                placeholder="e.g., 5"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price per Slab *
                              </label>
                              <input
                                type="text"
                                value={product.pricePerSlab || ''}
                                onChange={(e) => handleProductChange(product.id, { pricePerSlab: e.target.value })}
                                placeholder="e.g., AED 1200"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Brand/Supplier *
                              </label>
                              <input
                                type="text"
                                value={product.brandSupplier || ''}
                                onChange={(e) => handleProductChange(product.id, { brandSupplier: e.target.value })}
                                placeholder="e.g., Caesarstone"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color Name *
                              </label>
                              <input
                                type="text"
                                value={product.luxoneOthersColorName || ''}
                                onChange={(e) => handleProductChange(product.id, { luxoneOthersColorName: e.target.value })}
                                placeholder="e.g., Calacatta Gold"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          
                          {product.luxoneOthersSlabSize && product.requiredSlabs && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-sm text-green-700">
                                <strong>Total Available Material:</strong> {calculateLuxoneOthersTotal(product)?.toFixed(2) || '0.00'} m²
                              </p>
                              <p className="text-xs text-green-600 mt-1">
                                This is the maximum quantity available for your {product.productType} pieces
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Piece Management Section */}
                      <div className="mt-6 bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h5 className="text-lg font-semibold text-gray-900">
                              {getWorktopLayoutName(product.productType)}
                            </h5>
                            {getProductSpecifications(product.productType) && (
                              <p className="text-sm text-gray-600 mt-1">
                                Total SQM Available for Pieces: {getProductSpecifications(product.productType)?.availableArea} sqm | 
                                Finish: {getProductSpecifications(product.productType)?.finish} | 
                                Thickness: {getProductSpecifications(product.productType)?.thickness}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => addPiece(product.id)}
                            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
                          >
                            <Plus size={16} className="mr-1" /> Add Piece
                          </button>
                        </div>

                        {/* Area Summary */}
                        <div className="mb-4 p-3 bg-white border border-gray-200 rounded-lg">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Available:</span>
                              <span className="ml-2 text-gray-900">
                                {product.totalAvailableArea === Infinity ? 'Unlimited' : 
                                 product.totalAvailableArea ? `${product.totalAvailableArea.toFixed(2)} m²` : 
                                 getFixedAvailableArea(product.productType) ? `${getFixedAvailableArea(product.productType)} m²` : 'Not set'}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Used:</span>
                              <span className="ml-2 text-gray-900">
                                {calculateUsedArea(product).toFixed(2)} m²
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Remaining:</span>
                              <span className="ml-2 text-gray-900">
                                {calculateRemainingArea(product) !== null ? `${calculateRemainingArea(product)?.toFixed(2)} m²` : 'N/A'}
                              </span>
                            </div>
                          </div>
                          {getProductSpecifications(product.productType) && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <p className="text-xs text-gray-600">
                                <strong>Specifications:</strong> {getProductSpecifications(product.productType)?.finish} finish, {getProductSpecifications(product.productType)?.thickness} thickness
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Pieces List */}
                        {product.pieces && Object.keys(product.pieces).length > 0 ? (
                          <div className="space-y-3">
                            {Object.entries(product.pieces).map(([pieceId, piece]) => (
                              <div key={pieceId} className="bg-white border border-gray-200 rounded-lg p-3">
                                <div className="flex justify-between items-start mb-3">
                                  <h6 className="font-medium text-gray-900">Piece #{pieceId.split('_')[1]}</h6>
                                  <button
                                    onClick={() => removePiece(product.id, pieceId)}
                                    className="p-1 hover:bg-red-100 rounded text-red-600"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Length (m)</label>
                                    <input
                                      type="number"
                                      step="0.01"
                                      value={piece.length}
                                      onChange={(e) => updatePiece(product.id, pieceId, { length: e.target.value })}
                                      className="w-full p-2 border border-gray-300 rounded text-sm"
                                      placeholder="0.00"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Width (m)</label>
                                    <input
                                      type="number"
                                      step="0.01"
                                      value={piece.width}
                                      onChange={(e) => updatePiece(product.id, pieceId, { width: e.target.value })}
                                      className="w-full p-2 border border-gray-300 rounded text-sm"
                                      placeholder="0.00"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Thickness (mm)</label>
                                    <input
                                      type="text"
                                      value={piece.thickness}
                                      onChange={(e) => updatePiece(product.id, pieceId, { thickness: e.target.value })}
                                      className="w-full p-2 border border-gray-300 rounded text-sm"
                                      placeholder="12mm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Area (m²)</label>
                                    <div className="p-2 bg-gray-100 rounded text-sm font-medium">
                                      {piece.area.toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            <p>No pieces added yet. Click "Add Piece" to get started.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Section */}
        {data.selectedProducts && data.selectedProducts.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Selection Summary
            </h3>
                         <div className="space-y-2">
               {data.selectedProducts.map((product) => (
                 <div key={product.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div>
                    <span className="font-medium">{product.productType}</span>
                    <span className="text-gray-500 ml-2">× {product.quantity}</span>
                    {product.materialSource && (
                      <span className="text-sm text-gray-600 ml-2">
                        ({product.materialSource === 'luxone' ? 'Luxone Material' : 
                          product.materialSource === 'yourself' ? 'Client Supplied' : 'Luxone Others'})
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {product.totalAvailableArea !== undefined && product.totalAvailableArea !== null && product.totalAvailableArea !== Infinity && product.totalAvailableArea > 0 && (
                      <span>Available: {product.totalAvailableArea.toFixed(2)} m²</span>
                    )}
                    {product.totalAvailableArea === Infinity && (
                      <span>Unlimited</span>
                    )}
                    {product.totalAvailableArea === 0 && product.materialSource === 'yourself' && (
                      <span>Enter slab size and quantity</span>
                    )}
                    {product.totalAvailableArea === 0 && product.materialSource === 'luxone-others' && (
                      <span>Enter slab size and quantity</span>
                    )}
                    {product.totalAvailableArea === null && (
                      <span>Not calculated</span>
                    )}
                    {product.totalAvailableArea === undefined && (
                      <span>Select material details</span>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      Debug: {product.materialSource} | {product.materialType} | {product.materialColor} |
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <NavigationButtons isNextDisabled={isNextDisabled()} />
    </div>
  );
};

export default Step2MaterialOptions;