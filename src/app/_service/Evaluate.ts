import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createEvaluate_API = async (data: any, accessToken: string) => {
  const res = await axios.post(`${API_URL}/reviews/create`, data, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });
  return res;
}


export const getReviews_API = async (page: number, pageSize: number = 10, searchValue: string = '', productId: any = null) => {
  const params = new URLSearchParams();
  params.append('page_size', pageSize.toString());
  params.append('page', page.toString());
  params.append('search', searchValue);
  params.append('productId', JSON.stringify({productId : productId}));
  
      const response = await axios.get(`${API_URL}/reviews?${params.toString()}`, {
          headers: {
              'Content-Type': 'application/json',
          },
      });
      return response.data;
}


// trả lời đánh giá

export const createAnswer_API = async (data: any, accessToken: string) => {
  const res = await axios.post(`${API_URL}/answers`, data, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });
  return res;
}

export const updateAnswer_API = async (id: number, data: any, accessToken: string) => {
  const res = await axios.put(`${API_URL}/answers/${id}`, data, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });
  return res;
}