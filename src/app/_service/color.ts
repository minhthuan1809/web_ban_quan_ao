import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GetAllColor_API = async (search: string = "", page: number = 1, accessToken?: string) => {
    const queryParams = new URLSearchParams({
        search: search,
        page: page.toString()
    });

    const res = await axios.get(`${API_URL}/colors?${queryParams.toString()}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        },
    });
    return res.data;
}

// Xóa màu sắc
export const DeleteColor_API = async (id: string, accessToken?: string) => {
    const res = await axios.delete(`${API_URL}/colors/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        },
    });
    return res;
}


// Thêm màu sắc
export const addColor_API = async (name: string, code: string, accessToken?: string) => {
    const res = await axios.post(`${API_URL}/colors`, { name, hexColor : code }, {
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        },
    });
    return res;
}

// Sửa màu sắc
export const updateColor_API = async (id: string, name: string, code: string, accessToken?: string) => {
    const res = await axios.put(`${API_URL}/colors/${id}`, { name, hexColor : code }, {
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        },
    });
    return res;
}