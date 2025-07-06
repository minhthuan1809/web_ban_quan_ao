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
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('today')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedDay, setSelectedDay] = useState(new Date().getDate())
  const { accessToken } = useAuthInfor()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value)
  }

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  const today = formatDate(selectedYear, selectedMonth, selectedDay)

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
        getDashboardSummary(accessToken),
        getDailyRevenue(today, accessToken),
        getMonthlyRevenue(selectedYear, selectedMonth, accessToken),
        getYearlyRevenue(selectedYear, accessToken),
        getTopSellingProductsDaily(today, 5, accessToken),
        getTopSellingProductsMonthly(selectedYear, selectedMonth, 5, accessToken),
        getTopSellingProductsYearly(selectedYear, 5, accessToken),
        getTopCustomers(5, accessToken)
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
  }, [accessToken, selectedYear, selectedMonth, selectedDay])

  const getRevenueByPeriod = (): { revenue: number; orders: number; label: string } => {
    switch (selectedPeriod) {
      case 'today':
        return {
          revenue: stats.dailyRevenue?.totalRevenue || stats.summary?.todayRevenue || 0,
          orders: stats.dailyRevenue?.totalOrders || stats.summary?.todayOrders || 0,
          label: 'Hôm nay'
        }
      case 'month':
        return {
          revenue: stats.monthlyRevenue?.totalRevenue || stats.summary?.monthRevenue || 0,
          orders: stats.monthlyRevenue?.totalOrders || stats.summary?.monthOrders || 0,
          label: 'Tháng này'
        }
      case 'year':
        return {
          revenue: stats.yearlyRevenue?.totalRevenue || stats.summary?.yearRevenue || 0,
          orders: stats.yearlyRevenue?.totalOrders || stats.summary?.yearOrders || 0,
          label: 'Năm nay'
        }
      default:
        return { revenue: 0, orders: 0, label: '' }
    }
  }

  const getTopProductsByPeriod = (): ProductSalesResponse[] => {
    switch (selectedPeriod) {
      case 'today':
        return stats.topProductsDaily
      case 'month':
        return stats.topProductsMonthly
      case 'year':
        return stats.topProductsYearly
      default:
        return []
    }
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

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  
  // Tính số ngày trong tháng đã chọn
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  }
  
  const days = Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1)

  return (
    <div className="p-6 space-y-8  mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
     
        <div className="flex items-center space-x-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Năm</label>
              <Select
                size="sm"
                selectedKeys={[selectedYear.toString()]}
                onSelectionChange={(keys) => setSelectedYear(Number(Array.from(keys)[0]))}
                className="w-24"
                isDisabled={loading}
              >
                {years.map(year => (
                  <SelectItem key={year.toString()} value={year.toString()}>
                    {year.toString()}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Tháng</label>
              <Select
                size="sm"
                selectedKeys={[selectedMonth.toString()]}
                onSelectionChange={(keys) => setSelectedMonth(Number(Array.from(keys)[0]))}
                className="w-24"
                isDisabled={loading}
              >
                {months.map(month => (
                  <SelectItem key={month.toString()} value={month.toString()}>
                    {month.toString()}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">Ngày</label>
              <Select
                size="sm"
                selectedKeys={[selectedDay.toString()]}
                onSelectionChange={(keys) => setSelectedDay(Number(Array.from(keys)[0]))}
                className="w-24"
                isDisabled={loading}
              >
                {days.map(day => (
                  <SelectItem key={day.toString()} value={day.toString()}>
                    {day.toString()}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <button
            onClick={fetchAllStats}
            disabled={loading}
            className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 text-primary ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <Card className="border-none shadow-lg bg-content1">
        <CardBody className="p-6">
          <Tabs
            selectedKey={selectedPeriod}
            onSelectionChange={(key) => setSelectedPeriod(key as PeriodType)}
            color="primary"
            variant="underlined"
            isDisabled={loading}
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-primary",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-primary"
            }}
          >
            <Tab key="today" title={
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Hôm nay</span>
              </div>
            } />
          
          </Tabs>
        </CardBody>
      </Card>

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
                <h3 className="text-xl font-semibold text-foreground">Tiến độ doanh thu năm {selectedYear}</h3>
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
