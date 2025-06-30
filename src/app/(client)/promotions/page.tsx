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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Gift className="w-12 h-12 text-primary" />
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold text-foreground">Đăng nhập để xem ưu đãi</h2>
              <p className="text-foreground/60 text-lg max-w-md">
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="w-24 h-24 bg-danger/10 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-danger" />
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Có lỗi xảy ra</h2>
              <p className="text-foreground/60">{error}</p>
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Mã giảm giá của bạn
            </h1>
          </div>
          <p className="text-foreground/60 text-lg">
            Sử dụng ngay những ưu đãi độc quyền dành cho bạn
          </p>
        </div>

        {/* Coupons Grid */}
        {coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 bg-content2 rounded-full flex items-center justify-center mb-6">
              <Gift className="w-12 h-12 text-foreground/40" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Chưa có mã giảm giá nào
            </h3>
            <p className="text-foreground/60 text-center mb-6 max-w-md">
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
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-content1 backdrop-blur-sm"
              >
                <CardHeader className="flex gap-3 bg-primary p-6">
                  <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                    {coupon.discountType === 'PERCENTAGE' ? (
                      <Percent className="w-6 h-6 text-primary-foreground" />
                    ) : (
                      <DollarSign className="w-6 h-6 text-primary-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col flex-1">
                    <p className="text-xl font-bold text-primary-foreground">{coupon.code}</p>
                    <p className="text-sm text-primary-foreground/80">{coupon.name}</p>
                  </div>
                  <Chip 
                    size="sm" 
                    variant="flat" 
                    className="bg-primary-foreground/20 text-primary-foreground"
                  >
                    Khuyến mãi
                  </Chip>
                </CardHeader>
                
                <CardBody className="p-6 space-y-4">
                  <p className="text-foreground/80 text-sm leading-relaxed">
                    {coupon.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                      <span className="text-sm text-foreground/60">Giá trị giảm:</span>
                      <span className="font-bold text-success">
                        {coupon.discountType === 'PERCENTAGE' 
                          ? `${coupon.discountValue}%` 
                          : formatCurrency(coupon.discountValue)}
                      </span>
                    </div>
                    
                    {coupon.minimumAmount && (
                      <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                        <span className="text-sm text-foreground/60">Đơn tối thiểu:</span>
                        <span className="font-semibold text-primary">
                          {formatCurrency(coupon.minimumAmount)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
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
        <div className="mt-12 bg-content1 backdrop-blur-sm rounded-2xl p-8 border border-divider">
          <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
            Hướng dẫn sử dụng mã giảm giá
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground">Bước 1</h4>
              <p className="text-sm text-foreground/60">Chọn sản phẩm yêu thích và thêm vào giỏ hàng</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <Gift className="w-6 h-6 text-secondary" />
              </div>
              <h4 className="font-semibold text-foreground">Bước 2</h4>
              <p className="text-sm text-foreground/60">Nhập mã giảm giá tại trang thanh toán</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <Percent className="w-6 h-6 text-success" />
              </div>
              <h4 className="font-semibold text-foreground">Bước 3</h4>
              <p className="text-sm text-foreground/60">Tận hưởng ưu đãi và hoàn tất đơn hàng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
