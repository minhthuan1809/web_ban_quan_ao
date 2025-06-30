import axios, { AxiosResponse, AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiResponse<T = any> {
  status: number;
  data: T;
  message?: string;
}

interface UserCreateData {
  fullName: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  district: string;
  ward: string;
  gender: string;
  roleId: number;
  avatarUrl?: string;
}

interface UserUpdateData extends Omit<UserCreateData, 'password'> {
  password?: string;
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generic error handler
const handleApiError = (error: AxiosError, operation: string): never => {
  console.error(`${operation} failed:`, error.response?.data || error.message);
  throw error;
};

// Delete user
export const deleteUser_API = async (id: number, token: string): Promise<AxiosResponse> => {
  try {
    const response = await apiClient.delete(`/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error as AxiosError, 'Delete user');
  }
};

// Create user
export const CreateUser_API = async (data: UserCreateData, token: string): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const payload = {
      ...data,
      isAdmin: true,
    };
    
    const response = await apiClient.post('/users', payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error as AxiosError, 'Create user');
  }
};

// Update user
export const UpdateUser_API = async (id: number, data: UserUpdateData, token: string): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const payload = {
      "fullName": data.fullName,
      "phone": data.phone,
      "token": token,
      "address": data.address,
      "district": data.district,
      "ward": data.ward,
      "gender": data.gender,
      "avatarUrl": data.avatarUrl,
      "roleId": data.roleId
    };
    
    const response = await apiClient.put(`/auth/update-profile`, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error as AxiosError, 'Update user');
  }
};

// Get all users
export const getUserById_API = async (token: string): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const response = await apiClient.get('/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error as AxiosError, 'Get users');
  }
};

// Get user by specific ID (optional - if needed)
export const getUserBySpecificId_API = async (id: number, token: string): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const response = await apiClient.get(`/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error as AxiosError, 'Get user by ID');
  }
};

// Search users with filters
export const searchUsers_API = async (
  token: string, 
  filters?: {
    search?: string;
    role?: number;
    page?: number;
    limit?: number;
  }
): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.role) params.append('role', filters.role.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const response = await apiClient.get(`/users${params.toString() ? '?' + params.toString() : ''}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error as AxiosError, 'Search users');
  }
};

export default {
  deleteUser_API,
  CreateUser_API,
  UpdateUser_API,
  getUserById_API,
  getUserBySpecificId_API,
  searchUsers_API,
};