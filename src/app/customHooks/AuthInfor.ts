import { getCookie } from "cookies-next";



const useAuthInfor = () => {
  try {
    const token = getCookie("token");
    if (!token) {
      return { accessToken: null, userInfo: null };
    }
    
    const tokenString = JSON.parse(token as string);
    return {
      accessToken: tokenString?.accessToken || null,
      userInfo: tokenString?.userInfo || null,
    };
  } catch (error) {
    console.error("Error parsing auth token:", error);
    return { accessToken: null, userInfo: null };
  }
};

export default useAuthInfor;
