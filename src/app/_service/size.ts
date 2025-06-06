import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GetAllSize_API = async (search: string = "", page: number = 1, accessToken?: string) => {
    const queryParams = new URLSearchParams({
        search: search,
        page: page.toString()
    });

    const res = await axios.get(`${API_URL}/sizes?${queryParams.toString()}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        },
    });
    return res.data;
}

export const DeleteSize_API = async (id: string, accessToken?: string) => {
    const res = await axios.delete(`${API_URL}/sizes/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        },
    });
    return res.data;
}

export const addSize_API = async (name: string, accessToken?: string) => {
    const res = await axios.post(`${API_URL}/sizes`, { name }, {
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        },
    });
    return res;
}

export const updateSize_API = async (id: string, name: string, accessToken?: string) => {
    const res = await axios.put(`${API_URL}/sizes/${id}`, { name }, {
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        },
    });
    return res;
}