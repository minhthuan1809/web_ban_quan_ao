'use client'
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryImgProps {
  productImageUrls: string[];
  onImageClick?: (url: string) => void;
}

export default function GalleryImg({ productImageUrls, onImageClick }: GalleryImgProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  const nextImage = () => {
    if (productImageUrls) {
      setSelectedImage((prev: number) => (prev + 1) % productImageUrls.length)
    }
  }

  const prevImage = () => {
    if (productImageUrls) {
      setSelectedImage((prev: number) => (prev - 1 + productImageUrls.length) % productImageUrls.length)
    }
  }

  const handleImageClick = (url: string) => {
    if (onImageClick) {
      onImageClick(url);
    }
  };

  return (
    <div className="space-y-4 border-b border-gray-200 p-2 flex flex-col-reverse md:flex-row">
      {/* Thumbnail sidebar */}
      <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 mt-2 md:mt-0 scrollbar-hide max-w-[calc(5*5rem)]">
        {productImageUrls.map((url: string, idx: number) => (
          <div 
            key={idx}
            className={`flex-shrink-0 w-20 h-20 rounded border-2 cursor-pointer overflow-hidden ${
              selectedImage === idx ? 'border-black' : 'border-gray-200'
            }`}
            onClick={() => {
              setSelectedImage(idx);
              handleImageClick(url);
            }}
          >
            <img src={url} alt={`Ảnh ${idx + 1}`} className="w-20 h-20 object-cover" />
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Desktop thumbnail sidebar */}
        <div className="hidden lg:flex flex-col gap-2 overflow-y-auto max-h-[calc(5*5rem)] scrollbar-hide">
          {productImageUrls.map((url: string, idx: number) => (
            <div 
              key={idx}
              className={`w-20 h-24 rounded border-2 cursor-pointer overflow-hidden flex-shrink-0 ${
                selectedImage === idx ? 'border-black' : 'border-gray-200'
              }`}
              onClick={() => {
                setSelectedImage(idx);
                handleImageClick(url);
              }}
            >
              <img src={url} alt={`Ảnh ${idx + 1}`} className="w-20 h-20 object-cover" />
            </div>
          ))}
        </div>

        {/* Main image */}
        <div className="flex-1 relative">
          <div className="w-[500px] h-[500px] bg-gray-100 rounded overflow-hidden">
            <img 
              src={productImageUrls[selectedImage]} 
              alt={`Ảnh ${selectedImage + 1}`}
              className="w-[500px] h-[500px] object-cover cursor-zoom-in"
              onClick={() => handleImageClick(productImageUrls[selectedImage])}
            />
          </div>
          
          {/* Image navigation arrows */}
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
