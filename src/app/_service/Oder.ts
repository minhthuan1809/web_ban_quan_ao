import axios from "axios";
import useAuthInfor from "../customHooks/AuthInfor";

export const createOrder_API = async (data: any, userId: number) => {
    // Lấy token chỉ khi hàm được gọi
    const { accessToken } = useAuthInfor() || { accessToken: null };
    
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders?userId=${userId}`, data, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    return res;
}

// get all order by user id
export const getOrder_API = async (page: number, searchQuery: string) => {
    // Lấy token chỉ khi hàm được gọi
    const { accessToken } = useAuthInfor() || { accessToken: null };
    
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders?page=${page}&Search=${searchQuery}&size=100`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    return res;
}   

// update order status
export const updateOrderStatus_API = async (orderId: number, status: string) => {
    // Lấy token chỉ khi hàm được gọi
    const { accessToken } = useAuthInfor() || { accessToken: null };
    
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status?status=${status}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    return res;
}   

// get all order by user id
export const getOrderById_API = async (userId: number) => {
    // Lấy token chỉ khi hàm được gọi
    const { accessToken } = useAuthInfor() || { accessToken: null };
    
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/user/${userId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    return res;
}


// create order with payment method 6
export const createOrderWithPaymentMethod6_API = async (amount: number, orderId: number) => {
    // Lấy token chỉ khi hàm được gọi
    const { accessToken } = useAuthInfor() || { accessToken: null };
    
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/vnpay/create-payment?amount=${amount}&orderId=${orderId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'          
        }
    });
    return res;
}




