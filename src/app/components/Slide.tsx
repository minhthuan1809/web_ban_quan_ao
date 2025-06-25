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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="w-full px-4 lg:px-2 py-2">
      <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] w-full rounded-lg overflow-hidden group">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              className="object-cover w-full h-full"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute bottom-4 sm:bottom-8 md:bottom-12 lg:bottom-20 left-4 sm:left-8 md:left-12 lg:left-20 text-white max-w-xl p-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-2 sm:mb-4">
                {slide.title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-8">
                {slide.description}
              </p>
              <button className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-white text-black rounded-full font-semibold hover:bg-opacity-90 transition-all duration-300 text-sm sm:text-base">
                Khám phá ngay
              </button>
            </div>
          </div>
        ))}
        
        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
