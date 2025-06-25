import React from 'react'
import { Card, CardBody, Skeleton } from '@nextui-org/react'

export default function OrderSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Thống kê đơn hàng */}
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

      {/* Header bảng */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Skeleton className="w-48 h-8 rounded" />
            <div className="flex gap-2">
              <Skeleton className="w-64 h-10 rounded" />
              <Skeleton className="w-32 h-10 rounded" />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Bảng đơn hàng */}
      <Card>
        <CardBody className="p-0">
          {/* Header bảng */}
          <div className="border-b border-divider p-4">
            <div className="hidden md:grid grid-cols-6 gap-4">
              {Array.from({length: 6}).map((_, index) => (
                <Skeleton key={index} className="w-full h-4 rounded" />
              ))}
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-divider">
            {Array.from({length: 5}).map((_, rowIndex) => (
              <div key={rowIndex} className="p-4">
                {/* Desktop view */}
                <div className="hidden md:grid grid-cols-6 gap-4 items-center">
                  <Skeleton className="w-full h-4 rounded" />
                  <div className="space-y-1">
                    <Skeleton className="w-full h-4 rounded" />
                    <Skeleton className="w-3/4 h-3 rounded" />
                    <Skeleton className="w-1/2 h-3 rounded" />
                  </div>
                  <Skeleton className="w-full h-4 rounded" />
                  <Skeleton className="w-full h-4 rounded" />
                  <Skeleton className="w-16 h-6 rounded-full" />
                  <Skeleton className="w-8 h-8 rounded" />
                </div>

                {/* Mobile view */}
                <div className="md:hidden space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <Skeleton className="w-24 h-4 rounded" />
                      <Skeleton className="w-32 h-3 rounded" />
                    </div>
                    <Skeleton className="w-16 h-6 rounded-full" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="w-full h-3 rounded" />
                    <Skeleton className="w-3/4 h-3 rounded" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="w-24 h-4 rounded" />
                    <Skeleton className="w-8 h-8 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center">
        <Skeleton className="w-64 h-10 rounded" />
      </div>
    </div>
  )
} 