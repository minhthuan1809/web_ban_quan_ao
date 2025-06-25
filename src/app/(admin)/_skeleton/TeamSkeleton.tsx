import React from 'react'
import { Card, CardBody, Skeleton } from '@nextui-org/react'

export default function TeamSkeleton() {
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

      {/* Team cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({length: 8}).map((_, index) => (
          <Card key={index}>
            <CardBody className="p-6 space-y-4 text-center">
              {/* Avatar */}
              <Skeleton className="w-20 h-20 rounded-full mx-auto" />
              
              {/* Name and role */}
              <div className="space-y-2">
                <Skeleton className="w-3/4 h-5 rounded mx-auto" />
                <Skeleton className="w-1/2 h-4 rounded mx-auto" />
              </div>

              {/* Contact info */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="w-32 h-3 rounded" />
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="w-24 h-3 rounded" />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <Skeleton className="w-full h-3 rounded" />
                <Skeleton className="w-3/4 h-3 rounded mx-auto" />
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1 justify-center">
                {Array.from({length: 3}).map((_, skillIndex) => (
                  <Skeleton key={skillIndex} className="w-16 h-5 rounded-full" />
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-center pt-2 border-t border-divider">
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