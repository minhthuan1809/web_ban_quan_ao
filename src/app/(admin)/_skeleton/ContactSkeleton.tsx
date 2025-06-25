import React from 'react'
import { Card, CardBody, Skeleton } from '@nextui-org/react'

export default function ContactSkeleton() {
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

      {/* Tabs */}
      <Card>
        <CardBody className="p-0">
          <div className="flex border-b border-divider">
            <Skeleton className="w-32 h-12 rounded-none" />
            <Skeleton className="w-32 h-12 rounded-none" />
            <Skeleton className="w-32 h-12 rounded-none" />
          </div>
        </CardBody>
      </Card>

      {/* Contact list */}
      <div className="space-y-4">
        {Array.from({length: 6}).map((_, index) => (
          <Card key={index}>
            <CardBody className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Contact info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="w-1/3 h-5 rounded" />
                      <Skeleton className="w-1/2 h-4 rounded" />
                      <Skeleton className="w-1/4 h-4 rounded" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Skeleton className="w-20 h-4 rounded" />
                    <Skeleton className="w-full h-16 rounded" />
                  </div>
                </div>

                {/* Actions and status */}
                <div className="flex lg:flex-col items-center lg:items-end gap-3">
                  <Skeleton className="w-20 h-6 rounded-full" />
                  <div className="flex gap-2">
                    <Skeleton className="w-8 h-8 rounded" />
                    <Skeleton className="w-8 h-8 rounded" />
                    <Skeleton className="w-8 h-8 rounded" />
                  </div>
                </div>
              </div>

              {/* Footer info */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-divider">
                <Skeleton className="w-32 h-4 rounded" />
                <Skeleton className="w-24 h-4 rounded" />
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