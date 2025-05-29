import React from 'react'
import Category from './Category'
import Material from './Material'

export default function pageCategory_material() {
  return (
    <div className='flex flex-row justify-between gap-4 w-full'>
      <div className='w-1/2 h-[calc(100vh-120px)] overflow-y-auto p-4 shadow-lg rounded-lg'>
        <Category />
      </div>
      <div className='w-[1px] bg-gray-200 h-[calc(100vh-120px)]'></div>
      <div className='w-1/2 h-[calc(100vh-120px)] overflow-y-auto p-4 shadow-lg rounded-lg'>
        <Material />
      </div>
    </div>  
  )
}
