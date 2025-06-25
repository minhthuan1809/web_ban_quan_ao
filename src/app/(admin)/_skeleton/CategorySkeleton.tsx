import React from 'react'
import TableSkeleton from './TableSkeleton'

export default function CategorySkeleton() {
  return (
    <TableSkeleton 
      rows={6}
      columns={5}
      title="Quản lý danh mục"
      showSearch={true}
      showAddButton={true}
    />
  )
} 