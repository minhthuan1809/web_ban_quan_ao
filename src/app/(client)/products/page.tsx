"use client"
import React, { useState } from 'react'
import FilterProduct from './FilterProduct'
import ProductsPage from './ProductsPage'

export default function page() {
  const [filter, setFilter] = useState([])

  return (
    <div className='min-h-screen bg-background'>
      <div className='flex flex-col lg:flex-row max-w-full lg:max-w-[85%] md:gap-6 mx-auto pt-6 px-4 lg:px-0'>
        <div className='lg:mt-[2vh] w-full lg:w-auto mb-6 lg:mb-0'>
          <FilterProduct filter={filter} setFilter={setFilter} />
        </div>
        <div className='w-full flex-1'>
          <ProductsPage filter={filter} />
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'