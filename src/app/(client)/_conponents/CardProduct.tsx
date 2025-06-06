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
import Link from 'next/link';
import { formatCurrency } from "@/app/_util/formatCurrency";

type CardProductProps = {
  id: number;
  name: string;
  price: number;  
  image: string;
  description: string;
  status: string;
  Evaluate: number;
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'available':
    case 'có sẵn':
      return 'text-green-500 dark:text-green-400';
    case 'out of stock':
    case 'hết hàng':
      return 'text-red-500 dark:text-red-400';
    case 'limited':
    case 'giới hạn':
      return 'text-yellow-500 dark:text-yellow-400';
    default:
      return 'text-gray-500 dark:text-gray-400';
  }
};

export default function CardProduct({data = []} : {data: CardProductProps[]}) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400 dark:text-yellow-300">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400 dark:text-yellow-300">☆</span>);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300 dark:text-gray-600">★</span>);
    }
    
    return stars;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {data.map((product) => (
        <Link href={`/products/${product.id}`} key={product.id}>
          <div className="group relative bg-card hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden border border-border/50">
            <div className="aspect-square relative overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                {product.description}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-primary font-bold">
                  {formatCurrency(product.price)}
                </span>
                <span className={`text-sm ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
              </div>
              <div className="mt-2 flex items-center space-x-1">
                {renderStars(product.Evaluate)}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}