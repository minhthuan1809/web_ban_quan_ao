'use client'
import { GetAllCode_API } from '@/app/_service/discount';
import React, { useEffect } from 'react'

export default function Code() {
  useEffect(() => {
    const fetchData = async () => {
      const res = await GetAllCode_API();
      console.log(res.data);
    }
    fetchData();
  }, []);
  return (
    <div>
        <h1>Code</h1>
    </div>  
  )
}
