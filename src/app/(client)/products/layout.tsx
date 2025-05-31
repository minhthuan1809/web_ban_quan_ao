import React from 'react'
import FilterProduct from './FilterProduct'
import { Metadata } from 'next'

interface LayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'Sản Phẩm',
    description: 'Sản Phẩm',
}   

export default function layout({children}: LayoutProps) {
  return (
    <div className='flex max-w-7xl gap-4 mx-auto h-screen'>
        <FilterProduct />
        <div className='w-full flex-1'>
            {children}
        </div>
    </div>
  )
}
