import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// material

export const getmaterial_API = async (
  search: string,
  page: number,
  page_size: number = 10,
  sort: string,
  filter: string
) => {
  const response = await axios.get(
    `${API_URL}/materials?search=${search}&page=${page}&page_size=${page_size}&sort=${sort}&filter=${filter}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const addMaterial_API = async (name: string, accessToken: string) => {
  const response = await axios.post(
    `${API_URL}/materials`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

// xóa vật liệu
export const deleteMaterial_API = async (id: string, accessToken: string) => {
  const response: any = await axios.delete(`${API_URL}/materials/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response;
};

//sửa vật liệu
export const updateMaterial_API = async (
  id: string,
  name: string,
  accessToken: string
) => {
  const response = await axios.put(
    `${API_URL}/materials/${id}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

// category
export const getCategory_API = async (
  search: string,
  page: number,
  page_size: number,
  sort: string,
  filter: string
) => {
  const response = await axios.get(
    `${API_URL}/categories?search=${search}&page=${page}&page_size=${page_size}&sort=${sort}&filter=${filter}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// xóa category
export const deleteCategory_API = async (id: string, accessToken: string) => {
  const response = await axios.delete(`${API_URL}/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response;
};
// thêm category
export const addCategory_API = async (name: string, accessToken: string) => {
  const response = await axios.post(
    `${API_URL}/categories`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};
// sửa category
export const updateCategory_API = async (
  id: string,
  name: string,
  accessToken: string
) => {
  const response = await axios.put(
    `${API_URL}/categories/${id}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};


// team
export const getTeam_API = async (
  search: string,
  page: number,
  page_size: number,
  sort: string,
  filter: string
) => {
  const response = await axios.get(
    `${API_URL}/teams?search=${search}&page=${page}&page_size=${page_size}&sort=${sort}&filter=${filter}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// delete team
export const deleteTeam_API = async (id: string, accessToken: string) => {
  const response = await axios.delete(`${API_URL}/teams/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response;
};

// add team
export const addTeam_API = async (data: any, accessToken: string) => {
  const response = await axios.post(`${API_URL}/teams`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response;
};

// update team
export const updateTeam_API = async (id: string, data: any, accessToken: string) => {
  const response = await axios.put(`${API_URL}/teams/${id}`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,

      "Content-Type": "application/json",
    },
  });
  return response;
};


