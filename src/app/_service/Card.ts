import axios from "axios";

export const CreateCard_API = async (data: any) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cart_items?cartId=${data.cartId}&variantId=${data.variantId}&quantity=${data.quantity}`, "", {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return res;
}

export const GetCard_API = async ( userId: any ) => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/carts/${userId}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return res;
}

export const DeleteCard_API = async (id: string, accessToken?: string) => {  
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cart_items/${id}`, {
        headers: {
            'Authorization': accessToken ? `Bearer ${accessToken}` : '',
            'Content-Type': 'application/json'
        }
    });
    return res;
}

export const UpdateCard_API = async (id: string, data: any, accessToken?: string) => {           
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/cart_items/${id}?quantity=${data.quantity}&variantId=${data.variantId}&cartId=${data.cartId}`, "", {
        headers: {
            'Authorization': accessToken ? `Bearer ${accessToken}` : '',
            'Content-Type': 'application/json'
        }
    });
    return res;
}


