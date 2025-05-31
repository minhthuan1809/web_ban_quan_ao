import React from 'react'
import FilterProduct from './FilterProduct'
import ProductsPage from './ProductsPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sản Phẩm',
    description: 'Sản Phẩm',
}   

export default function page() {
  return (
    <div className='flex flex-col lg:flex-row max-w-full lg:max-w-[80%] md:gap-4 mx-auto min-h-screen mt-2 px-4 lg:px-0'>
          <div className='lg:mt-[5vh] w-full lg:w-auto'>
            <FilterProduct />
          </div>
          <div className='w-full flex-1'>
            <ProductsPage />
          </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'