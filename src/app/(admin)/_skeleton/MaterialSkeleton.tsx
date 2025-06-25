import React from 'react'
import TableSkeleton from './TableSkeleton'

export default function MaterialSkeleton() {
  return (
    <TableSkeleton 
      rows={6}
      columns={4}
      title="Quản lý chất liệu"
      showSearch={true}
      showAddButton={true}
    />
  )
} 