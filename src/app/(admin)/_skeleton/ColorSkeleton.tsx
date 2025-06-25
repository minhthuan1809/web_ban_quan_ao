import React from 'react'
import { Card, CardBody, Skeleton } from '@nextui-org/react'

export default function ColorSkeleton() {
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

      {/* Color grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({length: 12}).map((_, index) => (
          <Card key={index}>
            <CardBody className="p-4 space-y-3 text-center">
              <Skeleton className="w-16 h-16 rounded-full mx-auto" />
              <Skeleton className="w-full h-4 rounded" />
              <Skeleton className="w-3/4 h-3 rounded mx-auto" />
              <div className="flex gap-1 justify-center">
                <Skeleton className="w-6 h-6 rounded" />
                <Skeleton className="w-6 h-6 rounded" />
                <Skeleton className="w-6 h-6 rounded" />
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