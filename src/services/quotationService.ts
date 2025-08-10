import { apiRequest, API_BASE } from '../utils/apiUtils';

export async function submitQuotation(quotation: any) {
  return apiRequest('/quotations', {
    method: 'POST',
    body: JSON.stringify(quotation),
  });
}

export async function submitQuotationPiece(piece: any) {
  return apiRequest('/quotation_pieces', {
    method: 'POST',
    body: JSON.stringify(piece),
  });
}

export async function fetchQuotations() {
  try {
    const rows = await apiRequest('/quotations');
    
    console.log('Raw quotations data:', rows); // Debug log
    
    // Transform to include all database fields
    return rows.map((row: any) => {
      console.log('Processing row:', row); // Debug log
      
      let data = row.quote_data ? (typeof row.quote_data === 'string' ? JSON.parse(row.quote_data) : row.quote_data) : {};
      // Always merge in these fields from the DB columns
      data = {
        ...data,
        name: data.name || row.customer_name || '',
        email: data.email || row.customer_email || '',
        contactNumber: data.contactNumber || row.customer_phone || '',
        location: data.location || row.customer_location || '',
        serviceLevel: data.serviceLevel || row.service_level || '',
        materialType: data.materialType || row.material_type || '',
        materialColor: data.materialColor || row.material_color || '',
        worktopLayout: data.worktopLayout || row.worktop_layout || '',
        timeline: data.timeline || row.timeline || '',
        projectType: data.projectType || row.project_type || '',
        additionalComments: data.additionalComments || row.additional_comments || ''
      };
      
      const processedRow = {
        id: row.quote_id || row.id || `temp-${Date.now()}`,
        quote_id: row.quote_id || row.id || `temp-${Date.now()}`,
        customer_name: row.customer_name || '',
        customer_email: row.customer_email || '',
        customer_phone: row.customer_phone || '',
        customer_location: row.customer_location || '',
        service_level: row.service_level || '',
        material_source: row.material_source || '',
        material_type: row.material_type || '',
        material_color: row.material_color || '',
        worktop_layout: row.worktop_layout || '',
        project_type: row.project_type || '',
        timeline: row.timeline || '',
        sink_option: row.sink_option || '',
        additional_comments: row.additional_comments || '',
        quote_data: row.quote_data || {},
        pricing_data: row.pricing_data || null,
        total_area: row.total_area || 0,
        total_amount: row.total_amount || 0,
        currency: row.currency || 'AED',
        status: row.status || 'pending',
        created_at: row.created_at || new Date().toISOString(),
        updated_at: row.updated_at || new Date().toISOString(),
        data,
        createdAt: row.created_at || new Date().toISOString()
      };
      
      console.log('Processed row:', processedRow); // Debug log
      return processedRow;
    });
  } catch (error) {
    console.error('Error fetching quotations:', error);
    throw error;
  }
}

export async function fetchQuotationPieces(quotationId: number) {
  return apiRequest(`/quotation_pieces?quotation_id=${quotationId}`);
}

export async function fetchQuotationFiles(quotationId: number) {
  return apiRequest(`/quotation_files?quotation_id=${quotationId}`);
} 