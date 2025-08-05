"use client";
import { useEffect, useState } from 'react'
import useAuthInfor from '@/app/customHooks/AuthInfor'
import { Card, CardBody, CardHeader, Progress, Avatar, Chip, Tabs, Tab, Select, SelectItem, Skeleton } from '@nextui-org/react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package,
  Calendar,
  Eye,
  ShoppingCart,
  Star,
  Activity,
  BarChart3,
  PieChart,
  RefreshCw
} from 'lucide-react'
import { DashboardSkeleton as AdminDashboardSkeleton } from '../_skeleton'
import { 
  getDashboardSummary,
  getDailyRevenue,
  getMonthlyRevenue,
  getYearlyRevenue,
  getTopSellingProductsDaily,
  getTopSellingProductsMonthly,
  getTopSellingProductsYearly,
  getTopCustomers
} from '@/app/_service/dashboard'
import type { 
  DashboardSummaryResponse,
  RevenueStatResponse,
  ProductSalesResponse,
  UserStatResponse
} from '@/types/api'
import DateRangeFilter from '@/app/components/ui/DateRangeFilter'

type PeriodType = 'today' | 'month' | 'year';

interface DashboardStats {
  summary: DashboardSummaryResponse | null;
  dailyRevenue: RevenueStatResponse | null;
  monthlyRevenue: RevenueStatResponse | null;
  yearlyRevenue: RevenueStatResponse | null;
  topProductsDaily: ProductSalesResponse[];
  topProductsMonthly: ProductSalesResponse[];
  topProductsYearly: ProductSalesResponse[];
  topCustomers: UserStatResponse[];
}





