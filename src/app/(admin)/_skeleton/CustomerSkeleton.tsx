import React from 'react'
import { Card, CardBody, Skeleton } from '@nextui-org/react'

export default function CustomerSkeleton() {
  return (
    <div className="w-full space-y-4">
      {/* Header */}
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

      {/* Customer cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({length: 8}).map((_, index) => (
          <Card key={index}>
            <CardBody className="p-4 space-y-4">
              {/* Avatar và tên */}
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="w-full h-4 rounded" />
                  <Skeleton className="w-3/4 h-3 rounded" />
                </div>
              </div>

              {/* Thông tin */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="w-3/4 h-3 rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="w-2/3 h-3 rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="w-1/2 h-3 rounded" />
                </div>
              </div>

              {/* Thống kê */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-divider">
                <div className="text-center space-y-1">
                  <Skeleton className="w-full h-4 rounded" />
                  <Skeleton className="w-3/4 h-3 rounded mx-auto" />
                </div>
                <div className="text-center space-y-1">
                  <Skeleton className="w-full h-4 rounded" />
                  <Skeleton className="w-3/4 h-3 rounded mx-auto" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-2">
                <Skeleton className="w-8 h-8 rounded" />
                <Skeleton className="w-8 h-8 rounded" />
                <Skeleton className="w-8 h-8 rounded" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Skeleton className="w-64 h-10 rounded" />
      </div>
    </div>
  )
} 