"use client"
import Image from 'next/image';
import React from 'react'
import FormatPrice from '@/app/_util/FormatPrice';
import { 
  Card, 
  CardBody, 
  CardFooter,
  Button,
  Chip,
  Avatar
} from "@nextui-org/react";

type CardProductProps = {
  id: number;
  name: string;
  price: number;  
  image: string;
  description: string;
  status: string;
  Evaluate: number;
};

export default function CardProduct({data = []} : {data: CardProductProps[]}) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
      case 'có sẵn':
        return 'success';
      case 'out of stock':
      case 'hết hàng':
        return 'danger';
      case 'limited':
      case 'giới hạn':
        return 'warning';
      default:
        return 'default';
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }
    
    return stars;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {data?.map((item: CardProductProps, index: number) => (
        <Card 
          key={item.id || index} 
          className="group transition-transform duration-300"
          shadow="md"
          isPressable
          isHoverable
        >
          {/* Image Container */}
          <CardBody className="p-0 relative">
            <div className="relative overflow-hidden bg-gray-50 aspect-square">
              <Image 
                src={item.image} 
                alt={item.name} 
                fill
                className="object-cover w-full h-full  transition-transform duration-300"
              />
              
              {/* Status Badge */}
              <div className="absolute top-3 right-3 z-10">
                <Chip 
                  color={getStatusColor(item.status)}
                  size="sm"
                  variant="flat"
                >
                  {item.status}
                </Chip>
              </div>
              
              {/* Quick Action Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 flex items-center justify-center z-5">
                <Button 
                  color="primary" 
                  variant="solid"
                  size="sm"
                  className="opacity-0  transform translate-y-4 transition-all duration-300"
                >
                  Xem chi tiết
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Product Name */}
              <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2 transition-colors duration-200">
                {item.name}
              </h3>
              
              {/* Description */}
              <p className="text-default-500 text-sm mb-3 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
              
              {/* Rating */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {renderStars(item.Evaluate)}
                  </div>
                  <span className="text-sm text-default-400">({item.Evaluate})</span>
                </div>
                <div className="flex flex-col">
                  <FormatPrice price={item.price} className='text-danger  font-semibold'/>
                </div>
              </div>
            </div>
          </CardBody>
          
          {/* Footer with Action Button */}
          <CardFooter className="pt-0 px-4 pb-4">
            <Button 
              color="primary" 
              variant="solid"
              size="sm"
              fullWidth
              className="font-medium"
            >
              Thêm vào giỏ
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}