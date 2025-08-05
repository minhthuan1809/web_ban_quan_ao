import React, { useState, useEffect } from "react";
import FormatPrice from "@/app/_util/FormatPrice";
import InputAddress from "@/app/components/ui/InputAddress";
import { Input, Textarea } from "@nextui-org/react";
import useAuthInfor from "@/app/customHooks/AuthInfor";
import { Gift, User, MapPin, CreditCard, Wallet, Phone, FileText } from "lucide-react";
import { createOrder_API, createOrderWithPaymentMethod6_API } from "@/app/_service/Oder";
import { toast } from "react-toastify";
import InputPhone from "@/app/components/ui/InputPhone";
import { useRouter } from "next/navigation";
import showConfirmDialog from "@/app/_util/Sweetalert2";
import ModalChooseDiscount from "../_modal/ModalChooseDiscount";
import LoadingVnpay from "./LoadingVnpay";

interface CardPayProps {
  selectedItems: number[];
  calculateTotal: () => number;
  cartData: any;
  cartItems: any[]; // thêm dòng này
}

export default function CardPay({
  selectedItems,
  calculateTotal,
  cartData,
  cartItems
}: CardPayProps) {
  const { user : userInfo, accessToken } = useAuthInfor();
  const [address, setAddress] = useState<any>({
    city: {
      cityId: 0,
      cityName: userInfo?.address || "",
    },
    district: {
      districtId: 0,
      districtName: userInfo?.district || "",
    },
    ward: {
      wardId: 0,
      wardName: userInfo?.ward || "",
    },
          detail: userInfo?.ward + " " + userInfo?.address + " " + userInfo?.district || "",
  });
  const [name, setName] = useState<string>(userInfo?.fullName || "");
  const [phone, setPhone] = useState<string>(userInfo?.phone || "");
  const [note, setNote] = useState<string>("");
  const [discountCode, setDiscountCode] = useState<any>({
    code: "",
  });
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [vnpayLoading, setVnpayLoading] = useState<{
    isOpen: boolean;
    status: 'loading' | 'success' | 'error';
    message?: string;
  }>({
    isOpen: false,
    status: 'loading',
    message: ''
  });
  const calculateTotalAfterDiscount = () => {
    return calculateTotal() - discount;
  };

  const router = useRouter();

  // Khi thay đổi số lượng hoặc sản phẩm, clear mã giảm giá
  useEffect(() => {
    setDiscountCode({ code: "" });
    setDiscount(0);
  }, [selectedItems, cartData]);

  // Cập nhật thông tin người dùng khi userInfo thay đổi
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.fullName || "");
      setPhone(userInfo.phone || "");
      setAddress({
        city: {
          cityId: 0,
          cityName: userInfo.address || "",
        },
        district: {
          districtId: 0,
          districtName: userInfo.district || "",
        },
        ward: {
          wardId: 0,
          wardName: userInfo.ward || "",
        },
        detail: userInfo?.ward + " " + userInfo?.address + " " + userInfo?.district || ""
      });
    }
  }, [userInfo]);

  // Tự động cập nhật lại discount khi số lượng hoặc selectedItems thay đổi
  useEffect(() => {
    if (discountCode.code) {

      setDiscount(discount); // Nếu cần, thay bằng logic tính lại discount
    } else {
      setDiscount(0);
    }
  }, [calculateTotal(), discountCode.code, cartData, selectedItems]);

