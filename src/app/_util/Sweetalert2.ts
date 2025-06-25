import Swal from "sweetalert2"; 
// Import types from centralized location
import type { SweetAlertOptions } from '../../types/ui';

// Local interface for this specific implementation
interface LocalSweetAlertOptions extends SweetAlertOptions {
  reverseButtons?: boolean;
}

const showConfirmDialog = (options: LocalSweetAlertOptions) => {
  return Swal.fire({
    title: options.title,
    text: options.text,
    icon: options.icon as any,
    showCancelButton: options.showCancelButton || false,
    confirmButtonText: options.confirmButtonText || 'Xác nhận',
    cancelButtonText: options.cancelButtonText || 'Hủy',
    reverseButtons: options.reverseButtons || true,
    customClass: {
      popup: 'rounded-lg shadow-md',
      title: 'text-lg font-semibold text-gray-800',
      htmlContainer: 'text-base text-gray-600',
      confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mx-2',
      cancelButton: 'bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mx-2'
    },
    buttonsStyling: false
  });
};

export default showConfirmDialog;