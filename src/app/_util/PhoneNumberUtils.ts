interface CarrierInfo {
  name: string;
  color: string;
}

export function detectCarrier(phoneNumber: string): CarrierInfo | null {
  // Chuẩn hóa số điện thoại
  const normalizedNumber = phoneNumber.replace(/[^\d]/g, '');
  
  // Xóa mã quốc gia +84 nếu có
  const number = normalizedNumber.startsWith('84') 
    ? normalizedNumber.substring(2) 
    : normalizedNumber;

  // Kiểm tra đầu số
  const prefix = number.substring(0, 2);
  
  // Viettel: 03x, 07x, 08x
  if (['03', '07', '08'].includes(prefix)) {
    return {
      name: 'Viettel',
      color: 'text-red-500'
    };
  }
  
  // Vinaphone: 08x, 09x
  if (['08', '09'].includes(prefix)) {
    return {
      name: 'Vinaphone',
      color: 'text-blue-500'
    };
  }
  
  // Mobifone: 07x, 09x, 03x
  if (['07', '09', '03'].includes(prefix)) {
    return {
      name: 'Mobifone',
      color: 'text-orange-500'
    };
  }

  return null;
}

export function formatPhoneNumber(phoneNumber: string): string {
  // Chuẩn hóa số điện thoại
  const normalizedNumber = phoneNumber.replace(/[^\d]/g, '');
  
  // Xóa mã quốc gia +84 nếu có
  const number = normalizedNumber.startsWith('84') 
    ? normalizedNumber.substring(2) 
    : normalizedNumber;

  // Format: 0xxx.xxx.xxx
  return number.replace(/(\d{4})(\d{3})(\d{3})/, '$1.$2.$3');
} 