import axios from "axios";
import useAuthInfor from '@/app/customHooks/AuthInfor';

const { accessToken } = useAuthInfor();


export const createEvaluate_API = async (data: any) => {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reviews/create`, data, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });
  return res;
}


