import axios from "axios";
import useAuthInfor from "../customHooks/AuthInfor";
let { accessToken } = useAuthInfor() || { accessToken: null };  

const API_URL = process.env.NEXT_PUBLIC_API_URL;

 export const GetAllCode_API = async () => {
    const res = await axios.get(`${API_URL}/coupons`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    return res.data;
}


