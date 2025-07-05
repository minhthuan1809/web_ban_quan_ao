// Tính giá sau khi giảm dựa trên giá gốc và phần trăm giảm giá
export const calculateDiscountedPrice = (originalPrice: number, discountPercent: number): number => {
    if (discountPercent && discountPercent > 0) {
        const discountAmount = originalPrice * (discountPercent / 100);
        return Math.round(originalPrice - discountAmount);
    }
    return originalPrice;
};

// Tính giá của 1 sản phẩm (có tính giảm giá)
export const calculateProductPrice = (product: any): { 
    finalPrice: number;
    originalPrice: number;
    hasDiscount: boolean;
} => {
    // Tính giá gốc: price + priceAdjustment
    const basePrice = (product.price || 0) + (product.priceAdjustment || 0);
    const salePrice = product.salePrice || 0;
    
    return {
        finalPrice: salePrice > 0 ? calculateDiscountedPrice(basePrice, salePrice) : basePrice,
        originalPrice: basePrice,
        hasDiscount: salePrice > 0
    };
};

// Tính giá của 1 sản phẩm trong giỏ hàng (có tính giảm giá)
export const calculateCartItemPrice = (item: any): number => {
    const basePrice = (item.variant?.product?.price || 0) + (item.variant?.priceAdjustment || 0);
    const salePrice = item.variant?.product?.salePrice || 0;
    
    if (salePrice > 0) {
        return calculateDiscountedPrice(basePrice, salePrice);
    }
    return basePrice;
};

// Tính tổng tiền của 1 sản phẩm trong giỏ hàng (giá × số lượng)
export const calculateCartItemTotal = (item: any): number => {
    return calculateCartItemPrice(item) * item.quantity;
};

// Format giá tiền theo định dạng Việt Nam
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

// Tính điểm đánh giá trung bình
export const calculateAverageRating = (ratings: number[]): number => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, curr) => acc + curr, 0);
    return Number((sum / ratings.length).toFixed(1));
};

// Tính giá gốc trước khi giảm
export const getOriginalPrice = (item: any) => {
    return (item.variant?.product?.price || 0) + (item.variant?.priceAdjustment || 0);
};

// Kiểm tra xem có giảm giá không
export const hasDiscount = (item: any) => {
    const salePrice = item.variant?.product?.salePrice;
    return salePrice && salePrice > 0;
};