import React from 'react'
import { cn } from '@/app/_lib/utils'

interface LoadingProps {
  fullScreen?: boolean;
  className?: string;
}

export default function Loading({ fullScreen = true, className }: LoadingProps) {
  return (
    <div className={cn(
      "flex items-center justify-center",
      fullScreen && "min-h-screen bg-background",
      className
    )}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <p className="mt-6 text-lg font-medium text-foreground">Đang tải ...</p>
      </div>
    </div>
  )
}