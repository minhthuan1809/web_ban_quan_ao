import axios from "axios";
import { 
  DashboardSummaryResponse, 
  RevenueStatResponse, 
  ProductSalesResponse, 
  UserStatResponse 
} from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Dashboard tổng quan
export const getDashboardSummary = async (
  accessToken?: string,
  params?: {
    startDate?: string;
    endDate?: string;
  }
): Promise<DashboardSummaryResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);

  const res = await axios.get(`${API_URL}/statistics/dashboard?${queryParams}`, { 
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    },
  });
  return res.data;
};

// Thống kê doanh thu theo ngày
export const getDailyRevenue = async (
  startDate: string,
  endDate: string,
  accessToken?: string
): Promise<RevenueStatResponse> => {
  const res = await axios.get(`${API_URL}/statistics/revenue/daily?startDate=${startDate}&endDate=${endDate}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    },
  });
  return res.data;
};

// Thống kê doanh thu theo tháng
export const getMonthlyRevenue = async (
  startDate: string,
  endDate: string,
  accessToken?: string
): Promise<RevenueStatResponse> => {
  const res = await axios.get(`${API_URL}/statistics/revenue/monthly?startDate=${startDate}&endDate=${endDate}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    },
  });
  return res.data;
};

// Thống kê doanh thu theo năm
export const getYearlyRevenue = async (
  startDate: string,
  endDate: string,
  accessToken?: string
): Promise<RevenueStatResponse> => {
  const res = await axios.get(`${API_URL}/statistics/revenue/yearly?startDate=${startDate}&endDate=${endDate}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    },
  });
  return res.data;
};

// Top sản phẩm bán chạy theo ngày
export const getTopSellingProductsDaily = async (
  startDate: string,
  endDate: string,
  limit: number = 10,
  accessToken?: string
): Promise<ProductSalesResponse[]> => {
  const res = await axios.get(`${API_URL}/statistics/products/top-selling/daily?startDate=${startDate}&endDate=${endDate}&limit=${limit}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    },
  });
  return res.data;
};

// Top sản phẩm bán chạy theo tháng
export const getTopSellingProductsMonthly = async (
  startDate: string,
  endDate: string,
  limit: number = 10,
  accessToken?: string
): Promise<ProductSalesResponse[]> => {
  const res = await axios.get(`${API_URL}/statistics/products/top-selling/monthly?startDate=${startDate}&endDate=${endDate}&limit=${limit}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    },
  });
  return res.data;
};

// Top sản phẩm bán chạy theo năm
export const getTopSellingProductsYearly = async (
  startDate: string,
  endDate: string,
  limit: number = 10,
  accessToken?: string
): Promise<ProductSalesResponse[]> => {
  const res = await axios.get(`${API_URL}/statistics/products/top-selling/yearly?startDate=${startDate}&endDate=${endDate}&limit=${limit}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    },
  });
  return res.data;
};

// Thống kê tổng chi tiêu của người dùng
export const getUsersWithTotalSpent = async (
  accessToken?: string
): Promise<UserStatResponse[]> => {
  const res = await axios.get(`${API_URL}/statistics/users/spending`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    },
  });
  return res.data;
};

// Top khách hàng chi tiêu nhiều nhất
export const getTopCustomers = async (
  startDate: string,
  endDate: string,
  limit: number = 10,
  accessToken?: string
): Promise<UserStatResponse[]> => {
  const res = await axios.get(`${API_URL}/statistics/users/top-customers?startDate=${startDate}&endDate=${endDate}&limit=${limit}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    },
  });
  return res.data;
};

// Legacy function for backward compatibility
export const getDashboardStats = getDashboardSummary;

const getDashboard_API = async (
  accessToken: string,
  params?: {
    year?: number;
    month?: number;
    day?: number;
  }
) => {
    const queryParams = new URLSearchParams();
    if (params?.year) queryParams.append('year', params.year.toString());
    if (params?.month) queryParams.append('month', params.month.toString());
    if (params?.day) queryParams.append('day', params.day.toString());
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/statistics/dashboard${queryString}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
}

export { getDashboard_API };

// top sản phẩm tháng

