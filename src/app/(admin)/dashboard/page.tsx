"use client";
import { useEffect, useState } from 'react'
import { getDashboardStats } from '@/app/_service/dashboard'
import useAuthInfor from '@/app/customHooks/AuthInfor'
import { Card, CardBody } from '@nextui-org/react'
import { BadgeDelta, Metric, Text } from "@tremor/react"
import CardItemRevenue from './component/CardItemRevenue';
import GetIconComponent from '@/app/_util/Icon';

interface DashboardStats {
  todayRevenue: number;
  todayOrders: number;
  monthRevenue: number;
  monthOrders: number;
  yearRevenue: number;
  yearOrders: number;
  topProducts: Array<{
    productId: number;
    productName: string;
    totalQuantitySold: number;
    totalRevenue: number;
    period: string;
    periodType: string;
  }>;
  topCustomers: Array<{
    userId: number;
    fullName: string;
    email: string;
    totalSpent: number;
    totalOrders: number;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { accessToken } = useAuthInfor()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await getDashboardStats(accessToken)
        setStats(data)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    if (accessToken) {
      fetchStats()
    }
  }, [accessToken])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!stats) return null

  const revenueData = [
    { name: 'Hôm nay', value: stats.todayRevenue },
    { name: 'Tháng này', value: stats.monthRevenue },
    { name: 'Năm nay', value: stats.yearRevenue },
  ]

  const orderData = [
    { name: 'Hôm nay', value: stats.todayOrders },
    { name: 'Tháng này', value: stats.monthOrders },
    { name: 'Năm nay', value: stats.yearOrders },
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tổng doanh thu */}
        <CardItemRevenue 
          stats={stats.todayRevenue} 
          icon={{icon: "DollarSign", className: "w-6 h-6 text-primary"}} 
          title="Tổng doanh thu" 
          description="Tính theo ngày" 
        />

        {/* Đơn hàng */}
        <Card className="border-none shadow-md hover:shadow-xl transition-all duration-200 bg-content1">
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Text className="text-foreground/80 font-medium">Đơn hàng</Text>
            <Metric className="text-3xl font-bold text-foreground">
              {stats.todayOrders}
            </Metric>
            <div className="flex items-center mt-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                <GetIconComponent
                  icon={"ShoppingBag"}
                  className="w-4 h-4 text-primary"
                />
              </div>
              <Text className="text-sm text-foreground/60">Tính theo ngày</Text>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transform transition-transform duration-200 hover:scale-110">
            <GetIconComponent 
              icon={"ShoppingBag"} 
              className="w-6 h-6 text-primary"
            />
          </div>
        </div>
      </CardBody>
    </Card>

        {/* Doanh thu tháng */}
        <CardItemRevenue 
          stats={stats.monthRevenue} 
          icon={{icon: "TrendingUp", className: "w-6 h-6 text-primary"}} 
          title="Doanh thu tháng" 
          description="Tính theo tháng" 
        />

        {/* Đơn hàng tháng */}
        <CardItemRevenue 
          stats={stats.monthOrders} 
          icon={{icon: "Package", className: "w-6 h-6 text-primary"}} 
          title="Đơn hàng tháng" 
          description="Tính theo tháng" 
        />
     
        {/* Doanh thu theo năm */}
        <CardItemRevenue 
          stats={stats.yearRevenue} 
          icon={{icon: "BarChart", className: "w-6 h-6 text-primary"}} 
          title="Doanh thu theo năm" 
          description="Tính theo năm" 
        />

        {/* Đơn hàng theo năm */}
        <CardItemRevenue 
          stats={stats.yearOrders} 
          icon={{icon: "LineChart", className: "w-6 h-6 text-primary"}} 
          title="Đơn hàng theo năm" 
          description="Tính theo năm" 
        />
      </div>

      {/* Top Products and Customers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="border-none shadow-md bg-content1">
          <CardBody className="p-6">
            <Text className="text-xl font-semibold text-foreground mb-6">Top sản phẩm bán chạy</Text>
            {stats.topProducts.length > 0 ? (
              <div className="space-y-4">
                {stats.topProducts.map((product) => (
                  <div key={product.productId} className="flex justify-between items-center p-4 bg-content2 rounded-xl hover:bg-content3 transition-colors">
                    <div>
                      <Text className="font-medium text-foreground">{product.productName}</Text>
                      <Text className="text-sm text-foreground/60">
                        Đã bán: {product.totalQuantitySold} | Doanh thu: {formatCurrency(product.totalRevenue)}
                      </Text>
                    </div>
                    <BadgeDelta 
                      deltaType={product.totalQuantitySold > 0 ? "increase" : "unchanged"}
                      className="bg-primary/10 text-primary"
                    >
                      {product.totalQuantitySold}
                    </BadgeDelta>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-foreground/40">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <Text className="text-lg">Chưa có dữ liệu</Text>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Top Customers */}
        <Card className="border-none shadow-md bg-content1">
          <CardBody className="p-6">
            <Text className="text-xl font-semibold text-foreground mb-6">Top khách hàng</Text>
            {stats.topCustomers.length > 0 ? (
              <div className="space-y-4">
                {stats.topCustomers.map((customer) => (
                  <div key={customer.userId} className="flex justify-between items-center p-4 bg-content2 rounded-xl hover:bg-content3 transition-colors">
                    <div>
                      <Text className="font-medium text-foreground">{customer.fullName}</Text>
                      <Text className="text-sm text-foreground/60">
                        {customer.email}
                      </Text>
                      <Text className="text-sm text-foreground/60">
                        Tổng chi tiêu: {formatCurrency(customer.totalSpent)} | Số đơn hàng: {customer.totalOrders}
                      </Text>
                    </div>
                    <BadgeDelta 
                      deltaType={customer.totalOrders > 0 ? "increase" : "unchanged"}
                      className="bg-primary/10 text-primary"
                    >
                      {customer.totalOrders}
                    </BadgeDelta>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-foreground/40">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <Text className="text-lg">Chưa có dữ liệu</Text>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
