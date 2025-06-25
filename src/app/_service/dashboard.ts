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
    year?: number;
    month?: number;
    date?: string;
  }
): Promise<DashboardSummaryResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.year) queryParams.append('year', params.year.toString());
  if (params?.month) queryParams.append('month', params.month.toString());
  if (params?.date) queryParams.append('date', params.date);

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
  date: string,
  accessToken?: string
): Promise<RevenueStatResponse> => {
  const res = await axios.get(`${API_URL}/statistics/revenue/daily?date=${date}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    },
  });
  return res.data;
};

// Thống kê doanh thu theo tháng
export const getMonthlyRevenue = async (
  year: number,
  month: number,
  accessToken?: string
): Promise<RevenueStatResponse> => {
  const res = await axios.get(`${API_URL}/statistics/revenue/monthly?year=${year}&month=${month}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    },
  });
  return res.data;
};

// Thống kê doanh thu theo năm
export const getYearlyRevenue = async (
  year: number,
  accessToken?: string
): Promise<RevenueStatResponse> => {
  const res = await axios.get(`${API_URL}/statistics/revenue/yearly?year=${year}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    },
  });
  return res.data;
};

// Top sản phẩm bán chạy theo ngày
export const getTopSellingProductsDaily = async (
  date: string,
  limit: number = 10,
  accessToken?: string
): Promise<ProductSalesResponse[]> => {
  const res = await axios.get(`${API_URL}/statistics/products/top-selling/daily?date=${date}&limit=${limit}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    },
  });
  return res.data;
};

// Top sản phẩm bán chạy theo tháng
export const getTopSellingProductsMonthly = async (
  year: number,
  month: number,
  limit: number = 10,
  accessToken?: string
): Promise<ProductSalesResponse[]> => {
  const res = await axios.get(`${API_URL}/statistics/products/top-selling/monthly?year=${year}&month=${month}&limit=${limit}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    },
  });
  return res.data;
};

// Top sản phẩm bán chạy theo năm
export const getTopSellingProductsYearly = async (
  year: number,
  limit: number = 10,
  accessToken?: string
): Promise<ProductSalesResponse[]> => {
  const res = await axios.get(`${API_URL}/statistics/products/top-selling/yearly?year=${year}&limit=${limit}`, {
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
  limit: number = 10,
  accessToken?: string
): Promise<UserStatResponse[]> => {
  const res = await axios.get(`${API_URL}/statistics/users/top-customers?limit=${limit}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    },
  });
  return res.data;
};

// Legacy function for backward compatibility
export const getDashboardStats = getDashboardSummary;

const getDashboard_API = async (accessToken: string) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/statistics/dashboard`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data;
}

export { getDashboard_API };

// top sản phẩm tháng

