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
  const [feeShip, setFeeShip] = useState<number>(
    Number(process.env.NEXT_PUBLIC_FEE_SHIP || 0)
  );
  const { userInfo } = useAuthInfor();
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
  const [phone, setPhone] = useState<string>(userInfo?.phoneNumber || "");
  const [note, setNote] = useState<string>("");
  const [discountCode, setDiscountCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<number>(1);

  const calculateTotalAfterDiscount = () => {
    return calculateTotal() + feeShip - discount;
  };

  const router = useRouter();

const handlePayment = async () => {
  
  const orderItems = cartData.cartItems.filter((item: any) => 
    selectedItems.includes(item.id)
  ).map((item: any) => ({
    "variantId": item.variant.id,
    "quantity": item.quantity
  }));

  const orderData = {
    "paymentMethodId": paymentMethod,
    "customerName": name,
    "customerEmail": userInfo?.email || "",
    "customerPhone": phone,
    "shippingAddress": address.detail,
    "shippingDistrict": address.district.districtName,
    "shippingWard": address.ward.wardName,
    "shippingCity": address.city.cityName,
    "note": note,
    "couponCode": discountCode,
    "items": orderItems
  };


  if(paymentMethod === 6 ) {
    const res = await createOrderWithPaymentMethod6_API(calculateTotalAfterDiscount(), userInfo?.id);
    console.log(res);
    if(res.status === 200) {
      try {
        const res = await createOrder_API(orderData , userInfo?.id);
        if (res.status === 200) {
          router.push(res.data); 
        } else {
          toast.error("Có lỗi xảy ra khi đặt hàng");
        }
      } catch (error) {
        console.error("Lỗi đặt hàng:", error);
        toast.error("Có lỗi xảy ra khi đặt hàng");
      }
    } else {
      toast.error("Có lỗi xảy ra khi đặt hàng");
    }
  } else {
    try {
      const res = await createOrder_API(orderData , userInfo?.id);
      if (res.status === 200) {
        toast.success("Đặt hàng thành công");
        router.push("/history-order"); 
      } else {
        toast.error("Có lỗi xảy ra khi đặt hàng");
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      toast.error("Có lỗi xảy ra khi đặt hàng");
    }
  }




  

  
  
}

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Chi tiết đơn hàng
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Thông tin người nhận */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="text-gray-600" size={18} />
              <span className="font-medium text-gray-900">Tên người nhận</span>
            </div>
            <Input
              placeholder="Nhập họ tên người nhận"
              variant="bordered"
              className="w-full"
              value={name}
              size="lg"
              radius="md"
              classNames={{
                input: "text-gray-900",
                inputWrapper: "border-gray-200 hover:border-gray-300 focus-within:border-gray-900"
              }}
              onChange={(e) => setName(e.target.value)}
            />
            
            <div className="flex items-center gap-2 mt-3">
              <Phone className="text-gray-600" size={18} />
              <span className="font-medium text-gray-900">Số điện thoại</span>
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
              <MapPin className="text-gray-600" size={18} />
              <span className="font-medium text-gray-900">Địa chỉ giao hàng</span>
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
                  input: "text-gray-900 resize-none",
                  inputWrapper: "border-gray-200 hover:border-gray-300 focus-within:border-gray-900"
                }}
              />
            </div>
          </div>
          
          {/* Ghi chú */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="text-gray-600" size={18} />
              <span className="font-medium text-gray-900">Ghi chú đơn hàng</span>
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
                input: "text-gray-900 resize-none",
                inputWrapper: "border-gray-200 hover:border-gray-300 focus-within:border-gray-900"
              }}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Mã giảm giá */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Gift className="text-gray-600" size={18} />
              <span className="font-medium text-gray-900">Mã giảm giá</span>
            </div>
            <Input
              placeholder="Nhập mã giảm giá (nếu có)"
              variant="bordered"
              className="w-full"
              size="lg"
              radius="md"
              classNames={{
                input: "text-gray-900",
                inputWrapper: "border-gray-200 hover:border-gray-300 focus-within:border-gray-900"
              }}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
          </div>

          {/* Chi tiết thanh toán */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Số lượng sản phẩm:</span>
                <span className="font-medium text-gray-900">{selectedItems.length}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tạm tính:</span>
                <FormatPrice
                  price={calculateTotal()}
                  className="font-medium text-gray-900"
                  currency="₫"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <FormatPrice 
                  price={feeShip} 
                  className="font-medium text-gray-900" 
                  currency="₫" 
                />
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Tổng thanh toán:</span>
                  <FormatPrice
                    price={calculateTotalAfterDiscount()}
                    className="text-lg font-bold text-gray-900"
                    currency="₫"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="space-y-3">
            <span className="font-medium text-gray-900">Chọn phương thức thanh toán</span>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="1"
                  checked={paymentMethod === 1}
                  onChange={() => setPaymentMethod(1)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  paymentMethod === 1 ? "border-gray-900" : "border-gray-300"
                }`}>
                  {paymentMethod === 1 && (
                    <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                  )}
                </div>
                <Wallet className="text-gray-600 mr-2" size={18} />
                <span className="text-gray-900">Thanh toán khi nhận hàng</span>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="6"
                  checked={paymentMethod === 6}
                  onChange={() => setPaymentMethod(6)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    paymentMethod === 6 ? "border-gray-900" : "border-gray-300"
                }`}>
                  {paymentMethod === 6 && (
                    <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                  )}
                </div>
                <CreditCard className="text-gray-600 mr-2" size={18} />
                <span className="text-gray-900">Thanh toán qua ví</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <button
              disabled={selectedItems.length === 0}
              className="w-full bg-gray-900 text-white py-3.5 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
              onClick={handlePayment}
              >
              Thanh toán
            </button>

            <button className="w-full text-gray-700 hover:text-gray-900 font-medium py-3 hover:bg-gray-50 rounded-lg transition-colors text-sm">
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}