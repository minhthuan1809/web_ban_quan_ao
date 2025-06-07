import axios from "axios";


// admin
export const getContacts_API = async (data: any) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/contact?page=${data.page}&size=${data.size}&search=${data.search}`);
    return res.data;
}

// client
export const createContact_API = async (data: any) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/contacts`, data);
    return res;
}
