import CardProduct from '@/app/components/CardProduct' 
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Grid } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/grid'

interface ProductCarouselProps {
  title?: string
  data?: any[]
  className?: string
  productsPerRow?: number
  rows?: number
}

export default function ProductCarousel({
  title = 'Sản phẩm liên quan',
  data = [],
  className = '',
  productsPerRow = 5,
  rows = 2,
}: ProductCarouselProps) {


  if (!data || !data.length) {
    return (
      <div className={`${className}`}>
        <h2 className="text-lg font-semibold mb-4 text-gray-900">{title}</h2>
        <p className="text-gray-500 text-center py-8">Không có sản phẩm nào để hiển thị</p>
      </div>
    )
  }

  return (
    <section className={`product-carousel ${className} relative`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 leading-tight">
          {title}
        </h2>
      </div>

      {/* Product Grid */}
      <Swiper
        modules={[Navigation, Pagination, Grid]}
        spaceBetween={24}
        slidesPerView={1}
        grid={{
          rows: rows,
          fill: 'row'
        }}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            grid: {
              rows: rows,
              fill: 'row'
            }
          },
          768: {
            slidesPerView: 3,
            grid: {
              rows: rows,
              fill: 'row'
            }
          },
          1024: {
            slidesPerView: 4,
            grid: {
              rows: rows,
              fill: 'row'
            }
          },
          1280: {
            slidesPerView: productsPerRow,
            grid: {
              rows: rows,
              fill: 'row'
            }
          },
        }}
        className="pb-12"
      >
        {data.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="transition-all duration-300 hover:scale-[1.02]">
              <CardProduct product={product} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Styles */}
      <style jsx>{`
        .product-carousel {
          padding: 0 4px 40px 4px;
        }
        :global(.swiper-button-next),
        :global(.swiper-button-prev) {
          color: #1a1a1a;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(4px);
          padding: 2rem;
          border-radius: 50%;
          transform: scale(0.5);
          transition: all 0.3s;
        }
        :global(.swiper-button-next:hover),
        :global(.swiper-button-prev:hover) {
          background: rgba(255, 255, 255, 0.9);
          transform: scale(0.55);
        }
        :global(.swiper-button-disabled) {
          opacity: 0.35;
          cursor: not-allowed;
        }
        :global(.swiper-pagination-bullet) {
          background: #1a1a1a;
          display: none;
        }
      `}</style>
    </section>
  )
}