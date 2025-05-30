import React from 'react'
import Category from './Category'
import Material from './Material'

export default function pageCategory_material() {
  return (
      <div className='flex flex-col md:flex-row justify-between gap-4 w-full'>
      <div className='w-full md:w-1/2 h-[calc(100vh-120px)] overflow-y-auto p-4 shadow-lg rounded-lg'>
        <Category />
      </div>
      <div className='hidden md:block w-[1px] bg-gray-200 h-[calc(100vh-120px)]'></div>
      <div className='w-full md:w-1/2 h-[calc(100vh-120px)] overflow-y-auto p-4 shadow-lg rounded-lg'>
        <Material />
      </div>
    </div>  
  )
}
