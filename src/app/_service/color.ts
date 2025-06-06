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

export const DeleteColor_API = async (id: string, accessToken?: string) => {
    const res = await axios.delete(`${API_URL}/colors/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        },
    });
    return res.data;
}

export const addColor_API = async (name: string, accessToken?: string) => {
    const res = await axios.post(`${API_URL}/colors`, { name }, {
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        },
    });
    return res;
}

export const updateColor_API = async (id: string, name: string, accessToken?: string) => {
    const res = await axios.put(`${API_URL}/colors/${id}`, { name }, {
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        },
    });
    return res;
}