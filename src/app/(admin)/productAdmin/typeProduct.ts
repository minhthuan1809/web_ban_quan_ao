interface Variant {
    id: number;
    size: string;
    priceAdjustment: number;
    stockQuantity: number;
    createdAt: number;
    updatedAt: number;
    isDeleted: boolean;
  }
  
  interface Team {
    id: number;
    name: string;
    country: string;
    league: string;
    logoUrl: string;
    createdAt: number;
    updatedAt: number;
    isDeleted: boolean;
  }
  
  interface Material {
    id: number;
    name: string;
    slug: string;
    createdAt: number;
    updatedAt: number;
    isDeleted: boolean;
  }
  
  interface Category {
    id: number;
    name: string;
    slug: string;
    createdAt: number;
    updatedAt: number;
  }
  
  export interface Product {
    id: number;
    name: string;
    code: string;
    description: string;
    price: number;
    salePrice: number;
    imageUrls: string[];
    jerseyType: string;
    season: string;
    slug: string;
    isDeleted: boolean;
    isFeatured: boolean;
    createdAt: number;
    updatedAt: number;
    team: Team;
    material: Material;
    category: Category;
    variants: Variant[];
  }
  