const handlePayment = async () => {
  // Prevent multiple submissions
  if (isProcessing) {
    toast.warning("Đang xử lý đơn hàng, vui lòng chờ...");
    return;
  }

  // Validation
  if (!name.trim()) {
    toast.error("Vui lòng nhập tên người nhận");
    return;
  }

  if (!phone.trim()) {
    toast.error("Vui lòng nhập số điện thoại");
    return;
  }

  if (!address.city.cityName || !address.district.districtName || !address.ward.wardName) {
    toast.error("Vui lòng chọn đầy đủ địa chỉ giao hàng");
    return;
  }

  if (!userInfo?.id || !accessToken) {
    toast.error("Vui lòng đăng nhập để đặt hàng");
    return;
  }

  if (selectedItems.length === 0) {
    toast.error("Vui lòng chọn ít nhất một sản phẩm");
    return;
  }

  const result = await showConfirmDialog({
    title: 'Xác nhận đặt hàng?',
    text: `Bạn có chắc chắn muốn đặt hàng với tổng tiền ${calculateTotalAfterDiscount().toLocaleString('vi-VN')}₫?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Đặt hàng',
    cancelButtonText: 'Hủy'
  });

  if (!result.isConfirmed) return;

  try {
    setIsProcessing(true);

    // Lấy quantity mới nhất từ selectedItems và cartItems
    const orderItems = selectedItems.map((itemId) => {
      const item = cartItems.find((i: any) => i.id === itemId);
      return {
        variantId: item.variant.id,
        quantity: item.quantity // quantity mới nhất
      };
    });

    const orderData = {
      "paymentMethodId": paymentMethod,
      "cartId": cartData.id,
      "customerName": name.trim(),
      "customerEmail": userInfo?.email || "",
      "customerPhone": phone.trim(),
      "shippingAddress": address.city.cityName,
      "shippingDistrict": address.district.districtName,
      "shippingWard": address.ward.wardName,
      "note": note.trim(),
      "couponCode": discountCode.code || null,
      "isAdmin": false,
      "items": orderItems,
      "totalAmount": calculateTotalAfterDiscount()
    };
    
    
    if (paymentMethod === 6) {
      // VNPay payment - Show loading modal
      setVnpayLoading({
        isOpen: true,
        status: 'loading',
        message: ''
      });

      try {
        const res = await createOrderWithPaymentMethod6_API(calculateTotalAfterDiscount(), userInfo.id, accessToken);
        if (res.status === 200 && res.data) {
          sessionStorage.setItem("tempOrderData", JSON.stringify(orderData));
          setVnpayLoading({
            isOpen: true,
            status: 'success',
            message: 'Đang chuyển hướng đến trang thanh toán'
          });
          setTimeout(() => {
            window.location.href = res.data;
          }, 1500);
        } else {
          throw new Error("Không thể tạo liên kết thanh toán VNPay");
        }
      } catch (vnpayError: any) {
        // Show error in modal
        setVnpayLoading({
          isOpen: true,
          status: 'error',
          message: vnpayError.message || "Không thể kết nối đến VNPay"
        });
        throw vnpayError; // Re-throw to be caught by outer catch
      }
    } else {
      // Direct payment methods (COD, etc.)
      const res = await createOrder_API(orderData, userInfo.id, accessToken);
      
      if (res.status === 200) {
        toast.success("Đặt hàng thành công!");
        
        // Navigate to order history with a small delay for better UX
        setTimeout(() => {
          router.push("/history-order");
        }, 1000);
      } else {
        throw new Error("Không thể tạo đơn hàng");
      }
    }
  } catch (error: any) {
    let errorMessage = "Có lỗi xảy ra khi đặt hàng";
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // If VNPay modal is not already showing error, show toast
    if (paymentMethod !== 6 || vnpayLoading.status !== 'error') {
      toast.error(errorMessage);
    }
  } finally {
    setIsProcessing(false);
    
    // Close VNPay modal on any error if not already in error state
    if (vnpayLoading.isOpen && vnpayLoading.status === 'loading') {
      setVnpayLoading({
        isOpen: true,
        status: 'error',
        message: "Có lỗi xảy ra khi xử lý thanh toán"
      });
    }
  }
}

  return (
    <div className="lg:col-span-1">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 overflow-hidden sticky top-4">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-gray-900 dark:text-gray-100">
          <h2 className="text-xl font-bold">
            Chi tiết đơn hàng
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Thông tin người nhận */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="text-blue-600 dark:text-blue-400" size={18} />
              <span className="font-semibold text-gray-900 dark:text-gray-100">Tên người nhận</span>
            </div>
            <Input
              placeholder="Nhập họ tên người nhận"
              variant="bordered"
              className="w-full"
              value={name}
              size="lg"
              radius="md"
              classNames={{
                input: "text-gray-900 dark:text-gray-100",
                inputWrapper: "border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 focus-within:border-blue-600 dark:focus-within:border-blue-400 bg-white dark:bg-gray-800"
              }}
              onChange={(e) => setName(e.target.value)}
            />
            
            <div className="flex items-center gap-2 mt-3">
              <Phone className="text-blue-600 dark:text-blue-400" size={18} />
              <span className="font-semibold text-gray-900 dark:text-gray-100">Số điện thoại</span>
            </div>

            <InputPhone
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e)}
            />
          </div>

          {/* Địa chỉ giao hàng */} 
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="text-blue-600 dark:text-blue-400" size={18} />
              <span className="font-semibold text-gray-900 dark:text-gray-100">Địa chỉ giao hàng</span>
            </div>
            <div className="space-y-4">
              <InputAddress 
                onChange={(e) => setAddress(e)} 
                defaultValue={address}
              />
              <Textarea
                value={address.detail}
                onChange={(e) => setAddress({ ...address, detail: e.target.value })}
                placeholder="Số nhà, tên đường, thông tin bổ sung..."
                label="Chi tiết địa chỉ"
                labelPlacement="outside"
                size="lg"
                radius="md"
                minRows={2}
                classNames={{
                  input: "text-gray-900 dark:text-gray-100 resize-none",
                  inputWrapper: "border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 focus-within:border-blue-600 dark:focus-within:border-blue-400 bg-white dark:bg-gray-800",
                  label: "text-gray-700 dark:text-gray-300"
                }}
              />
            </div>
          </div>
          
          {/* Ghi chú */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="text-blue-600 dark:text-blue-400" size={18} />
              <span className="font-semibold text-gray-900 dark:text-gray-100">Ghi chú đơn hàng</span>
            </div>
            <Textarea
              placeholder="Nhập ghi chú cho đơn hàng (nếu có)"
              variant="bordered"
              className="w-full"
              value={note}
              size="lg"
              radius="md"
              minRows={2}
              classNames={{
                input: "text-gray-900 dark:text-gray-100 resize-none",
                inputWrapper: "border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 focus-within:border-blue-600 dark:focus-within:border-blue-400 bg-white dark:bg-gray-800"
              }}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Mã giảm giá */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Gift className="text-blue-600 dark:text-blue-400" size={18} />
                <span className="font-semibold text-gray-900 dark:text-gray-100">Mã giảm giá</span> 
              </div>
              <span className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:underline text-sm cursor-pointer font-semibold" onClick={() => setIsOpen(true)}>Chọn mã giảm giá</span>
            </div>
            <Input
              placeholder="Nhập mã giảm giá (nếu có)"
              variant="bordered"
              className="w-full"
              size="lg"
              radius="md"
              classNames={{
                input: "text-gray-900 dark:text-gray-100",
                inputWrapper: "border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 focus-within:border-blue-600 dark:focus-within:border-blue-400 bg-white dark:bg-gray-800"
              }}
              onChange={(e) => setDiscountCode({...discountCode, code: e.target.value} as any)}
              value={discountCode?.code}
            />
            {discount > 0 && (
              <div className="flex justify-between items-center text-sm bg-green-50 dark:bg-green-900/30 p-3 rounded-lg border border-green-200 dark:border-green-700">
                <span className="text-foreground/70 font-medium">Giảm giá:</span>
                <span className="text-green-600 dark:text-green-400 font-bold whitespace-nowrap">
                  -<FormatPrice price={discount} currency="₫" className="inline-flex" />
                </span>
              </div>
            )}
          </div>

          {/* Chi tiết thanh toán */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl p-4 border border-blue-100 dark:border-gray-600">
            <div className="space-y-3">
           

              <div className="flex justify-between items-center">
                <span className="text-foreground/70 font-medium">Tạm tính:</span>
                <FormatPrice
                  price={calculateTotal()}
                  className="font-bold text-foreground"
                  currency="₫"
                />
              </div>

              <div className="border-t border-blue-200 dark:border-gray-600 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">Tổng thanh toán:</span>
                  <FormatPrice
                    price={calculateTotalAfterDiscount()}
                    className="text-xl font-bold text-foreground"
                    currency="₫"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="space-y-3">
            <span className="font-semibold text-gray-900 dark:text-gray-100">Chọn phương thức thanh toán</span>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-blue-200 dark:border-blue-700 rounded-xl cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">
                <input
                  type="radio"
                  name="payment"
                  value="1"
                  checked={paymentMethod === 1}
                  onChange={() => setPaymentMethod(1)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  paymentMethod === 1 ? "border-blue-600 bg-blue-600" : "border-gray-300 dark:border-gray-600"
                }`}>
                  {paymentMethod === 1 && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <Wallet className="text-blue-600 dark:text-blue-400 mr-3" size={20} />
                <span className="text-gray-900 dark:text-gray-100 font-medium">Thanh toán khi nhận hàng</span>
              </label>

              <label className="flex items-center p-4 border-2 border-blue-200 dark:border-blue-700 rounded-xl cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">
                <input
                  type="radio"
                  name="payment"
                  value="6"
                  checked={paymentMethod === 6}
                  onChange={() => setPaymentMethod(6)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    paymentMethod === 6 ? "border-blue-600 bg-blue-600" : "border-gray-300 dark:border-gray-600"
                }`}>
                  {paymentMethod === 6 && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <CreditCard className="text-blue-600 dark:text-blue-400 mr-3" size={20} />
                <span className="text-gray-900 dark:text-gray-100 font-medium">Thanh toán qua ví</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <button
              disabled={selectedItems.length === 0 || isProcessing}
              className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-200 text-sm shadow-lg flex items-center justify-center gap-2 ${
                selectedItems.length === 0 || isProcessing
                  ? "bg-default-200 text-default-500 cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-xl transform hover:scale-105"
              }`}
              onClick={handlePayment}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <Wallet size={18} />
                  <span>Thanh toán ngay</span>
                </>
              )}
            </button>

            <button className="w-full text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 text-sm border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500">
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
      <ModalChooseDiscount 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        setDiscountCode={setDiscountCode} 
        discountCode={discountCode} 
        orderTotal={calculateTotal()} 
        setDiscount={setDiscount}
      />
      
      <LoadingVnpay
        isOpen={vnpayLoading.isOpen}
        onClose={() => setVnpayLoading({ ...vnpayLoading, isOpen: false })}
        status={vnpayLoading.status}
        message={vnpayLoading.message}
      />
    </div>
  );
}