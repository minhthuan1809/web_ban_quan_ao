"use client"
import { getCouponById_API } from "@/app/_service/discount";
import useAuthInfor from "@/app/customHooks/AuthInfor";
import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Button, CardFooter, Chip } from "@nextui-org/react";
import { formatCurrency } from "@/app/_util/formatCurrency";
import Loading from "@/app/_util/Loading";
import { useRouter } from "next/navigation";
import { Gift, Calendar, ShoppingBag, Percent, DollarSign, AlertCircle } from "lucide-react";

export default function PagePromotions() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { user, accessToken } = useAuthInfor();
  const router = useRouter();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setError("");
        setLoading(true);
        
        if (!user?.id) {
          setLoading(false);
          return;
        }
        
        const res = await getCouponById_API(user.id.toString(), accessToken || undefined);
        
        if (res && res.data && res.data.content) {
          setCoupons(res.data.content);
        } else {
          setCoupons([]);
        }
      } catch (error: any) {
        console.error("Error fetching coupons:", error);
        setError(error.message || "Có lỗi xảy ra khi tải mã giảm giá");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCoupons();
  }, [user, accessToken]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Gift className="w-12 h-12 text-blue-600" />
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold text-gray-800">Đăng nhập để xem ưu đãi</h2>
              <p className="text-gray-600 text-lg max-w-md">
                Khám phá những mã giảm giá độc quyền dành riêng cho thành viên
              </p>
            </div>
            <Button 
              color="primary" 
              href="/login" 
              as="a" 
              size="lg"
              className="font-semibold px-8 py-6 text-lg"
              startContent={<Gift size={20} />}
            >
              Đăng nhập ngay
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">Có lỗi xảy ra</h2>
              <p className="text-gray-600">{error}</p>
            </div>
            <Button 
              color="primary" 
              variant="flat"
              onPress={() => window.location.reload()}
            >
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mã giảm giá của bạn
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Sử dụng ngay những ưu đãi độc quyền dành cho bạn
          </p>
        </div>

        {/* Coupons Grid */}
        {coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Gift className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Chưa có mã giảm giá nào
            </h3>
            <p className="text-gray-500 text-center mb-6 max-w-md">
              Bạn chưa có mã giảm giá nào. Hãy mua sắm thường xuyên để nhận những ưu đãi hấp dẫn!
            </p>
            <Button 
              color="primary"
              onPress={() => router.push('/products')}
              startContent={<ShoppingBag size={18} />}
            >
              Khám phá sản phẩm
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <Card 
                key={coupon.id} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm"
              >
                <CardHeader className="flex gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    {coupon.discountType === 'PERCENTAGE' ? (
                      <Percent className="w-6 h-6" />
                    ) : (
                      <DollarSign className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex flex-col flex-1">
                    <p className="text-xl font-bold">{coupon.code}</p>
                    <p className="text-sm text-white/80">{coupon.name}</p>
                  </div>
                  <Chip 
                    size="sm" 
                    variant="flat" 
                    className="bg-white/20 text-white"
                  >
                    Khuyến mãi
                  </Chip>
                </CardHeader>
                
                <CardBody className="p-6 space-y-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {coupon.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-gray-600">Giá trị giảm:</span>
                      <span className="font-bold text-green-600">
                        {coupon.discountType === 'PERCENTAGE' 
                          ? `${coupon.discountValue}%` 
                          : formatCurrency(coupon.discountValue)}
                      </span>
                    </div>
                    
                    {coupon.minimumAmount && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm text-gray-600">Đơn tối thiểu:</span>
                        <span className="font-semibold text-blue-600">
                          {formatCurrency(coupon.minimumAmount)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={16} />
                      <span>
                        Hết hạn: {new Date(coupon.validTo).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </CardBody>
                
                <CardFooter className="p-6 pt-0">
                  <Button 
                    color="primary"
                    className="w-full font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                    onPress={() => router.push('/products')}
                    startContent={<ShoppingBag size={18} />}
                  >
                    Dùng ngay
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Hướng dẫn sử dụng mã giảm giá
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-700">Bước 1</h4>
              <p className="text-sm text-gray-600">Chọn sản phẩm yêu thích và thêm vào giỏ hàng</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Gift className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-700">Bước 2</h4>
              <p className="text-sm text-gray-600">Nhập mã giảm giá tại trang thanh toán</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Percent className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-700">Bước 3</h4>
              <p className="text-sm text-gray-600">Tận hưởng ưu đãi và hoàn tất đơn hàng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
