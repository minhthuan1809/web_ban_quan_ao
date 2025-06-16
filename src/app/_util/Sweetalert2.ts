import Swal from "sweetalert2"; 

interface SweetAlertOptions {
  title: string;
  text: string;
  icon: string;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  reverseButtons?: boolean;
}

const showConfirmDialog = (options: SweetAlertOptions) => {
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