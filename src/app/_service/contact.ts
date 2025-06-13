import axios from "axios";
import useAuthInfor from "@/app/customHooks/AuthInfor";
import { Contact } from '@/app/(admin)/contacts/typecontac';

const { accessToken , userInfo } = useAuthInfor();

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// admin
export const getContacts_API = async (data: any) => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/contacts?page=${data.page}&size=${data.size}&search=${data.search}`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
    return res.data;
}

// client
export const createContact_API = async (data: any) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/contacts`, data, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
    return res;
}


// send mail
export const sendMail_API = async (id: number, data: any) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/contacts/${id}/reply?adminId=${userInfo?.id}`, data, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
        return res;
}


// history contact
  export const getHistoryContact_API = async (searchValue: string) => {
  
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/contacts/history?email=${userInfo?.email}&search=${searchValue}`, {
            headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
    });
    return res.data;
}

export const getAllContacts_API = async (page: number = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/contacts`, {
      params: {
        page: page - 1,
        size: 10
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateContactStatus_API = async (contactId: number, status: 'PENDING' | 'PROCESSING' | 'COMPLETED') => {
  try {
    const response = await axios.put(`${BASE_URL}/contacts/${contactId}/status`, {
      status
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getContactHistory_API = async (contactId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/contacts/${contactId}/history`);
    return response;
  } catch (error) {
    throw error;
  }
};