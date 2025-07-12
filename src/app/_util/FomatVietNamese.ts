const formatVietNamese = (text: string) => {
    // Mapping of Vietnamese characters to non-accented equivalents
    const vietnameseMap: { [key: string]: string } = {
        'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a',
        'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
        'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
        'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e',
        'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
        'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
        'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o',
        'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
        'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
        'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u',
        'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
        'đ': 'd',
    };

    // Convert to lowercase and replace spaces with hyphens
    let result = text.toLowerCase().replace(/ /g, '-');

    // Replace Vietnamese characters with non-accented equivalents
    for (let char in vietnameseMap) {
        result = result.replace(new RegExp(char, 'g'), vietnameseMap[char]);
    }

    return result;
}

export default formatVietNamese

export const formatOrderStatus = (status: string) => {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Chờ xác nhận',
        color: 'warning',
        bgColor: 'bg-warning/20 text-warning-600'
      };
    case 'CONFIRMED':
      return {
        label: 'Đã xác nhận',
        color: 'primary',
        bgColor: 'bg-primary/20 text-primary-600'
      };
    case 'PROCESSING':
      return {
        label: 'Đang xử lý',
        color: 'secondary',
        bgColor: 'bg-secondary/20 text-secondary-600'
      };
    case 'SHIPPING':
      return {
        label: 'Đang giao hàng',
        color: 'info',
        bgColor: 'bg-info/20 text-info-600'
      };
    case 'DELIVERED':
      return {
        label: 'Đã giao hàng',
        color: 'success',
        bgColor: 'bg-success/20 text-success-600'
      };
    case 'CANCELLED':
      return {
        label: 'Đã hủy',
        color: 'danger',
        bgColor: 'bg-danger/20 text-danger-600'
      };
    case 'REFUNDED':
      return {
        label: 'Đã hoàn tiền',
        color: 'default',
        bgColor: 'bg-default/20 text-default-600'
      };
    case 'NOT_RECEIVED':
      return {
        label: 'Khách không nhận',
        color: 'warning',
        bgColor: 'bg-warning/20 text-warning-600'
      };
    case 'RECEIVED':
      return {
        label: 'Đã nhận hàng',
        color: 'success',
        bgColor: 'bg-success/20 text-success-600'
      };
    default:
      return {
        label: 'Không xác định',
        color: 'default',
        bgColor: 'bg-default/20 text-default-600'
      };
  }
};
