import React from 'react'
import { Card, CardBody, Skeleton } from '@nextui-org/react'

export default function EvaluateSkeleton() {
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

      {/* Rating overview */}
      <Card>
        <CardBody className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overall rating */}
            <div className="text-center space-y-3">
              <Skeleton className="w-16 h-16 rounded mx-auto" />
              <Skeleton className="w-24 h-6 rounded mx-auto" />
              <Skeleton className="w-32 h-4 rounded mx-auto" />
            </div>

            {/* Rating breakdown */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <Skeleton className="w-12 h-4 rounded" />
                  <Skeleton className="flex-1 h-2 rounded-full" />
                  <Skeleton className="w-8 h-4 rounded" />
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="w-24 h-4 rounded" />
                <Skeleton className="w-16 h-4 rounded" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="w-20 h-4 rounded" />
                <Skeleton className="w-12 h-4 rounded" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="w-28 h-4 rounded" />
                <Skeleton className="w-20 h-4 rounded" />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Reviews list */}
      <div className="space-y-4">
        {Array.from({length: 5}).map((_, index) => (
          <Card key={index}>
            <CardBody className="p-4 space-y-4">
              {/* Review header */}
              <div className="flex items-start gap-3">
                <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="w-32 h-5 rounded" />
                    <Skeleton className="w-20 h-4 rounded" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-20 h-4 rounded" />
                    <Skeleton className="w-24 h-4 rounded" />
                  </div>
                </div>
              </div>

              {/* Product info */}
              <div className="flex items-center gap-3 p-3 bg-content2 rounded-lg">
                <Skeleton className="w-12 h-12 rounded" />
                <div className="space-y-1">
                  <Skeleton className="w-48 h-4 rounded" />
                  <Skeleton className="w-32 h-3 rounded" />
                </div>
              </div>

              {/* Review content */}
              <div className="space-y-2">
                <Skeleton className="w-full h-4 rounded" />
                <Skeleton className="w-3/4 h-4 rounded" />
                <Skeleton className="w-1/2 h-4 rounded" />
              </div>

              {/* Review images */}
              <div className="flex gap-2">
                {Array.from({length: 3}).map((_, imgIndex) => (
                  <Skeleton key={imgIndex} className="w-16 h-16 rounded" />
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-3 border-t border-divider">
                <div className="flex gap-2">
                  <Skeleton className="w-16 h-6 rounded-full" />
                  <Skeleton className="w-20 h-6 rounded-full" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="w-8 h-8 rounded" />
                  <Skeleton className="w-8 h-8 rounded" />
                </div>
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