"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Input } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";
import { useMediaQuery } from "@react-hook/media-query";

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
  const [isMobile, setIsMobile] = useState(false);
  const [swiperError, setSwiperError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simple responsive check
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Set loading to false after a brief delay
    const timer = setTimeout(() => setIsLoading(false), 1000);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full px-4 lg:px-2 py-2">
        <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] w-full bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
          <div className="text-gray-500">Đang tải slide...</div>
        </div>
      </div>
    );
  }

  // Fallback static slide nếu Swiper có lỗi
  if (swiperError) {
    return (
      <div className="w-full px-4 lg:px-2 py-2">
        <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] w-full">
          <Image
            src={slides[0].imageUrl}
            alt={slides[0].title}
            fill
            className="object-cover w-full h-full rounded-lg"
            priority
          />
          <div className="absolute inset-0 bg-black/40 rounded-lg" />
          <div className="absolute bottom-4 sm:bottom-8 md:bottom-12 lg:bottom-20 left-4 sm:left-8 md:left-12 lg:left-20 text-white max-w-xl p-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-2 sm:mb-4">
              {slides[0].title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-8">
              {slides[0].description}
            </p>
            <button className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-white text-black rounded-full font-semibold hover:bg-opacity-90 transition-all duration-300 text-sm sm:text-base">
              Khám phá ngay
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 lg:px-2 py-2">
      <div className="relative">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          navigation={isMobile ? false : true}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] w-full"
          onError={() => setSwiperError(true)}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  className="object-cover w-full h-full"
                  priority={slide.id === 1}
                  onError={(e) => {
                    console.error('Image load error:', e);
                    // Fallback image if needed
                  }}
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
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
