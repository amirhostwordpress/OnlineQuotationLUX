import { MaterialOption } from '../types';
import { apiRequest, API_BASE } from '../utils/apiUtils';

export async function getAllMaterials() {
  return apiRequest('/material_options');
}

export async function getMaterialById(id: string) {
  return apiRequest(`/material_options/${id}`);
}

export async function createMaterial(data: any) {
  return apiRequest('/material_options', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateMaterial(id: string, data: any) {
  return apiRequest(`/material_options/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteMaterial(id: string) {
  return apiRequest(`/material_options/${id}`, {
    method: 'DELETE',
  });
}

export const materialService = {
  async getAllMaterials(): Promise<MaterialOption[]> {
    try {
      return await apiRequest('/material_options');
    } catch (error) {
      console.error('Error fetching materials:', error);
      return [];
    }
  },

  async getMaterialByColor(colorName: string): Promise<MaterialOption | null> {
    try {
      const materials = await this.getAllMaterials();
      return materials.find(material => material.name === colorName) || null;
    } catch (error) {
      console.error('Error fetching material by color:', error);
      return null;
    }
  },

  async getMaterialPricePerSqm(colorName: string): Promise<number> {
    const material = await this.getMaterialByColor(colorName);
    if (!material) {
      throw new Error(`Material not found for color: ${colorName}`);
    }
    if (material.price_per_sqm == null) {
      throw new Error(`price_per_sqm not set for material: ${colorName}`);
    }
    return parseFloat(material.price_per_sqm);
  }
}; 