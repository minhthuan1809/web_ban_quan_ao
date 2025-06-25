import React from 'react'
import { Card, CardBody, Skeleton } from '@nextui-org/react'

export default function DashboardSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Skeleton cho các card thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((index) => (
          <Card key={index} className="w-full">
            <CardBody className="flex flex-row items-center gap-4 p-4">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="w-3/4 h-4 rounded" />
                <Skeleton className="w-1/2 h-6 rounded" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Skeleton cho biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody className="p-6">
            <Skeleton className="w-1/3 h-6 rounded mb-4" />
            <Skeleton className="w-full h-64 rounded" />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-6">
            <Skeleton className="w-1/3 h-6 rounded mb-4" />
            <Skeleton className="w-full h-64 rounded" />
          </CardBody>
        </Card>
      </div>

      {/* Skeleton cho bảng dữ liệu */}
      <Card>
        <CardBody className="p-6">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="w-1/4 h-6 rounded" />
            <Skeleton className="w-32 h-10 rounded" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="flex items-center gap-4">
                <Skeleton className="w-8 h-8 rounded" />
                <Skeleton className="w-1/4 h-4 rounded" />
                <Skeleton className="w-1/4 h-4 rounded" />
                <Skeleton className="w-1/4 h-4 rounded" />
                <Skeleton className="w-1/6 h-4 rounded" />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
} 