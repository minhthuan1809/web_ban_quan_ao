import axios, { AxiosResponse } from "axios";

// Create order
export const createOrder_API = async (data: any, userId: number, accessToken: string | null): Promise<AxiosResponse> => {
   
    try {
        if (!accessToken) {
            throw new Error('Token xác thực không hợp lệ');
        }
        
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/orders?userId=${userId}`, 
           data,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
            }
        );
        console.log("res" , res);
        
        return res;
    } catch (error: any) {

        if (error.response?.status === 401) {
            throw new Error('Phiên đăng nhập đã hết hạn');
        } else if (error.response?.status === 403) {
            throw new Error('Bạn không có quyền thực hiện thao tác này');
        } else if (error.response?.status >= 500) {
            throw new Error('Lỗi máy chủ, vui lòng thử lại sau');
        }
        throw error;
    }
}

// Get all orders (admin)
export const getOrder_API = async (page: number, searchQuery: string, accessToken: string | null): Promise<AxiosResponse> => {
    try {
        if (!accessToken) {
            throw new Error('Token xác thực không hợp lệ');
        }
        
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/orders?page=${page}&Search=${searchQuery}&size=100`, 
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );
        return res;
    } catch (error: any) {

        if (error.response?.status === 401) {
            throw new Error('Phiên đăng nhập đã hết hạn');
        } else if (error.response?.status === 403) {
            throw new Error('Bạn không có quyền truy cập');
        } else if (error.response?.status >= 500) {
            throw new Error('Lỗi máy chủ, vui lòng thử lại sau');
        }
        throw error;
    }
}   

// Update order status
export const updateOrderStatus_API = async (orderId: number, status: string, accessToken: string | null): Promise<AxiosResponse> => {
    try {
        if (!accessToken) {
            throw new Error('Token xác thực không hợp lệ');
        }
        
        const res = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status?status=${status}`, 
            {}, 
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );
        return res;
    } catch (error: any) {

        if (error.response?.status === 401) {
            throw new Error('Phiên đăng nhập đã hết hạn');
        } else if (error.response?.status === 403) {
            throw new Error('Bạn không có quyền thực hiện thao tác này');
        } else if (error.response?.status === 404) {
            throw new Error('Không tìm thấy đơn hàng');
        } else if (error.response?.status >= 500) {
            throw new Error('Lỗi máy chủ, vui lòng thử lại sau');
        }
        throw error;
    }
}   

// Get orders by user ID
export const getOrderById_API = async (userId: number, accessToken: string | null): Promise<AxiosResponse> => {
    try {
        if (!accessToken) {
            throw new Error('Token xác thực không hợp lệ');
        }
        
        if (!userId) {
            throw new Error('ID người dùng không hợp lệ');
        }
        
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/orders/user/${userId}`, 
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );
        
        return res;
    } catch (error: any) {
        if (error.response?.status === 401) {
            throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        } else if (error.response?.status === 403) {
            throw new Error('Bạn không có quyền truy cập đơn hàng này');
        } else if (error.response?.status === 404) {
            throw new Error('Không tìm thấy đơn hàng nào');
        } else if (error.response?.status >= 500) {
            throw new Error('Lỗi máy chủ, vui lòng thử lại sau');
        } else if (error.code === 'ECONNABORTED') {
            throw new Error('Kết nối quá chậm, vui lòng thử lại');
        } else if (error.code === 'NETWORK_ERROR') {
            throw new Error('Lỗi kết nối mạng');
        }
        throw error;
    }
}

// Create order with payment method 6 (VNPay)
export const createOrderWithPaymentMethod6_API = async (amount: number, orderId: number, accessToken: string | null): Promise<AxiosResponse> => {
    try {
        if (!accessToken) {
            throw new Error('Token xác thực không hợp lệ');
        }
        
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/vnpay/create-payment?amount=${amount}&orderId=${orderId}`, 
            {}, 
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'          
                },
                timeout: 30000
            }
        );
        return res;
    } catch (error: any) {

        if (error.response?.status === 401) {
            throw new Error('Phiên đăng nhập đã hết hạn');
        } else if (error.response?.status === 403) {
            throw new Error('Bạn không có quyền thực hiện thao tác này');
        } else if (error.response?.status >= 500) {
            throw new Error('Lỗi máy chủ, vui lòng thử lại sau');
        }
        throw error;
    }
}

// Export order as PDF
export const exportOrderPDF_API = async (orderId: number): Promise<Blob> => {
    try {
     
        
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/orders/export-pdf/${orderId}`, 
        );
        
        return res.data;
    } catch (error: any) {

        if (error.response?.status === 401) {
            throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        } else if (error.response?.status === 403) {
            throw new Error('Bạn không có quyền xuất hóa đơn này');
        } else if (error.response?.status === 404) {
            throw new Error('Không tìm thấy đơn hàng');
        } else if (error.response?.status >= 500) {
            throw new Error('Lỗi máy chủ, vui lòng thử lại sau');
        } else if (error.code === 'ECONNABORTED') {
            throw new Error('Kết nối quá chậm, vui lòng thử lại');
        } else if (error.code === 'NETWORK_ERROR') {
            throw new Error('Lỗi kết nối mạng');
        }
        throw error;
    }
}


// history order vnp response code
export const getHistoryOrderVnpay_API = async ( accessToken: string | null, status : string, orderId : string, url : string): Promise<any> => {
    try {
        if (!accessToken) {
            throw new Error('Token xác thực không hợp lệ');
        }
        
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/vnpay/payment-info?status=${status}&orderId=${orderId}&url=${encodeURIComponent(url)}`, 
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );
        return res;
    } catch (error: any) {
        if (error.response?.status === 401) {
            throw new Error('Phiên đăng nhập đã hết hạn');
        } else if (error.response?.status === 403) {
            throw new Error('Bạn không có quyền thực hiện thao tác này');
        } else if (error.response?.status >= 500) {
            throw new Error('Lỗi máy chủ, vui lòng thử lại sau');
        }
        throw error;
    }
}   

// get history order vnp response code
export const getHistoryOrderVnpayResponseCode_API = async (page: number, size: number): Promise<any> => {
    try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/vnpay?page=${page}&size=${size}`, 
        );
        return res.data; 
    } catch (error: any) {

    }
}   