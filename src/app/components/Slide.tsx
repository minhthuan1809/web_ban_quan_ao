"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

type Slide = {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
};

const slides = [
  {
    id: 1,
    imageUrl: "https://aobongdathietke.vn/wp-content/uploads/2020/12/banner-ao-bong-da-thiet-ke-1400x544.png",
    title: "Áo Bóng Đá Thiết Kế",
    description: "Tự hào mang đến những mẫu áo bóng đá độc đáo, chất lượng cao với thiết kế riêng theo yêu cầu",
  },
  {
    id: 2,
    imageUrl: "https://strivend.vn/wp-content/uploads/2023/03/BANNER-STRIVEND-1024x400.png",
    title: "Đồng Phục Bóng Đá Cao Cấp", 
    description: "Chất liệu thấm hút mồ hôi tốt, thoáng mát, phù hợp cho cả đội bóng của bạn",
  },
  {
    id: 3,
    imageUrl: "https://file.hstatic.net/200000247969/collection/bannerweb_26eb6815fd6d49cbb76835fd8db5ded7.jpg",
    title: "Áo Đấu Chuyên Nghiệp",
    description: "Đa dạng mẫu mã, màu sắc với công nghệ in ấn hiện đại, bền đẹp theo thời gian",
  },
];

export default function Slide() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    // Restart auto play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    // Restart auto play after 10 seconds  
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
    // Restart auto play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="w-full px-4 lg:px-2 py-2">
      <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] w-full rounded-lg overflow-hidden">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            
            {/* Slide content */}
            <div className="absolute bottom-8 left-8 text-white max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl mb-6 drop-shadow-md">
                {slide.description}
              </p>
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-300 shadow-lg">
                Khám phá ngay
              </button>
            </div>
          </div>
        ))}
        
        {/* Previous button - Large and easy to click */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all duration-300 border-2 border-white/20 hover:border-white/40"
          style={{ zIndex: 999 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next button - Large and easy to click */}
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-all duration-300 border-2 border-white/20 hover:border-white/40"
          style={{ zIndex: 999 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Dots navigation - Larger and easier to click */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3" style={{ zIndex: 999 }}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
                index === currentSlide 
                  ? 'bg-white border-white scale-125' 
                  : 'bg-white/40 border-white/60 hover:bg-white/70 hover:scale-110'
              }`}
            />
          ))}
        </div>

        {/* Status indicator */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
          {currentSlide + 1}/{slides.length} {!isAutoPlaying && '⏸️'}
        </div>
      </div>
    </div>
  );
}
