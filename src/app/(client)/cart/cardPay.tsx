import React, { useState } from "react";
import FormatPrice from "@/app/_util/FormatPrice";
import InputAddress from "@/app/components/ui/InputAddress";
import { Input, Textarea } from "@nextui-org/react";
import useAuthInfor from "@/app/customHooks/AuthInfor";
import { Gift, User, MapPin, CreditCard, Wallet } from "lucide-react";

interface CardPayProps {
  selectedItems: number[];
  calculateTotal: () => number;
}

export default function CardPay({
  selectedItems,
  calculateTotal,
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
  const [discountCode, setDiscountCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const calculateTotalAfterDiscount = () => {
    return calculateTotal() + feeShip - discount;
  };

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
              <span className="font-medium text-gray-900">Thông tin người nhận</span>
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
                  value="wallet"
                  checked={paymentMethod === "wallet"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  paymentMethod === "wallet" ? "border-gray-900" : "border-gray-300"
                }`}>
                  {paymentMethod === "wallet" && (
                    <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                  )}
                </div>
                <Wallet className="text-gray-600 mr-2" size={18} />
                <span className="text-gray-900">Thanh toán qua ví</span>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  paymentMethod === "card" ? "border-gray-900" : "border-gray-300"
                }`}>
                  {paymentMethod === "card" && (
                    <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                  )}
                </div>
                <CreditCard className="text-gray-600 mr-2" size={18} />
                <span className="text-gray-900">Thanh toán qua thẻ</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <button
              disabled={selectedItems.length === 0}
              className="w-full bg-gray-900 text-white py-3.5 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
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