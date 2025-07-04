import React, { useState } from "react";
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
}

export default function CardPay({
  selectedItems,
  calculateTotal,
  cartData
}: CardPayProps) {
  const { user : userInfo, accessToken } = useAuthInfor();
  const [address, setAddress] = useState<any>({
    city: {
      cityId: 0,
      cityName: "",
    },
    district: {
      districtId: 0,
      districtName: "",
    },
    ward: {
      wardId: 0,
      wardName: "",
    },
    detail: "",
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

  // Kiểm tra và mở modal nếu có mã giảm giá trong sessionStorage và có sản phẩm được chọn
  React.useEffect(() => {
    const savedCouponCode = sessionStorage.getItem('couponCode');
    if (savedCouponCode && selectedItems.length > 0) {
      setIsOpen(true);
    }
  }, [selectedItems]); // Thêm selectedItems vào dependencies để theo dõi thay đổi

  const calculateTotalAfterDiscount = () => {
    return calculateTotal() - discount;
  };

  const router = useRouter();

  const handlePayment = async () => {
    try {
      if (!userInfo?.id || !accessToken) {
        toast.error("Vui lòng đăng nhập để thanh toán");
        router.push("/login");
        return;
      }

      if (!name || !phone || !address.city.cityId || !address.district.districtId || !address.ward.wardId || !address.detail) {
        toast.error("Vui lòng điền đầy đủ thông tin giao hàng");
        return;
      }

      setIsProcessing(true);

      const orderData = {
        userId: userInfo.id,
        cartItemIds: selectedItems,
        shippingAddress: address.detail,
        shippingCity: address.city.cityName,
        shippingDistrict: address.district.districtName,
        shippingWard: address.ward.wardName,
        recipientName: name,
        recipientPhone: phone,
        note: note,
        paymentMethod: paymentMethod,
        discountCode: discountCode?.code || null,
        totalAmount: calculateTotalAfterDiscount()
      };

      if (paymentMethod === 6) {
        setVnpayLoading({
          isOpen: true,
          status: 'loading',
          message: 'Đang chuyển hướng đến cổng thanh toán VNPay...'
        });

        const res = await createOrderWithPaymentMethod6_API(orderData.totalAmount, userInfo.id, accessToken);
        if (res.data) {
          window.location.href = res.data;
        }
      } else {
        const res = await createOrder_API(orderData, userInfo.id, accessToken);
        if (res.status === 200) {
          toast.success("Đặt hàng thành công");
          router.push("/history-order");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi đặt hàng");
      setVnpayLoading({
        isOpen: true,
        status: 'error',
        message: error.message || "Có lỗi xảy ra khi xử lý thanh toán"
      });
    } finally {
      setIsProcessing(false);
    }
  };

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
              <InputAddress onChange={(e) => setAddress(e)} />
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
              <span 
                className={`text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:underline text-sm cursor-pointer font-semibold ${
                  selectedItems.length === 0 ? 'opacity-50 pointer-events-none' : ''
                }`} 
                onClick={() => selectedItems.length > 0 && setIsOpen(true)}
              >
                Chọn mã giảm giá
              </span>
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
                <span className="text-foreground/70 font-medium">Số lượng sản phẩm:</span>
                <span className="font-bold text-foreground">{selectedItems.length}</span>
              </div>

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