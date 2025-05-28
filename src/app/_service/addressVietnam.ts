const API_URL = "https://provinces.open-api.vn/api/?depth=3";
export async function getCityVietnam() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching Vietnam cities:", error);
        return null;
    }
}
