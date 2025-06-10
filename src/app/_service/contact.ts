import axios from "axios";


// admin
export const getContacts_API = async (data: any) => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/contacts?page=${data.page}&size=${data.size}`);
    return res.data;
}

// client
export const createContact_API = async (data: any) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/contacts`, data);
    return res;
}


// send mail
export const sendMail_API = async (id: number, data: any) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/contacts/${id}/reply`, data);
    return res;
}