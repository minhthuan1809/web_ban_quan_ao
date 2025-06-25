import React from 'react'
import { Card, CardBody, Skeleton } from '@nextui-org/react'

export default function DiscountSkeleton() {
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

      {/* Filter bar */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-wrap gap-4">
            <Skeleton className="w-32 h-10 rounded" />
            <Skeleton className="w-32 h-10 rounded" />
            <Skeleton className="w-24 h-10 rounded" />
          </div>
        </CardBody>
      </Card>

      {/* Discount cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({length: 6}).map((_, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardBody className="p-6 space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="w-32 h-6 rounded" />
                  <Skeleton className="w-24 h-4 rounded" />
                </div>
                <Skeleton className="w-16 h-6 rounded-full" />
              </div>

              {/* Discount value */}
              <div className="text-center py-4">
                <Skeleton className="w-24 h-8 rounded mx-auto mb-2" />
                <Skeleton className="w-16 h-4 rounded mx-auto" />
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="w-20 h-4 rounded" />
                  <Skeleton className="w-24 h-4 rounded" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="w-24 h-4 rounded" />
                  <Skeleton className="w-20 h-4 rounded" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="w-16 h-4 rounded" />
                  <Skeleton className="w-12 h-4 rounded" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="w-20 h-3 rounded" />
                  <Skeleton className="w-16 h-3 rounded" />
                </div>
                <Skeleton className="w-full h-2 rounded-full" />
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-2 border-t border-divider">
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