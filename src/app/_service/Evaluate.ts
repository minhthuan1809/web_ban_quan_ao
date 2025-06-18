import axios from "axios";
import useAuthInfor from '@/app/customHooks/AuthInfor';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const { accessToken } = useAuthInfor();


export const createEvaluate_API = async (data: any) => {
  const res = await axios.post(`${API_URL}/reviews/create`, data, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });
  return res;
}


export const getReviews_API = async (productId: number) => {
  const { accessToken } = useAuthInfor();
      const response = await axios.get(`${API_URL}/reviews?productId=${productId}`, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
          },
      });
      return response.data;
}

