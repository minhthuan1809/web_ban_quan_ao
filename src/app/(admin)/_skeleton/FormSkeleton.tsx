import React from 'react'
import { Card, CardBody, Skeleton } from '@nextui-org/react'

interface FormSkeletonProps {
  fields?: number
  showImageUpload?: boolean
  showTextEditor?: boolean
  columns?: 1 | 2
}

export default function FormSkeleton({ 
  fields = 6, 
  showImageUpload = false,
  showTextEditor = false,
  columns = 1 
}: FormSkeletonProps) {
  return (
    <Card className="w-full">
      <CardBody className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Skeleton className="w-1/3 h-8 rounded" />
          <div className="flex gap-2">
            <Skeleton className="w-20 h-10 rounded" />
            <Skeleton className="w-20 h-10 rounded" />
          </div>
        </div>

        {/* Image upload skeleton */}
        {showImageUpload && (
          <div className="space-y-2">
            <Skeleton className="w-32 h-4 rounded" />
            <div className="flex gap-4">
              {[1, 2, 3].map((index) => (
                <Skeleton key={index} className="w-24 h-24 rounded-lg" />
              ))}
              <Skeleton className="w-24 h-24 rounded-lg border-2 border-dashed" />
            </div>
          </div>
        )}

        {/* Form fields */}
        <div className={`grid gap-4 ${columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
          {Array.from({length: fields}).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="w-1/4 h-4 rounded" />
              <Skeleton className="w-full h-10 rounded" />
            </div>
          ))}
        </div>

        {/* Text editor skeleton */}
        {showTextEditor && (
          <div className="space-y-2">
            <Skeleton className="w-1/4 h-4 rounded" />
            <div className="space-y-2">
              <Skeleton className="w-full h-10 rounded" />
              <Skeleton className="w-full h-32 rounded" />
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t border-divider">
          <Skeleton className="w-20 h-10 rounded" />
          <Skeleton className="w-24 h-10 rounded" />
        </div>
      </CardBody>
    </Card>
  )
} 