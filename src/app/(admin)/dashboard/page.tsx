"use client";
import { useEffect, useState } from 'react'
import { getDashboardStats } from '@/app/_service/dashboard'
import useAuthInfor from '@/app/customHooks/AuthInfor'
import { Card, CardBody } from '@nextui-org/react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { BadgeDelta, DeltaType, Grid, Metric, Text } from "@tremor/react"

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
        console.log("data", data)
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
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Today's Stats */}
        <Card>
          <CardBody>
            <div className="space-y-2">
              <Text>Doanh thu hôm nay</Text>
              <Metric>{formatCurrency(stats.todayRevenue)}</Metric>
              <Text>Đơn hàng: {stats.todayOrders}</Text>
            </div>
          </CardBody>
        </Card>

        {/* Month's Stats */}
        <Card>
          <CardBody>
            <div className="space-y-2">
              <Text>Doanh thu tháng này</Text>
              <Metric>{formatCurrency(stats.monthRevenue)}</Metric>
              <Text>Đơn hàng: {stats.monthOrders}</Text>
            </div>
          </CardBody>
        </Card>

        {/* Year's Stats */}
        <Card>
          <CardBody>
            <div className="space-y-2">
              <Text>Doanh thu năm nay</Text>
              <Metric>{formatCurrency(stats.yearRevenue)}</Metric>
              <Text>Đơn hàng: {stats.yearOrders}</Text>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardBody>
          <Text className="mb-4">Biểu đồ doanh thu</Text>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="value" name="Doanh thu" fill="#0070F0" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* Orders Chart */}
      <Card>
        <CardBody>
          <Text className="mb-4">Biểu đồ đơn hàng</Text>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" name="Số đơn hàng" stroke="#0070F0" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* Top Products */}
      <Card>
        <CardBody>
          <Text className="mb-4">Top sản phẩm bán chạy</Text>
          <div className="space-y-4">
            {stats.topProducts.map((product) => (
              <div key={product.productId} className="flex justify-between items-center">
                <div>
                  <Text>{product.productName}</Text>
                  <Text className="text-sm text-gray-500">
                    Đã bán: {product.totalQuantitySold} | Doanh thu: {formatCurrency(product.totalRevenue)}
                  </Text>
                </div>
                <BadgeDelta deltaType={product.totalQuantitySold > 0 ? "increase" : "unchanged"}>
                  {product.totalQuantitySold}
                </BadgeDelta>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Top Customers */}
      <Card>
        <CardBody>
          <Text className="mb-4">Top khách hàng</Text>
          <div className="space-y-4">
            {stats.topCustomers.map((customer) => (
              <div key={customer.userId} className="flex justify-between items-center">
                <div>
                  <Text>{customer.fullName}</Text>
                  <Text className="text-sm text-gray-500">
                    {customer.email}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Tổng chi tiêu: {formatCurrency(customer.totalSpent)} | Số đơn hàng: {customer.totalOrders}
                  </Text>
                </div>
                <BadgeDelta deltaType={customer.totalOrders > 0 ? "increase" : "unchanged"}>
                  {customer.totalOrders}
                </BadgeDelta>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
