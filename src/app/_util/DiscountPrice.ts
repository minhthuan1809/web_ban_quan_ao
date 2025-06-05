export const DiscountPrice = (price: number, discount: number) => {
    // Tính số tiền được giảm dựa trên phần trăm giảm giá
    const discountAmount = price * (discount / 100);
    // Trả về số tiền sau khi giảm giá
    return Math.round(price - discountAmount);
}
