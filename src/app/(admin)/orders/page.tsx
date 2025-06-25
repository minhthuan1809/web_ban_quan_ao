"use client"
import React from 'react'
import OrderTable from './_components/OrderTable'
import { Card, CardBody } from '@nextui-org/react'
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function OrdersPage() {
  // Skeleton data cho các thống kê
  const orderStats = [
    {
      title: "Tổng đơn hàng",
      value: "---",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Chờ xác nhận", 
      value: "---",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Đã hoàn thành",
      value: "---", 
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Đã hủy",
      value: "---",
      icon: XCircle, 
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ]

  return (
    <div className="w-full space-y-6">
      {/* Thống kê đơn hàng */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {orderStats.map((stat, index) => (
          <Card key={index} className="w-full">
            <CardBody className="flex flex-row items-center gap-4 p-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-default-500">{stat.title}</span>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Bảng đơn hàng */}
      <OrderTable 
        title="Quản lý đơn hàng" 
        showStatusActions={true} 
        mode="confirm" 
      />
    </div>
  )
} 