export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    summary: null,
    dailyRevenue: null,
    monthlyRevenue: null,
    yearlyRevenue: null,
    topProductsDaily: [],
    topProductsMonthly: [],
    topProductsYearly: [],
    topCustomers: []
  })
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const { accessToken } = useAuthInfor()

  console.log(startDate, endDate);
  

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value)
  }

  const fetchAllStats = async () => {
    if (!accessToken) return;

    try {
      setLoading(true)
      
      // Parallel API calls for better performance
      const [
        summaryRes,
        dailyRevenueRes,
        monthlyRevenueRes,
        yearlyRevenueRes,
        topProductsDailyRes,
        topProductsMonthlyRes,
        topProductsYearlyRes,
        topCustomersRes
      ] = await Promise.allSettled([
        getDashboardSummary(accessToken, {
          startDate: startDate,
          endDate: endDate
        }),
        getDailyRevenue(startDate, endDate, accessToken),
        getMonthlyRevenue(startDate, endDate, accessToken),
        getYearlyRevenue(startDate, endDate, accessToken),
        getTopSellingProductsDaily(startDate, endDate, 5, accessToken),
        getTopSellingProductsMonthly(startDate, endDate, 5, accessToken),
        getTopSellingProductsYearly(startDate, endDate, 5, accessToken),
        getTopCustomers(startDate, endDate, 5, accessToken)
      ])

      setStats({
        summary: summaryRes.status === 'fulfilled' ? summaryRes.value : null,
        dailyRevenue: dailyRevenueRes.status === 'fulfilled' ? dailyRevenueRes.value : null,
        monthlyRevenue: monthlyRevenueRes.status === 'fulfilled' ? monthlyRevenueRes.value : null,
        yearlyRevenue: yearlyRevenueRes.status === 'fulfilled' ? yearlyRevenueRes.value : null,
        topProductsDaily: topProductsDailyRes.status === 'fulfilled' ? topProductsDailyRes.value : [],
        topProductsMonthly: topProductsMonthlyRes.status === 'fulfilled' ? topProductsMonthlyRes.value : [],
        topProductsYearly: topProductsYearlyRes.status === 'fulfilled' ? topProductsYearlyRes.value : [],
        topCustomers: topCustomersRes.status === 'fulfilled' ? topCustomersRes.value : []
      })

    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllStats()
  }, [accessToken, startDate, endDate])

  const getRevenueByPeriod = (): { revenue: number; orders: number; label: string } => {
    return {
      revenue: stats.dailyRevenue?.totalRevenue || stats.summary?.todayRevenue || 0,
      orders: stats.dailyRevenue?.totalOrders || stats.summary?.todayOrders || 0,
      label: 'Hôm nay'
    }
    } 

  const getTopProductsByPeriod = (): ProductSalesResponse[] => {
    return stats.topProductsDaily
  }

  const currentData = getRevenueByPeriod()  
  const currentTopProducts = getTopProductsByPeriod()

  // Show skeleton while loading
  if (loading) {
    return <AdminDashboardSkeleton />
  }

  const quickStats = [
    {
      title: "Doanh thu " + currentData.label.toLowerCase(),
      value: formatCurrency(currentData.revenue),
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      change: "+12%",
      changeType: "increase" as const
    },
    {
      title: "Đơn hàng " + currentData.label.toLowerCase(), 
      value: formatNumber(currentData.orders),
      icon: ShoppingBag,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      change: "+8%",
      changeType: "increase" as const
    },
    {
      title: "Khách hàng VIP",
      value: formatNumber(stats.topCustomers.length),
      icon: Users,
      color: "text-purple-500", 
      bgColor: "bg-purple-500/10",
      change: "+5%",
      changeType: "increase" as const
    },
    {
      title: "Sản phẩm bán chạy",
      value: formatNumber(currentTopProducts.length),
      icon: Package,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10", 
      change: "+3%",
      changeType: "increase" as const
    }
  ]



  return (
    <div className="p-6 space-y-8  mx-auto">
      {/* Header */}
     <DateRangeFilter
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      onReset={() => {}}
     />

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-content1">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground/60 mb-2">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mb-3">{stat.value}</p>
                    <div className="flex items-center space-x-2">
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                        stat.changeType === 'increase' ? 'bg-green-500/10' : 'bg-red-500/10'
                      }`}>
                        {stat.changeType === 'increase' ? (
                          <TrendingUp className="w-3 h-3 text-green-500" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                        <span className={`text-xs font-medium ${
                          stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                      <span className="text-xs text-foreground/50">vs kỳ trước</span>
                    </div>
                  </div>
                  <div className={`w-14 h-14 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>

      {/* Revenue Progress */}
      {stats.summary && (
        <Card className="border-none shadow-lg bg-content1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between w-full">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Tiến độ doanh thu năm {new Date().getFullYear()}</h3> 
                <p className="text-sm text-foreground/60">So sánh với mục tiêu đề ra</p>
              </div>
              <Chip color="primary" variant="flat" size="sm">
                {formatCurrency(stats.summary.yearRevenue)}
              </Chip>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground/60">Mục tiêu năm</span>
                <span className="font-medium text-foreground">10,000,000,000 ₫</span>
              </div>
              <Progress 
                value={(stats.summary.yearRevenue / 10000000000) * 100} 
                color="primary"
                size="lg"
                className="max-w-full"
              />
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">
                  Đã đạt {Math.round((stats.summary.yearRevenue / 10000000000) * 100)}%
                </span>
                <span className="text-foreground/60">
                  Còn lại {formatCurrency(10000000000 - stats.summary.yearRevenue)}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <Card className="border-none shadow-lg bg-content1">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Sản phẩm bán chạy {currentData.label.toLowerCase()}</h3>
                <p className="text-sm text-foreground/60">Top 5 sản phẩm có doanh số cao nhất</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            {currentTopProducts.length > 0 ? (
              <div className="space-y-4">
                {currentTopProducts.map((product, index) => (
                  <div key={product.productId} className="flex items-center space-x-4 p-4 bg-content2 rounded-xl hover:bg-content3 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{product.productName}</p>
                      <p className="text-sm text-foreground/60">
                        Đã bán: {formatNumber(product.totalQuantitySold)} sản phẩm
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-foreground">{formatCurrency(product.totalRevenue)}</p>
                      <Chip size="sm" color="primary" variant="flat">
                        {product.totalQuantitySold}
                      </Chip>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-foreground/40">
                <Package className="w-16 h-16 mb-4" />
                <p className="text-lg font-medium">Chưa có dữ liệu</p>
                <p className="text-sm">Sản phẩm bán chạy sẽ hiển thị tại đây</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Top Customers */}
        <Card className="border-none shadow-lg bg-content1">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Khách hàng VIP</h3>
                <p className="text-sm text-foreground/60">Top 5 khách hàng có chi tiêu cao nhất</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            {stats.topCustomers.length > 0 ? (
              <div className="space-y-4">
                {stats.topCustomers.map((customer, index) => (
                  <div key={customer.userId} className="flex items-center space-x-4 p-4 bg-content2 rounded-xl hover:bg-content3 transition-colors">
                    <Avatar 
                      name={customer.fullName.charAt(0).toUpperCase()}
                      className="w-12 h-12 bg-gradient-to-r from-primary to-secondary text-white font-bold"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{customer.fullName}</p>
                      <p className="text-sm text-foreground/60 truncate">{customer.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <ShoppingCart className="w-3 h-3 text-foreground/40" />
                        <span className="text-xs text-foreground/60">{customer.totalOrders} đơn hàng</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-foreground">{formatCurrency(customer.totalSpent)}</p>
                      <Chip size="sm" color="secondary" variant="flat">
                        Top {index + 1}
                      </Chip>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-foreground/40">
                <Users className="w-16 h-16 mb-4" />
                <p className="text-lg font-medium">Chưa có dữ liệu</p>
                <p className="text-sm">Khách hàng VIP sẽ hiển thị tại đây</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
