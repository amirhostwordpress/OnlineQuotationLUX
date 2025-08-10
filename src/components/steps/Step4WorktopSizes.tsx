import React, { useState, useEffect } from 'react';
import { useQuotation } from '../../context/QuotationContext';
import NavigationButtons from '../common/NavigationButtons';
import FileUpload from '../common/FileUpload';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { ProductSelection } from '../../types';

const Step4WorktopSizes: React.FC = () => {
  const { data, updateData } = useQuotation();
  const [expandedProducts, setExpandedProducts] = useState<{ [key: string]: boolean }>({});
  const [expandedPieces, setExpandedPieces] = useState<{ [productId: string]: { [pieceId: string]: boolean } }>({});

  // Initialize productPieces if it doesn't exist
  useEffect(() => {
    if (!data.productPieces) {
      updateData({ productPieces: {} });
    }
  }, [data.productPieces, updateData]);

  // Update area calculations when selectedProducts change
  useEffect(() => {
    console.log('Step4 - selectedProducts changed:', data.selectedProducts);
    if (data.selectedProducts && data.selectedProducts.length > 0) {
      data.selectedProducts.forEach(product => {
        const pieces = data.productPieces?.[product.id] || {};
        updateProductAreaCalculations(product.id, pieces);
      });
    }
  }, [data.selectedProducts]);

  const handlePieceChange = (productId: string, pieceId: string, field: string, value: string) => {
    const currentProductPieces = data.productPieces || {};
    const currentPieces = currentProductPieces[productId] || {};
    
    const updatedPiece = {
      ...currentPieces[pieceId],
      [field]: value
    };

    // Calculate area for the piece
    if (field === 'length' || field === 'width') {
      const length = field === 'length' ? parseFloat(value) : parseFloat(currentPieces[pieceId]?.length || '0');
      const width = field === 'width' ? parseFloat(value) : parseFloat(currentPieces[pieceId]?.width || '0');
      updatedPiece.area = isNaN(length) || isNaN(width) ? 0 : +(length * width).toFixed(2);
    }

    const updatedPieces = {
      ...currentPieces,
      [pieceId]: updatedPiece
    };

    const updatedProductPieces = {
      ...currentProductPieces,
      [productId]: updatedPieces
    };

    updateData({ productPieces: updatedProductPieces });
    
    // Update product's total used area and remaining area
    updateProductAreaCalculations(productId, updatedPieces);
  };

  const updateProductAreaCalculations = (productId: string, pieces: { [key: string]: { area?: number } }) => {
    const product = data.selectedProducts?.find(p => p.id === productId);
    if (!product) return;

    console.log('Step4 - updateProductAreaCalculations called for product:', {
      productId,
      materialSource: product.materialSource,
      slabSize: product.slabSize,
      numberOfSlabs: product.numberOfSlabs,
      luxoneOthersSlabSize: product.luxoneOthersSlabSize,
      requiredSlabs: product.requiredSlabs,
      currentTotalAvailableArea: product.totalAvailableArea
    });

    const totalUsedArea = Object.values(pieces).reduce((sum: number, piece: { area?: number }) => {
      return sum + (piece.area || 0);
    }, 0);

    // Ensure totalAvailableArea is calculated if not set
    let totalAvailableArea = product.totalAvailableArea;
    if (totalAvailableArea === undefined || totalAvailableArea === 0) {
      console.log('Step4 - Recalculating totalAvailableArea');
      if (product.materialSource === 'yourself' && product.slabSize && product.numberOfSlabs) {
        const sizeMatch = product.slabSize.match(/(\d+\.?\d*)x(\d+\.?\d*)/);
        if (sizeMatch) {
          const length = parseFloat(sizeMatch[1]);
          const width = parseFloat(sizeMatch[2]);
          totalAvailableArea = length * width * product.numberOfSlabs;
          console.log('Step4 - Yourself calculation:', { length, width, numberOfSlabs: product.numberOfSlabs, totalAvailableArea });
        }
      } else if (product.materialSource === 'luxone-others' && product.luxoneOthersSlabSize && product.requiredSlabs) {
        const sizeMatch = product.luxoneOthersSlabSize.match(/(\d+\.?\d*)x(\d+\.?\d*)/);
        if (sizeMatch) {
          const length = parseFloat(sizeMatch[1]);
          const width = parseFloat(sizeMatch[2]);
          const slabs = parseInt(product.requiredSlabs);
          totalAvailableArea = length * width * slabs;
          console.log('Step4 - Luxone Others calculation:', { length, width, slabs, totalAvailableArea });
        }
      } else if (product.materialSource === 'luxone') {
        totalAvailableArea = Infinity;
        console.log('Step4 - Luxone calculation: Infinity');
      }
    }

    const remainingArea = totalAvailableArea === Infinity ? 
      Infinity : 
      (totalAvailableArea || 0) - totalUsedArea;

    console.log('Step4 - Final calculations:', { totalUsedArea, totalAvailableArea, remainingArea });

    const updatedProducts = data.selectedProducts?.map(p => 
      p.id === productId ? { ...p, totalUsedArea, remainingArea, totalAvailableArea } : p
    );

    console.log(`Product ${productId} calculations:`, {
      totalUsedArea,
      totalAvailableArea,
      remainingArea,
      pieces: Object.values(pieces).map(p => p.area)
    });

    updateData({ selectedProducts: updatedProducts });
  };

  const handleFileSelect = (file: File | null) => {
    updateData({ planSketch: file });
  };

  const toggleProductExpansion = (productId: string) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const togglePieceExpansion = (productId: string, pieceId: string) => {
    setExpandedPieces(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [pieceId]: !prev[productId]?.[pieceId]
      }
    }));
  };

  const getNextPieceLabel = (productId: string) => {
    const currentPieces = data.productPieces?.[productId] || {};
    const pieceLabels = Object.keys(currentPieces);
    
    if (pieceLabels.length === 0) return 'A';
    
    // Convert last label to next alphabet (after Z goes to AA, AB, etc.)
    const last = pieceLabels[pieceLabels.length - 1];
    let next = '';
    let carry = true;

    for (let i = last.length - 1; i >= 0; i--) {
      if (carry) {
        const char = last[i];
        if (char === 'Z') {
          next = 'A' + next;
          carry = true;
        } else {
          next = String.fromCharCode(char.charCodeAt(0) + 1) + next;
          carry = false;
        }
      } else {
        next = last[i] + next;
      }
    }

    if (carry) next = 'A' + next;

    return next;
  };

  const handleAddPiece = (productId: string) => {
    const newPieceId = getNextPieceLabel(productId);
    const currentProductPieces = data.productPieces || {};
    const currentPieces = currentProductPieces[productId] || {};

    const updatedPieces = {
      ...currentPieces,
      [newPieceId]: { length: '', width: '', thickness: '20', area: 0 }
    };

    const updatedProductPieces = {
      ...currentProductPieces,
      [productId]: updatedPieces
    };

    updateData({ productPieces: updatedProductPieces });

    // Expand the new piece
    setExpandedPieces(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [newPieceId]: true
      }
    }));
  };

  const handleRemovePiece = (productId: string, pieceId: string) => {
    const currentProductPieces = data.productPieces || {};
    const currentPieces = currentProductPieces[productId] || {};
    
    const updatedPieces = { ...currentPieces };
    delete updatedPieces[pieceId];

    const updatedProductPieces = {
      ...currentProductPieces,
      [productId]: updatedPieces
    };

    updateData({ productPieces: updatedProductPieces });
    
    // Update area calculations
    updateProductAreaCalculations(productId, updatedPieces);
  };

  const isNextDisabled = () => {
    if (!data.selectedProducts || data.selectedProducts.length === 0) return true;
    
    // Check if at least one product has at least one piece with dimensions
    return !data.selectedProducts.some(product => {
      const pieces = data.productPieces?.[product.id] || {};
      return Object.values(pieces).some((piece: { length?: string; width?: string }) => 
        piece && piece.length && piece.width
      );
    });
  };

  const isPieceComplete = (productId: string, pieceId: string) => {
    const pieceData = data.productPieces?.[productId]?.[pieceId];
    return pieceData && pieceData.length && pieceData.width;
  };

  const getProductTotalArea = (productId: string) => {
    const pieces = data.productPieces?.[productId] || {};
    return Object.values(pieces).reduce((sum: number, piece: { area?: number }) => sum + (piece.area || 0), 0).toFixed(2);
  };

  const getGrandTotalArea = () => {
    if (!data.selectedProducts) return '0.00';
    
    return data.selectedProducts.reduce((sum, product) => {
      return sum + parseFloat(getProductTotalArea(product.id));
    }, 0).toFixed(2);
  };

  const getProductStatus = (product: ProductSelection) => {
    const pieces = data.productPieces?.[product.id] || {};
    const totalUsedArea = Object.values(pieces).reduce((sum: number, piece: { area?: number }) => sum + (piece.area || 0), 0);
    
    if (product.totalAvailableArea === Infinity) {
      return { status: 'unlimited', color: 'text-green-600', bgColor: 'bg-green-100' };
    }
    
    if (totalUsedArea === 0) {
      return { status: 'no-pieces', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
    
    if (totalUsedArea > (product.totalAvailableArea || 0)) {
      return { status: 'exceeded', color: 'text-red-600', bgColor: 'bg-red-100' };
    }
    
    if (totalUsedArea === (product.totalAvailableArea || 0)) {
      return { status: 'exact', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    }
    
    return { status: 'within-limit', color: 'text-blue-600', bgColor: 'bg-blue-100' };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Step 3 (of 6) - Worktop Dimensions
        </h2>
        <p className="text-lg text-gray-600">
          Define the dimensions for each piece of your selected products.
        </p>
      </div>

      <div className="space-y-6">
        {(!data.selectedProducts || data.selectedProducts.length === 0) ? (
          <div className="text-center py-12 text-gray-500">
            <p>No products selected. Please go back to Step 2 to select products first.</p>
          </div>
        ) : (
          data.selectedProducts.map((product) => {
            const pieces = data.productPieces?.[product.id] || {};
            const pieceLabels = Object.keys(pieces);
            const productStatus = getProductStatus(product);
            
            return (
              <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {product.productType} × {product.quantity}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${productStatus.bgColor} ${productStatus.color}`}>
                      {productStatus.status === 'unlimited' && 'Unlimited Material'}
                      {productStatus.status === 'no-pieces' && 'No Pieces Added'}
                      {productStatus.status === 'exceeded' && 'Exceeds Available Material'}
                      {productStatus.status === 'exact' && 'Exact Match'}
                      {productStatus.status === 'within-limit' && 'Within Limit'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                                         <div className="text-sm text-gray-600">
                       <span className="font-medium">Used:</span> {getProductTotalArea(product.id)} m²
                       {product.totalAvailableArea !== Infinity && (
                         <span className="ml-2">
                           <span className="font-medium">Available:</span> {product.totalAvailableArea?.toFixed(2)} m²
                         </span>
                       )}
                       {product.totalAvailableArea !== Infinity && product.remainingArea !== undefined && (
                         <span className="ml-2">
                           <span className="font-medium">Remaining:</span> {product.remainingArea.toFixed(2)} m²
                         </span>
                       )}
                       {/* Debug info */}
                       <div className="text-xs text-gray-400 mt-1">
                         Debug: {product.materialSource} | {product.slabSize} | {product.numberOfSlabs} | {product.totalAvailableArea}
                       </div>
                     </div>
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
                  </div>
                </div>

                {expandedProducts[product.id] && (
                  <div className="p-4 space-y-4">
                    {/* Material Source Info */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Material Source:</span> {
                          product.materialSource === 'luxone' ? 'Luxone Own Material' :
                          product.materialSource === 'yourself' ? 'Client Supplied' :
                          product.materialSource === 'luxone-others' ? 'Luxone Others' : 'Not Selected'
                        }
                      </p>
                      {product.materialColor && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Color:</span> {product.materialColor}
                        </p>
                      )}
                    </div>

                    {/* Pieces Section */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                          Pieces for {product.productType}
                        </h4>
                        <button
                          onClick={() => handleAddPiece(product.id)}
                          className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                        >
                          <Plus size={16} className="mr-1" /> Add Piece
                        </button>
                      </div>

                      {pieceLabels.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <p>No pieces added yet. Click "Add Piece" to get started.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {pieceLabels.map((pieceId) => (
                            <div key={pieceId} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                              <div className="flex items-center justify-between p-3 border-b border-gray-100">
                                <div className="flex items-center space-x-3">
                                  <span className="text-lg font-medium text-gray-900">
                                    Piece {pieceId}
                                  </span>
                                  {isPieceComplete(product.id, pieceId) && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Complete
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-600">
                                    Area: {pieces[pieceId]?.area || 0} m²
                                  </span>
                                  <button
                                    onClick={() => togglePieceExpansion(product.id, pieceId)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                  >
                                    {expandedPieces[product.id]?.[pieceId] ? (
                                      <ChevronUp size={16} className="text-gray-500" />
                                    ) : (
                                      <ChevronDown size={16} className="text-gray-500" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleRemovePiece(product.id, pieceId)}
                                    className="p-1 hover:bg-red-100 rounded text-red-600"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>

                              {expandedPieces[product.id]?.[pieceId] && (
                                <div className="p-3">
                                  <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Length (m)
                                      </label>
                                      <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={pieces[pieceId]?.length || ''}
                                        onChange={(e) => handlePieceChange(product.id, pieceId, 'length', e.target.value)}
                                        placeholder="e.g., 2.40"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Width (m)
                                      </label>
                                      <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={pieces[pieceId]?.width || ''}
                                        onChange={(e) => handlePieceChange(product.id, pieceId, 'width', e.target.value)}
                                        placeholder="e.g., 0.60"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Thickness (mm)
                                      </label>
                                      <input
                                        type="text"
                                        value="20"
                                        readOnly
                                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Grand Total */}
        {data.selectedProducts && data.selectedProducts.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-blue-900">
                Grand Total Measurement
              </h3>
              <span className="text-2xl font-bold text-blue-700">
                {getGrandTotalArea()} m²
              </span>
            </div>
          </div>
        )}

        {/* Plan Upload
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Upload Plan or Sketch (Optional)
          </h3>
          <p className="text-gray-600 mb-4">
            You can upload a plan, sketch, or photo for reference to help us better understand your requirements.
          </p>
          <FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={data.planSketch || null}
            label="Upload plan, sketch, or photo"
          />
        </div> */}
      </div>

      <NavigationButtons isNextDisabled={isNextDisabled()} />
    </div>
  );
};

export default Step4WorktopSizes;
