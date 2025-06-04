import axios from "axios";
import useAuthInfor from "../customHooks/AuthInfor";
let { accessToken } = useAuthInfor() || { accessToken: null };

export const CreateCard_API = async (data: any) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cart_items`, data, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    return res;
}

export const GetCard_API = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart_items`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    return res;
}

export const DeleteCard_API = async (id: string) => {  
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cart_items/${id}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    return res;
}

export const UpdateCard_API = async (id: string, data: any) => {           
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/cart_items/${id}`, data, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    return res;
}

