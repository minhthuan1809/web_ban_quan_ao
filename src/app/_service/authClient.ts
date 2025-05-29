import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const authLogin_API = async (data: any) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const authRegister_API = async (data: any) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const authVerifyEmail_API = async (token: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/auth/verify-email?token=${token}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const authGetUserInfo_API = async (accessToken: string) => {
  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const authLogout_API = async (accessToken: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/logout`, null, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// auth/reset-password


export const authForgotPassword_API = async (email: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/forgot-password?email=${email}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};


export const authResetPassword_API = async (token: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password?token=${token}&newPassword=${password}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};