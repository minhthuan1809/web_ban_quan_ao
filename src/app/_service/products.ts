import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getProducts_API = async (search: string, page: number, limit: number, filter: any) => {
    try {
        // Handle other filters
        const filterParams = {
            category: filter?.categories || [],
            sizes: filter?.sizes || [],
            minPrice: filter?.priceRange?.[0] || 0,
            maxPrice: filter?.priceRange?.[1] || 500000000
        };

        console.log("filterParams" , filterParams);

        // Build query parameters
        const queryParams = new URLSearchParams({
            search: search || '',
            page: page.toString(),
            page_size: limit.toString(),
            filter: JSON.stringify(filterParams)
        });
        const response = await axios.get(`${API_URL}/products?${queryParams.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response;
    } catch (error) {
        console.error('Error in getProducts_API:', error);
        throw error;
    }
}

export const deleteProduct_API = async (id: number, token: string) => {
    try {
        const response = await axios.delete(`${API_URL}/products/${id}`, {
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

export const CreateProduct_API = async (data: any, token: string) => {
    try {
        const response = await axios.post(`${API_URL}/products`, data, {
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
export const UpdateProduct_API = async (id: number, data: any, token: string) => {
    try {
        const response = await axios.put(`${API_URL}/products/${id}`, data, {
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


// detail product
export const getProductDetail_API = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/products/${id}`)
        return response
    } catch (error) {
        throw error;
    }
}

// detail variant
export const getVariantDetail_API = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/products/detail/${id}`)
        return response
    } catch (error) {
        throw error;
    }
}