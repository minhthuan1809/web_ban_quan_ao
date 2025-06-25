import React from 'react'
import { Card, CardBody, Skeleton } from '@nextui-org/react'

export default function ProductSkeleton() {
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
            <Skeleton className="w-32 h-10 rounded" />
            <Skeleton className="w-24 h-10 rounded" />
          </div>
        </CardBody>
      </Card>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({length: 8}).map((_, index) => (
          <Card key={index}>
            <CardBody className="p-4 space-y-3">
              <Skeleton className="w-full h-48 rounded-lg" />
              <Skeleton className="w-full h-4 rounded" />
              <Skeleton className="w-3/4 h-4 rounded" />
              <div className="flex justify-between items-center">
                <Skeleton className="w-1/2 h-5 rounded" />
                <Skeleton className="w-16 h-6 rounded-full" />
              </div>
              <div className="flex gap-2 justify-end">
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