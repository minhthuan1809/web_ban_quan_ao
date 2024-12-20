"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Slide = {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
};
const slides = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    title: "Bộ sưu tập mùa hè",
    description: "Khám phá các xu hướng thời trang mới nhất",
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050",
    title: "Phong cách casual",
    description: "Thoải mái và năng động mọi lúc mọi nơi",
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b",
    title: "Thời trang công sở",
    description: "Lịch sự và chuyên nghiệp",
  },
];

export default function Slide() {
  return (
    <div className="w-full  px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="h-[600px] w-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h2 className="text-4xl md:text-6xl font-bold mb-4 text-center">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-xl text-center max-w-2xl px-4">
                    {slide.description}
                  </p>
                  <button className="mt-8 px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-opacity-90 transition-all duration-300">
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
