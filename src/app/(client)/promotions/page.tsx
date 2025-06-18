"use client"
import { getCouponById_API } from "@/app/_service/discount";
import useAuthInfor from "@/app/customHooks/AuthInfor";
import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Button, CardFooter } from "@nextui-org/react";
import { formatCurrency } from "@/app/_util/formatCurrency";
import Loading from "@/app/_util/Loading";
import { useRouter } from "next/navigation";

export default function pagePromotions() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuthInfor();
  const router = useRouter();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        if (!userInfo?.id) {
          setLoading(false);
          return;
        }
        const res = await getCouponById_API(userInfo.id);
        setCoupons(res.data.content);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, [userInfo]);

  if (loading) {
    return <Loading />;
  }

  if (!userInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold text-blue-700">Vui lòng đăng nhập để xem mã giảm giá</h2>
        <Button color="primary" href="/login" as="a" className="bg-blue-500 hover:bg-blue-600">
          Đăng nhập ngay
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Mã giảm giá của bạn</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <Card key={coupon.id} className="border shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex gap-3 bg-blue-50 p-4">
              <div className="flex flex-col">
                <p className="text-xl font-bold text-blue-600">{coupon.code}</p>
                <p className="text-sm text-blue-500">{coupon.name}</p>
              </div>
            </CardHeader>
            <CardBody className="p-4">
              <div className="space-y-2">
                <p className="text-blue-700">{coupon.description}</p>
                <p className="font-semibold text-blue-600">
                  {coupon.discountType === 'PERCENTAGE' 
                    ? `Giảm ${coupon.discountValue}%` 
                    : `Giảm ${formatCurrency(coupon.discountValue)}`}
                </p>
                {coupon.minimumAmount && (
                  <p className="text-sm text-blue-500">
                    Đơn tối thiểu: {formatCurrency(coupon.minimumAmount)}
                  </p>
                )}
                <p className="text-sm text-blue-500">
                  Hiệu lực đến: {new Date(coupon.validTo).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </CardBody>
            <CardFooter>
              <Button color="primary" className="bg-blue-500 hover:bg-blue-600" onPress={() => {
                router.push(`/products`);
              }}>
                Dùng ngay
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
