import React from 'react'
import TableSkeleton from './TableSkeleton'

export default function SizeSkeleton() {
  return (
    <TableSkeleton 
      rows={6}
      columns={4}
      title="Quản lý kích thước"
      showSearch={true}
      showAddButton={true}
    />
  )
} 