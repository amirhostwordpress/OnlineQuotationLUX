import { QuotationData, MaterialOption } from '../types';
import { materialService } from '../services/materialService';
import { findMaterialByName, getMaterialPrice, HARDCODED_MATERIALS } from './materialData';

export interface PricingBreakdown {
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
}

export const calculatePricing = async (
  data: QuotationData
): Promise<PricingBreakdown> => {
  console.log('🔍 Pricing Calculator - Input Data:', {
    serviceLevel: data.serviceLevel,
    selectedProducts: data.selectedProducts,
    productPieces: data.productPieces,
    pieces: data.pieces,
    materialSource: data.materialSource,
    materialColor: data.materialColor,
    sinkCategory: data.sinkCategory,
    sinkType: data.sinkType
  });

  // 1. Calculate total area from new productPieces structure
  let totalAreaM2 = 0;
  const productBreakdown: { [productId: string]: {
    productType: string;
    quantity: number;
    area: number;
    materialCost: number;
    processingCost: number;
    totalCost: number;
  } } = {};

  if (data.selectedProducts && data.selectedProducts.length > 0) {
    // Use new productPieces structure
    for (const product of data.selectedProducts) {
      const pieces = data.productPieces?.[product.id] || {};
             const productArea = Object.values(pieces).reduce((total: number, piece: { area?: number }) => {
         return total + (piece.area || 0);
       }, 0);
      
      totalAreaM2 += productArea * product.quantity;
      
      // Calculate material cost for this product
      let productMaterialCost = 0;
      if (product.materialSource === 'luxone') {
        if (product.materialColor) {
          try {
            // Try to get materials from API first
            const materials = await materialService.getAllMaterials();
            const matchedMaterial = materials.find(
              (m: MaterialOption) =>
                m.color_name?.toLowerCase().trim() === product.materialColor.toLowerCase().trim() &&
                (!m.finishing || m.finishing === (product.finish || 'Polished')) &&
                (!m.thickness || m.thickness === String(product.thickness ?? '20mm'))
            );
            if (matchedMaterial) {
              const pricePerSqm = typeof matchedMaterial.price_per_sqm === 'number'
                ? matchedMaterial.price_per_sqm
                : parseFloat(matchedMaterial.price_per_sqm || '0');
              // Price is per square meter, so use area directly
              productMaterialCost = productArea * pricePerSqm;
              console.log('🏗️ API Material Found:', {
                materialColor: product.materialColor,
                finish: product.finish || 'Polished',
                thickness: product.thickness ?? '20mm',
                pricePerSqm,
                productArea,
                productMaterialCost
              });
            } else {
              // Fallback to hardcoded materials if API material not found
              const hardcodedMaterial = findMaterialByName(
                product.materialColor,
                product.finish || 'Polished',
                String(product.thickness ?? '20mm')
              );
              if (hardcodedMaterial) {
                const pricePerSqm = getMaterialPrice(
                  product.materialColor,
                  product.finish || 'Polished',
                  String(product.thickness ?? '20mm')
                );
                // Price is per square meter, so use area directly
                productMaterialCost = productArea * pricePerSqm;
                console.log('🏗️ Hardcoded Material Found:', {
                  materialColor: product.materialColor,
                  finish: product.finish || 'Polished',
                  thickness: product.thickness ?? '20mm',
                  pricePerSqm,
                  productArea,
                  productMaterialCost
                });
              } else {
                console.log('❌ Material Not Found:', {
                  materialColor: product.materialColor,
                  finish: product.finish || 'Polished',
                  thickness: product.thickness ?? '20mm',
                  availableMaterials: HARDCODED_MATERIALS.map(m => m.color_name)
                });
              }
            }
          } catch (error) {
            console.log('API failed, using hardcoded materials:', error);
            // Fallback to hardcoded materials if API fails
            const hardcodedMaterial = findMaterialByName(
              product.materialColor,
              product.finish || 'Polished',
              String(product.thickness ?? '20mm')
            );
            if (hardcodedMaterial) {
              const pricePerSqft = getMaterialPrice(
                product.materialColor,
                product.finish || 'Polished',
                String(product.thickness ?? '20mm')
              );
              productMaterialCost = productArea * pricePerSqft;
            }
          }
        }
      } else if (product.materialSource === 'luxone-others') {
        const requiredSlabs = parseInt(product.requiredSlabs || '0');
        const pricePerSlab = parseFloat((product.pricePerSlab ? String(product.pricePerSlab).replace(/[^\d.]/g, '') : '0'));
        productMaterialCost = requiredSlabs * pricePerSlab;
      }
      
      // Processing cost only for "Fabrication, Delivery & Installation" service level
      const processingCost = data.serviceLevel === 'fabrication-delivery-installation' ? productArea * 100 : 0;
      
      productBreakdown[product.id] = {
        productType: product.productType,
        quantity: product.quantity,
        area: productArea,
        materialCost: productMaterialCost,
        processingCost: processingCost,
        totalCost: productMaterialCost + processingCost
      };
    }
  } else {
    // Fallback to legacy pieces structure
    const pieces = Object.values(data.pieces || {}).filter(
      (piece) => piece && piece.length && piece.width
    );

    if (pieces.length > 0) {
      totalAreaM2 = pieces.reduce((total, piece) => {
        const length = parseFloat(piece.length) || 0;
        const width = parseFloat(piece.width) || 0;
        return total + length * width;
      }, 0);
    }
  }

  const totalSqm = Math.round(totalAreaM2 * 1000) / 1000;
  const slabSize = 5.12;
  const slabsRequired = Math.ceil(totalSqm / slabSize);
  
  console.log('📏 Area Calculation:', {
    totalAreaM2,
    totalSqm,
    slabsRequired
  });

  // 2. Material cost calculation
  let materialCost = 0;
  
  // Calculate total material cost from product breakdown
  materialCost = Object.values(productBreakdown).reduce((total, product) => {
    return total + product.materialCost;
  }, 0);

  console.log('🏗️ Material Cost Calculation:', {
    materialCost,
    productBreakdown,
    hasLegacyData: !!data.materialSource,
    totalSqm
  });

  // Fallback to legacy calculation if no products
  if (materialCost === 0 && data.materialSource) {
    if (data.materialSource === 'luxone') {
      let pricePerSlab = 0;
      if (data.materialColor) {
        try {
          // Try to get materials from API first
          const materials = await materialService.getAllMaterials();
          const matchedMaterial = materials.find(
            (m: MaterialOption) =>
              m.color_name?.toLowerCase().trim() === data.materialColor.toLowerCase().trim() &&
              (!m.finishing || m.finishing === (data.finish || 'Polished')) &&
              (!m.thickness || m.thickness === String(data.thickness ?? '20mm'))
          );
          if (matchedMaterial) {
            const pricePerSqm = typeof matchedMaterial.price_per_sqm === 'number'
              ? matchedMaterial.price_per_sqm
              : parseFloat(matchedMaterial.price_per_sqm || '0');
            pricePerSlab = pricePerSqm;
          } else {
            // Fallback to hardcoded materials if API material not found
            pricePerSlab = getMaterialPrice(
              data.materialColor,
              data.finish || 'Polished',
              String(data.thickness ?? '20mm')
            );
          }
        } catch (error) {
          console.log('API failed, using hardcoded materials for legacy calculation:', error);
          // Fallback to hardcoded materials if API fails
          pricePerSlab = getMaterialPrice(
            data.materialColor,
            data.finish || 'Polished',
            String(data.thickness ?? '20mm')
          );
        }
      }
      // Price is per square meter, so use area directly
      materialCost = totalSqm * pricePerSlab;
    } else if (data.materialSource === 'luxone-others') {
      const requiredSlabs = parseInt(data.requiredSlabs || '0');
      const pricePerSlab = parseFloat((data.pricePerSlab ? String(data.pricePerSlab).replace(/[^\d.]/g, '') : '0'));
      materialCost = requiredSlabs * pricePerSlab;
    }
  }

  // 3. Basic processing costs (ONLY for Fabrication, Delivery & Installation)
  let cutting = 0;
  let topPolishing = 0;
  let polishing = 0;
  let buttJointPolish = 0;
  let customEdge = 0;
  let hobCutOut = 0;
  let drainGrooves = 0;
  let smallHoles = 0;

  // Only apply processing costs for "Fabrication, Delivery & Installation" service level
  if (data.serviceLevel === 'fabrication-delivery-installation') {
    cutting = totalSqm * 40; // 40 AED/sqm
    topPolishing = totalSqm * 80; // 80 AED/sqm (Top Polishing/Mitred)
    polishing = totalSqm * 40; // 40 AED/sqm

    // Optional add-on services (client selection)
    buttJointPolish = data.buttJointPolish ? totalSqm * 50 : 0; // 50 AED/sqm
    customEdge = data.customEdgeAddon ? 200 : 0; // 200 AED (one-time fixed cost)
    hobCutOut = data.hobCutOutAddon ? 100 : 0; // 100 AED (one-time fixed cost)
    drainGrooves = data.drainGroovesAddon ? 250 : 0; // 250 AED (one set fixed cost)
    smallHoles = data.smallHoles ? data.smallHoles * 25 : 0; // 25 AED per hole
  }

  // 4. Sink options (choose one category) - Available for ALL service levels
  let sinkCost = 0;
  if (data.sinkCategory === 'client') {
    // Category A - Sink Provided by Client
    if (data.sinkType === 'under-mounted') sinkCost = 250; // Under Mounted Sink: 250 AED
    else if (data.sinkType === 'top-mounted') sinkCost = 200; // Top Mounted Sink: 200 AED
  } else if (data.sinkCategory === 'luxone') {
    // Category B - Sink Provided by Luxone
    sinkCost = 900; // Complete Sink Package: 900 AED
  }

  console.log('🚰 Sink Cost Calculation:', {
    sinkCategory: data.sinkCategory,
    sinkType: data.sinkType,
    sinkCost
  });

  // 5. Delivery & Installation (location-based)
  let delivery = 0;
  let installation = 0;

  // Delivery for "Fabrication & Delivery" and "Fabrication, Delivery & Installation"
  if (data.serviceLevel === 'fabrication-delivery' || data.serviceLevel === 'fabrication-delivery-installation') {
    // Packing & Delivery (location-based)
    if (data.deliveryLocation === 'dubai') {
      delivery = 500; // Dubai: 500 AED
    } else {
      delivery = 800; // All other UAE states: 800 AED
    }
  }

  // Installation ONLY for "Fabrication, Delivery & Installation"
  if (data.serviceLevel === 'fabrication-delivery-installation') {
    // Installation: Total sqm × 80 AED
    installation = totalSqm * 80;
  }

  // 6. Calculate subtotal (Sum of all above costs)
  const subtotal = materialCost + cutting + topPolishing + polishing + 
                   buttJointPolish + customEdge + hobCutOut + drainGrooves + 
                   smallHoles + sinkCost + delivery + installation;
  
  // 8. Calculate Company Profit (20% of subtotal)
  const margin = subtotal * 0.20; // 20% profit margin
  const subtotalWithMargin = subtotal + margin; // Subtotal with Profit
  
  // 9. Calculate VAT (5% of subtotal with profit)
  const vat = subtotalWithMargin * 0.05; // 5% VAT
  
  // 10. Calculate GRAND TOTAL (Subtotal with Profit + VAT)
  const grandTotal = subtotalWithMargin + vat;

  console.log('💰 Final Calculation:', {
    materialCost,
    sinkCost,
    delivery,
    installation,
    cutting,
    topPolishing,
    polishing,
    subtotal,
    margin,
    subtotalWithMargin,
    vat,
    grandTotal,
    serviceLevel: data.serviceLevel
  });

  return {
    materialCost,
    cutting,
    topPolishing,
    polishing,
    buttJointPolish,
    customEdge,
    hobCutOut,
    drainGrooves,
    smallHoles,
    sinkCost,
    installation,
    delivery,
    subtotal,
    margin,
    subtotalWithMargin,
    vat,
    grandTotal,
    totalSqm,
    slabsRequired,
    productBreakdown
  };
};
