export interface MaterialOption {
  id?: number;
  category: string;
  brand: string;
  name: string;
  price_per_sqm: string | number;
  slab_size: string;
  thickness_options: string;
  finish_options: string;
  color_name?: string;
  finishing?: string;
  thickness?: string;
}

export const HARDCODED_MATERIALS: MaterialOption[] = [
  {
    category: "quartz",
    brand: "Luxone",
    name: "Golden River",
    price_per_sqm: "280.00",
    slab_size: "3200x1600mm",
    thickness_options: "[\"20mm\"]",
    finish_options: "[\"Polished\"]",
    color_name: "Golden River",
    finishing: "Polished",
    thickness: "20mm"
  },
  {
    category: "quartz",
    brand: "Luxone",
    name: "The Grold",
    price_per_sqm: "280.00",
    slab_size: "3200x1600mm",
    thickness_options: "[\"20mm\"]",
    finish_options: "[\"Polished\"]",
    color_name: "The Grold",
    finishing: "Polished",
    thickness: "20mm"
  },
  {
    category: "quartz",
    brand: "Luxone",
    name: "Megistic White",
    price_per_sqm: "260.00",
    slab_size: "3200x1600mm",
    thickness_options: "[\"20mm\"]",
    finish_options: "[\"Polished\"]",
    color_name: "Megistic White",
    finishing: "Polished",
    thickness: "20mm"
  },
  {
    category: "quartz",
    brand: "Luxone",
    name: "Royal Statuario",
    price_per_sqm: "280.00",
    slab_size: "3200x1600mm",
    thickness_options: "[\"20mm\"]",
    finish_options: "[\"Polished\"]",
    color_name: "Royal Statuario",
    finishing: "Polished",
    thickness: "20mm"
  },
  {
    category: "quartz",
    brand: "Luxone",
    name: "White Pazzal",
    price_per_sqm: "320.00",
    slab_size: "3200x1600mm",
    thickness_options: "[\"20mm\"]",
    finish_options: "[\"Polished\"]",
    color_name: "White Pazzal",
    finishing: "Polished",
    thickness: "20mm"
  },
  {
    category: "quartz",
    brand: "Luxone",
    name: "Universe Grey",
    price_per_sqm: "280.00",
    slab_size: "3200x1600mm",
    thickness_options: "[\"20mm\"]",
    finish_options: "[\"Polished\"]",
    color_name: "Universe Grey",
    finishing: "Polished",
    thickness: "20mm"
  },
  {
    category: "quartz",
    brand: "Luxone",
    name: "The Saint",
    price_per_sqm: "320.00",
    slab_size: "3200x1600mm",
    thickness_options: "[\"20mm\"]",
    finish_options: "[\"Polished\"]",
    color_name: "The Saint",
    finishing: "Polished",
    thickness: "20mm"
  },
  {
    category: "quartz",
    brand: "Luxone",
    name: "The Saint",
    price_per_sqm: "350.00",
    slab_size: "3200x1600mm",
    thickness_options: "[\"20mm\"]",
    finish_options: "[\"Matt\"]",
    color_name: "The Saint",
    finishing: "Matt",
    thickness: "20mm"
  },
  {
    category: "quartz",
    brand: "Luxone",
    name: "Super Wave",
    price_per_sqm: "320.00",
    slab_size: "3200x1600mm",
    thickness_options: "[\"20mm\"]",
    finish_options: "[\"Polished\"]",
    color_name: "Super Wave",
    finishing: "Polished",
    thickness: "20mm"
  },
  {
    category: "quartz",
    brand: "Luxone",
    name: "White Beauty",
    price_per_sqm: "320.00",
    slab_size: "3200x1600mm",
    thickness_options: "[\"20mm\"]",
    finish_options: "[\"Polished\"]",
    color_name: "White Beauty",
    finishing: "Polished",
    thickness: "20mm"
  },
  {
    category: "quartz",
    brand: "Luxone",
    name: "Grey Leather",
    price_per_sqm: "280.00",
    slab_size: "3200x1600mm",
    thickness_options: "[\"20mm\"]",
    finish_options: "[\"Leather\"]",
    color_name: "Grey Leather",
    finishing: "Leather",
    thickness: "20mm"
  },
  {
    category: "quartz",
    brand: "Luxone",
    name: "Strike Light",
    price_per_sqm: "280.00",
    slab_size: "3200x1600mm",
    thickness_options: "[\"20mm\"]",
    finish_options: "[\"Polished\"]",
    color_name: "Strike Light",
    finishing: "Polished",
    thickness: "20mm"
  },
  {
    category: "quartz",
    brand: "Luxone",
    name: "Grey Wonder",
    price_per_sqm: "320.00",
    slab_size: "3200x1600mm",
    thickness_options: "[\"20mm\"]",
    finish_options: "[\"Polished\"]",
    color_name: "Grey Wonder",
    finishing: "Polished",
    thickness: "20mm"
  },
  {
    category: "quartz",
    brand: "Luxone",
    name: "Supreme Taj",
    price_per_sqm: "320.00",
    slab_size: "3200x1600mm",
    thickness_options: "[\"20mm\"]",
    finish_options: "[\"Polished\"]",
    color_name: "Supreme Taj",
    finishing: "Polished",
    thickness: "20mm"
  },
  {
    category: "quartz",
    brand: "Luxone",
    name: "Golden Track",
    price_per_sqm: "320.00",
    slab_size: "3200x1600mm",
    thickness_options: "[\"20mm\"]",
    finish_options: "[\"Polished\"]",
    color_name: "Golden Track",
    finishing: "Polished",
    thickness: "20mm"
  },
  {
    category: "quartz",
    brand: "Luxone",
    name: "The Ambience",
    price_per_sqm: "320.00",
    slab_size: "3200x1600mm",
    thickness_options: "[\"20mm\"]",
    finish_options: "[\"Leather\"]",
    color_name: "The Ambience",
    finishing: "Leather",
    thickness: "20mm"
  },
  {
    category: "quartz",
    brand: "Luxone",
    name: "The Glacier",
    price_per_sqm: "320.00",
    slab_size: "3200x1600mm",
    thickness_options: "[\"20mm\"]",
    finish_options: "[\"Polished\"]",
    color_name: "The Glacier",
    finishing: "Polished",
    thickness: "20mm"
  },
  {
    category: "quartz",
    brand: "Luxone",
    name: "Imperial White",
    price_per_sqm: "320.00",
    slab_size: "3200x1600mm",
    thickness_options: "[\"20mm\"]",
    finish_options: "[\"Polished\"]",
    color_name: "Imperial White",
    finishing: "Polished",
    thickness: "20mm"
  },
  {
    category: "quartz",
    brand: "Luxone",
    name: "Ambience Touch",
    price_per_sqm: "320.00",
    slab_size: "3200x1600mm",
    thickness_options: "[\"20mm\"]",
    finish_options: "[\"Polished\"]",
    color_name: "Ambience Touch",
    finishing: "Polished",
    thickness: "20mm"
  },
  {
    category: "quartz",
    brand: "Luxone",
    name: "Amazed Grey",
    price_per_sqm: "320.00",
    slab_size: "3200x1600mm",
    thickness_options: "[\"20mm\"]",
    finish_options: "[\"Polished\"]",
    color_name: "Amazed Grey",
    finishing: "Polished",
    thickness: "20mm"
  },
  {
    category: "quartz",
    brand: "Luxone",
    name: "Moon White",
    price_per_sqm: "220.00",
    slab_size: "3200x1600mm",
    thickness_options: "[\"20mm\"]",
    finish_options: "[\"Polished\"]",
    color_name: "Moon White",
    finishing: "Polished",
    thickness: "20mm"
  }
];

