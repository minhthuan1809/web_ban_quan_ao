import React from 'react'
import { Card, CardBody, Skeleton } from '@nextui-org/react'

interface TableSkeletonProps {
  rows?: number
  columns?: number
  title?: string
  showSearch?: boolean
  showAddButton?: boolean
}

export default function TableSkeleton({ 
  rows = 8, 
  columns = 5, 
  title = "Đang tải...",
  showSearch = true,
  showAddButton = true 
}: TableSkeletonProps) {
  return (
    <div className="w-full space-y-4">
      {/* Header skeleton */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Skeleton className="w-48 h-8 rounded" />
            <div className="flex gap-2">
              {showSearch && <Skeleton className="w-64 h-10 rounded" />}
              {showAddButton && <Skeleton className="w-32 h-10 rounded" />}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Table skeleton */}
      <Card>
        <CardBody className="p-0">
          {/* Table header */}
          <div className="border-b border-divider p-4">
            <div className="grid gap-4" style={{gridTemplateColumns: `repeat(${columns}, 1fr)`}}>
              {Array.from({length: columns}).map((_, index) => (
                <Skeleton key={index} className="w-full h-4 rounded" />
              ))}
            </div>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-divider">
            {Array.from({length: rows}).map((_, rowIndex) => (
              <div key={rowIndex} className="p-4">
                <div className="grid gap-4" style={{gridTemplateColumns: `repeat(${columns}, 1fr)`}}>
                  {Array.from({length: columns}).map((_, colIndex) => (
                    <Skeleton 
                      key={colIndex} 
                      className={`h-4 rounded ${
                        colIndex === 0 ? 'w-3/4' : 
                        colIndex === columns - 1 ? 'w-1/2' : 'w-full'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Pagination skeleton */}
      <div className="flex justify-center">
        <Skeleton className="w-64 h-10 rounded" />
      </div>
    </div>
  )
} 