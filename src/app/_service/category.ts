import axios, { AxiosInstance, AxiosResponse } from "axios";
import { toast } from "react-toastify";

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Add any global request configs here
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// TypeScript Interfaces
interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

interface Material {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

interface Team {
  id: string;
  name: string;
  description?: string;
  members?: any[];
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

interface PaginationParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  filter?: string;
}

// Helper function to create auth headers
const createAuthHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

// MATERIAL SERVICES
export const materialService = {
  /**
   * Get materials with pagination and filters
   */
  async getMaterials(params: PaginationParams = {}): Promise<ApiResponse<Material[]>> {
    const {
      search = "",
      page = 1,
      pageSize = 10,
      sort = "createdAt:desc",
      filter = ""
    } = params;

    try {
      const response: AxiosResponse<ApiResponse<Material[]>> = await apiClient.get('/materials', {
        params: {
          search,
          page,
          page_size: pageSize,
          sort,
          filter
        }
      });
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    }
  },

  /**
   * Add new material
   */
  async addMaterial(name: string, accessToken: string): Promise<AxiosResponse<Material>> {
    try {
      const response = await apiClient.post('/materials', 
        { name },
        { headers: createAuthHeaders(accessToken) }
      );
      return response;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    }
  },

  /**
   * Update material
   */
  async updateMaterial(id: string, name: string, accessToken: string): Promise<AxiosResponse<Material>> {
    try {
      const response = await apiClient.put(`/materials/${id}`,
        { name },
        { headers: createAuthHeaders(accessToken) }
      );
      return response;
    } catch (error) {
      console.error('Error updating material:', error);
      throw error;
    }
  },

  /**
   * Delete material
   */
  async deleteMaterial(id: string, accessToken: string): Promise<AxiosResponse<void>> {
    try {
      const response = await apiClient.delete(`/materials/${id}`, {
        headers: createAuthHeaders(accessToken)
      });
      return response;
    } catch (error) {
      console.error('Error deleting material:', error);
      throw error;
    }
  }
};

// CATEGORY SERVICES
export const categoryService = {
  /**
   * Get categories with pagination and filters
   */
  async getCategories(params: PaginationParams = {}): Promise<ApiResponse<Category[]>> {
    const {
      search = "",
      page = 1,
      pageSize = 10,
      sort = "createdAt:desc",
      filter = ""
    } = params;

    try {
      const response: AxiosResponse<ApiResponse<Category[]>> = await apiClient.get('/categories', {
        params: {
          search,
          page,
          page_size: pageSize,
          sort,
          filter
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Add new category
   */
  async addCategory(name: string, accessToken: string): Promise<AxiosResponse<Category>> {
    try {
      const response = await apiClient.post('/categories',
        { name },
        { headers: createAuthHeaders(accessToken) }
      );
      return response;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  /**
   * Update category
   */
  async updateCategory(id: string, name: string, accessToken: string): Promise<AxiosResponse<Category>> {
    try {
      const response = await apiClient.put(`/categories/${id}`,
        { name },
        { headers: createAuthHeaders(accessToken) }
      );
      return response;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  /**
   * Delete category
   */
  async deleteCategory(id: string, accessToken: string): Promise<AxiosResponse<void>> {
    try {
      const response = await apiClient.delete(`/categories/${id}`, {
        headers: createAuthHeaders(accessToken)
      });
      return response;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
};

// TEAM SERVICES
export const teamService = {
  /**
   * Get teams with pagination and filters
   */
  async getTeams(params: PaginationParams = {}): Promise<ApiResponse<Team[]>> {
    const {
      search = "",
      page = 1,
      pageSize = 10,
      sort = "createdAt:desc",
      filter = ""
    } = params;

    try {
      const response: AxiosResponse<ApiResponse<Team[]>> = await apiClient.get('/teams', {
        params: {
          search,
          page,
          page_size: pageSize,
          sort,
          filter
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  },

  /**
   * Add new team
   */
  async addTeam(data: Partial<Team>, accessToken: string): Promise<AxiosResponse<Team>> {
    try {
      const response = await apiClient.post('/teams',
        data,
        { headers: createAuthHeaders(accessToken) }
      );
      return response;
    } catch (error) {
      console.error('Error adding team:', error);
      throw error;
    }
  },

  /**
   * Update team
   */
  async updateTeam(id: string, data: Partial<Team>, accessToken: string): Promise<AxiosResponse<Team>> {
    try {
      const response = await apiClient.put(`/teams/${id}`,
        data,
        { headers: createAuthHeaders(accessToken) }
      );
      return response;
    } catch (error) {
      console.error('Error updating team:', error);
      throw error;
    }
  },

  /**
   * Delete team
   */
  async deleteTeam(id: string, accessToken: string): Promise<AxiosResponse<void>> {
    try {
      const response = await apiClient.delete(`/teams/${id}`, {
        headers: createAuthHeaders(accessToken)
      });
      return response;
    } catch (error) {
      console.error('Error deleting team:', error);
      throw error;
    }
  }
};

// Legacy API exports for backward compatibility
export const getmaterial_API = materialService.getMaterials;
export const addMaterial_API = materialService.addMaterial;
export const updateMaterial_API = materialService.updateMaterial;
export const deleteMaterial_API = materialService.deleteMaterial;

export const getCategory_API = categoryService.getCategories;
export const addCategory_API = categoryService.addCategory;
export const updateCategory_API = categoryService.updateCategory;
export const deleteCategory_API = categoryService.deleteCategory;

export const getTeam_API = teamService.getTeams;
export const addTeam_API = teamService.addTeam;
export const updateTeam_API = teamService.updateTeam;
export const deleteTeam_API = teamService.deleteTeam;

// Export the API client for custom use
export { apiClient };


