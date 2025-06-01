import CardProduct from '@/app/(admin)/_conponents/CardProduct'
import React from 'react'
import { mockDataProduct } from './mockdata'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface ProductCarouselProps {
  title?: string
  data?: any[]
  className?: string
  productsPerRow?: number
  rows?: number
  showNavigation?: boolean
  showPagination?: boolean
  autoHeight?: boolean
}

const DEFAULT_BREAKPOINTS = {
  320: { slidesPerView: 1, spaceBetween: 12 },
  480: { slidesPerView: 2, spaceBetween: 14 },
  768: { slidesPerView: 3, spaceBetween: 16 },
  1024: { slidesPerView: 4, spaceBetween: 18 },
  1280: { slidesPerView: 5, spaceBetween: 20 },
  1536: { slidesPerView: 6, spaceBetween: 24 }
}

export default function ProductCarousel({
  title = 'Sản phẩm liên quan',
  data = mockDataProduct,
  className = '',
  productsPerRow = 5,
  rows = 2,
  showNavigation = true,
  showPagination = false,
  autoHeight = true
}: ProductCarouselProps) {
  
  // Tính toán và lấy sản phẩm cần hiển thị
  const totalProductsToShow = productsPerRow * rows
  const displayProducts = data.slice(0, totalProductsToShow)
  
  // Chia sản phẩm thành các hàng
  const productRows = Array.from({ length: rows }, (_, rowIndex) => {
    const startIndex = rowIndex * productsPerRow
    const endIndex = startIndex + productsPerRow
    return displayProducts.slice(startIndex, endIndex)
  }).filter(row => row.length > 0) // Loại bỏ hàng trống

  // Cấu hình modules cho Swiper
  const swiperModules = [
    ...(showNavigation ? [Navigation] : []),
    ...(showPagination ? [Pagination] : [])
  ]

  if (!displayProducts.length) {
    return (
      <div className={`${className}`}>
        <h2 className="text-lg font-semibold mb-4 text-gray-900">{title}</h2>
        <p className="text-gray-500 text-center py-8">Không có sản phẩm nào để hiển thị</p>
      </div>
    )
  }

  return (
    <section className={`product-carousel ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 leading-tight">
          {title}
        </h2>
        <span className="text-sm text-gray-500">
          {displayProducts.length} sản phẩm
        </span>
      </div>

      {/* Product Rows */}
      <div className="space-y-6">
        {productRows.map((rowProducts, rowIndex) => (
          <div key={`row-${rowIndex}`} className="relative">
            <Swiper
              modules={swiperModules}
              navigation={showNavigation}
              pagination={showPagination ? { clickable: true } : false}
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={DEFAULT_BREAKPOINTS}
              autoHeight={autoHeight}
              grabCursor={true}
              className="product-swiper"
            >
              {rowProducts.map((product, productIndex) => (
                <SwiperSlide key={`${rowIndex}-${productIndex}`}>
                  <div className="h-full">
                    <CardProduct product={product} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .product-carousel :global(.swiper-button-next),
        .product-carousel :global(.swiper-button-prev) {
          color: #374151;
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          transition: all 0.2s ease;
        }
        
        .product-carousel :global(.swiper-button-next:hover),
        .product-carousel :global(.swiper-button-prev:hover) {
          background: #f9fafb;
          transform: scale(1.05);
          box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .product-carousel :global(.swiper-button-next::after),
        .product-carousel :global(.swiper-button-prev::after) {
          font-size: 16px;
          font-weight: 600;
        }
        
        .product-carousel :global(.swiper-pagination-bullet) {
          background: #d1d5db;
          opacity: 1;
        }
        
        .product-carousel :global(.swiper-pagination-bullet-active) {
          background: #374151;
        }
        
        .product-swiper {
          padding: 0 4px 40px 4px;
        }
      `}</style>
    </section>
  )
}