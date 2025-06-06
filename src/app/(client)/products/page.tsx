"use client"
import React, { useState } from 'react'
import FilterProduct from './FilterProduct'
import ProductsPage from './ProductsPage'

export default function page() {
  const [filter, setFilter] = useState([])

  return (
    <div className='flex flex-col lg:flex-row max-w-full lg:max-w-[80%] md:gap-6 mx-auto min-h-screen mt-4 px-4 lg:px-0'>
          <div className='lg:mt-[5vh] w-full lg:w-auto'>
            <FilterProduct filter={filter} setFilter={setFilter} />
          </div>
          <div className='w-full flex-1'>
            <ProductsPage filter={filter} />
          </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'