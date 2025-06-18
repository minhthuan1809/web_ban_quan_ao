import axios from "axios";
import useAuthInfor from "../customHooks/AuthInfor";
let { accessToken } = useAuthInfor() || { accessToken: null };  

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GetAllCode_API = async (searchQuery: string, page: number) => {
    const res = await axios.get(`${API_URL}/coupons?search=${searchQuery}&page=${page}&size=10`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    return res.data;
}

export const createCoupon_API = async (data: any) => {
    const res = await axios.post(`${API_URL}/coupons`, data, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    return res;
}




export const updateCoupon_API = async (id: string, data: any) => {
    const res = await axios.put(`${API_URL}/coupons/${id}`, data, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    return res;
}

export const deleteCoupon_API = async (id: number) => {
    const res = await axios.delete(`${API_URL}/coupons/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return res;
}

// disable coupon
export const disableCoupon_API = async (id: number) => {
    const res = await axios.put(`${API_URL}/coupons/${id}/deactivate`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return res;
}

// enable coupon
export const enableCoupon_API = async (id: number) => {
    const res = await axios.put(`${API_URL}/coupons/${id}/activate`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return res;
}

// get {id} coupon

export const getCouponById_API = async (id: number) => {
    const res = await axios.get(`${API_URL}/coupons/user/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return res;
}
