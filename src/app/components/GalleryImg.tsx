'use client'
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryImgProps {
  productImageUrls: string[];
  onImageClick?: (url: string) => void;
}

export default function GalleryImg({ productImageUrls = [], onImageClick }: GalleryImgProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const defaultImage = '/default-product-image.jpg' // Ảnh mặc định khi không có ảnh

  const nextImage = () => {
    if (productImageUrls && productImageUrls.length > 0) {
      setSelectedImage((prev: number) => (prev + 1) % productImageUrls.length)
    }
  }

  const prevImage = () => {
    if (productImageUrls && productImageUrls.length > 0) {
      setSelectedImage((prev: number) => (prev - 1 + productImageUrls.length) % productImageUrls.length)
    }
  }

  const handleImageClick = (url: string) => {
    if (onImageClick) {
      onImageClick(url);
    }
  };

  // Nếu không có ảnh, hiển thị ảnh mặc định
  if (!productImageUrls || productImageUrls.length === 0) {
    return (
      <div className="relative w-full h-full">
        <div className="w-full h-full bg-gray-100 rounded overflow-hidden">
          <img 
            src={defaultImage}
            alt="Default product image"
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/500x500?text=No+Image';
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 w-full h-full">
      {/* Desktop thumbnail sidebar */}
      <div className="hidden md:flex flex-col gap-3 overflow-y-auto max-h-[500px] pr-2">
        {productImageUrls.map((url: string, idx: number) => (
          <div 
            key={idx}
            className={`w-20 h-20 rounded-lg border-2 cursor-pointer overflow-hidden ${
              selectedImage === idx ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => {
              setSelectedImage(idx);
            }}
          >
            <img 
              src={url} 
              alt={`Ảnh ${idx + 1}`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/80x80?text=Error';
              }}
            />
          </div>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 relative">
        <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden aspect-square">
          <img 
            src={productImageUrls[selectedImage]} 
            alt={`Ảnh ${selectedImage + 1}`}
            className="w-full h-full object-contain cursor-zoom-in"
            onClick={() => handleImageClick(productImageUrls[selectedImage])}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/500x500?text=Error';
            }}
          />
        </div>
        
        {/* Image navigation arrows */}
        {productImageUrls.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Mobile thumbnail carousel */}
      <div className="md:hidden flex gap-2 overflow-x-auto py-3 scrollbar-hide">
        {productImageUrls.map((url: string, idx: number) => (
          <div 
            key={idx}
            className={`flex-shrink-0 w-16 h-16 rounded-md border-2 cursor-pointer overflow-hidden ${
              selectedImage === idx ? 'border-primary' : 'border-gray-200'
            }`}
            onClick={() => {
              setSelectedImage(idx);
            }}
          >
            <img 
              src={url} 
              alt={`Ảnh ${idx + 1}`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/64x64?text=Error';
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
