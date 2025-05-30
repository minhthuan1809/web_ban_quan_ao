import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getProducts_API = async (search: string, page: number, limit: number, sort: string, filter: string) => {
    try {
        const response = await axios.get(`${API_URL}/products?search=${search}&page=${page}&page_size=${limit}&sort=${sort}&filter=${filter}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteProduct_API = async (id: number, token: string) => {
    try {
        const response = await axios.delete(`${API_URL}/products/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const CreateProduct_API = async (data: any, token: string) => {
    try {
        const response = await axios.post(`${API_URL}/products`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
