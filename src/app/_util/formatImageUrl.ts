/**
 * Helper function để format URL hình ảnh cho Next.js Image component
 * Đảm bảo URL luôn hợp lệ (bắt đầu bằng "/" hoặc là URL tuyệt đối)
 */
export const formatImageUrl = (url: string | undefined | null): string => {
    if (!url) {
        return '/placeholder-image.jpg'; // Fallback image
    }
    
    // Nếu đã là URL tuyệt đối (http:// hoặc https://)
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    
    // Nếu bắt đầu bằng "/" thì đã đúng format
    if (url.startsWith('/')) {
        return url;
    }
    
    // Nếu không, thêm "/" vào đầu
    return `/${url}`;
};

/**
 * Helper function cho avatar URLs với fallback đặc biệt
 */
export const formatAvatarUrl = (url: string | undefined | null, defaultUrl?: string): string => {
    if (!url) {
        return defaultUrl || '/default-avatar.png';
    }
    
    return formatImageUrl(url);
};

/**
 * Helper function cho product image URLs
 */
export const formatProductImageUrl = (urls: string[] | undefined | null, index: number = 0): string => {
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
        return '/placeholder-product.jpg';
    }
    
    const url = urls[index];
    return formatImageUrl(url);
}; 