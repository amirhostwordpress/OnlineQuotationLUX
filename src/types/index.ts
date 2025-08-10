export interface QuotationData {
  // Step 1: Scope of Work
  serviceLevel: 'fabrication' | 'fabrication-delivery' | 'fabrication-delivery-installation' | '';
  
  // Step 2: Product Selection (Updated for dynamic multi-product)
  selectedProducts: ProductSelection[];
  
  // Legacy fields for backward compatibility (will be deprecated)
  materialSource: 'luxone' | 'yourself' | 'luxone-others' | '';
  materialType: 'quartz' | 'porcelain' | '';
  materialColor: string;
  
  // For "By Yourself" option
  slabSize?: string;
  thickness?: string;
  finish?: string;
  numberOfSlabs?: number;
  slabPhoto?: File | null;
  
  // For "Luxone Others" option
  luxoneOthersSlabSize?: string;
  luxoneOthersThickness?: string;
  luxoneOthersFinish?: string;
  requiredSlabs?: string;
  pricePerSlab?: string;
  brandSupplier?: string;
  luxoneOthersColorName?: string;
  
  // Step 3: Worktop Layout
  worktopLayout: 'u-island' | 'u-shape' | 'l-island' | 'l-shape' | 'galley' | '1-piece' | 'custom' | '';
  
  // Step 4: Worktop Sizes (Updated for per-product pieces)
  productPieces: {
    [productId: string]: {
      [pieceId: string]: {
        length: string;
        width: string;
        thickness: string;
        area: number; // Calculated area in sqm
      };
    };
  };
  
  // Legacy pieces field for backward compatibility
  pieces: {
    [key: string]: {
      length: string;
      width: string;
      thickness: string;
    };
  };
  planSketch?: File | null;
  
  // Step 5: Design Options
  customEdge: 'YES' | 'NO' | '';
  sinkCutOut: 0 | 1 | 2 | '';
  hobCutOut: 0 | 1 | 2 | '';
  underMountedSink: 'YES' | 'NO' | '';
  steelFrame: 'YES' | 'NO' | '';
  cutOuts: string;
  tapHoles: string;
  upstands: string;
  drainGrooves: string;
  // New Add-on Options
  buttJointPolish?: boolean; // Butt Joint & Polish (per sqm)
  customEdgeAddon?: boolean; // Custom Edge (fixed)
  hobCutOutAddon?: boolean; // Hob Cut Out (fixed)
  drainGroovesAddon?: boolean; // Drain Grooves (fixed)
  smallHoles?: number; // Small Holes (quantity)
  // Sink Options
  sinkCategory?: 'client' | 'luxone'; // Category A or B
  sinkType?: 'under-mounted' | 'top-mounted' | 'complete-package' | ''; // Sink type
  
  // Step 6: Timeline
  timeline: 'asap-2weeks' | '3-6weeks' | '6weeks-plus' | '';
  
  // Step 5: Design Options (Sink)
  sinkOption: string;
  sinkStyle: 'drop-in' | 'top-mount' | '';
  
  // Step 7: Project Type
  projectType: string;
  
  // Step 8: Contact Information
  name: string;
  email?: string;
  contactNumber: string;
  location: 'Dubai' | 'Abu Dhabi' | 'Sharjah' | 'Ajman' | 'Umm Al Quwain' | 'Ras Al Khaimah' | 'Fujairah' | '';
  deliveryLocation?: 'dubai' | 'other'; // For delivery cost calculation
  additionalComments: string;
  
  // Designer Information
  designerName?: string;
  designerContact?: string;
  designerEmail?: string;

  // User-supplied material options
  otherMaterialType?: string;
  otherMaterialColor?: string;
}

// New interfaces for the enhanced product selection system
export interface ProductPiece {
  length: string;
  width: string;
  thickness: string;
  area: number; // Calculated area in sqm
}

export interface ProductSelection {
  id: string;
  productType: 'Kitchen Top' | 'Island' | 'Backsplash' | 'Bar BQ Counter' | 'Flooring' | 'Walls' | 'Staircase';
  quantity: number;
  materialSource: 'luxone' | 'yourself' | 'luxone-others' | '';
  materialType: 'quartz' | 'porcelain' | '';
  materialColor: string;
  
  // For "By Yourself" option
  slabSize?: string;
  thickness?: string;
  finish?: string;
  numberOfSlabs?: number;
  slabPhoto?: File | null;
  
  // For "Luxone Others" option
  luxoneOthersSlabSize?: string;
  luxoneOthersThickness?: string;
  luxoneOthersFinish?: string;
  requiredSlabs?: string;
  pricePerSlab?: string;
  brandSupplier?: string;
  luxoneOthersColorName?: string;
  
  // Calculated fields
  totalAvailableArea?: number; // Calculated from slab specifications
  
  // For "Luxone Own" option
  selectedMaterialId?: number;
  
  // Pieces management
  pieces?: {
    [pieceId: string]: ProductPiece;
  };
  
  // Calculated fields
  totalUsedArea?: number; // Total area of all pieces for this product
  remainingArea?: number; // Available area minus used area
}

export interface QuotationContextType {
  data: QuotationData;
  updateData: (updates: Partial<QuotationData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
  isQuoteSubmitted: boolean;
  quoteId: string;
  submitQuote: () => void;
  resetQuotation: () => void;
}

export interface MaterialOption {
  id: number;
  category: 'quartz' | 'porcelain';
  brand: string;
  name: string;
  color_code?: string | null;
  price_per_sqm: string;
  slab_size: string;
  thickness_options: string;
  finish_options: string;
  is_available: number;
  display_order: number;
  image_url?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
  
  // Legacy fields for backward compatibility
  type?: 'quartz' | 'porcelain';
  color_name?: string;
  finishing?: string | null;
  thickness?: string | null;
  slab_qty_sqm?: number | null;
}