import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;


export const deleteUser_API = async (id: number, token: string) => {
    try {
        const response = await axios.delete(`${API_URL}/users/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const CreateUser_API = async (data: any, token: string) => {
    try {
        const response = await axios.post(`${API_URL}/users`, {
            ...data,
            isAdmin : true,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response;
    } catch (error) {
        throw error;
    }
}
      export const UpdateUser_API = async (id: number, data: any, token: string) => {
    try {
        const response = await axios.put(`${API_URL}/users/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
}


// gety
export const getUserById_API = async (token: string) => {
    try {
        const response = await axios.get(`${API_URL}/users`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
}