import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getDashboardStats = async (accessToken?: string) => {
    const res = await axios.get(`${API_URL}/statistics/dashboard`, {
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        },
    });
    return res.data;
} 


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