// Utility function to find material by name, finishing, and thickness
export const findMaterialByName = (
  colorName: string, 
  finishing: string = 'Polished', 
  thickness: string = '20mm'
): MaterialOption | undefined => {
  return HARDCODED_MATERIALS.find(material => 
    material.color_name?.toLowerCase().trim() === colorName.toLowerCase().trim() &&
    material.finishing === finishing &&
    material.thickness === thickness
  );
};

// Utility function to get all materials
export const getAllHardcodedMaterials = (): MaterialOption[] => {
  return HARDCODED_MATERIALS;
};

// Utility function to get materials by category
export const getMaterialsByCategory = (category: string): MaterialOption[] => {
  return HARDCODED_MATERIALS.filter(material => material.category === category);
};

// Utility function to get unique material names
export const getUniqueMaterialNames = (): string[] => {
  const names = HARDCODED_MATERIALS.map(material => material.color_name || material.name);
  return [...new Set(names)].filter(Boolean);
};

// Utility function to get price per sqm for a material
export const getMaterialPrice = (
  colorName: string, 
  finishing: string = 'Polished', 
  thickness: string = '20mm'
): number => {
  const material = findMaterialByName(colorName, finishing, thickness);
  if (material) {
    return typeof material.price_per_sqm === 'number' 
      ? material.price_per_sqm 
      : parseFloat(material.price_per_sqm || '0');
  }
  return 0;
}; 
