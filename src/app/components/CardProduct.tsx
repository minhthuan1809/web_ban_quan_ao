"use client"
import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import formatVietNamese from '@/app/_util/FomatVietNamese';
import { calculateDiscountedPrice } from '@/app/_util/CalculateCartPrice';
import { Button } from '@nextui-org/react';

const formatPrice = (price : number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};

const CardProduct = ({ product } : { product : any }  ) => {
  return (
    <div className="group bg-background rounded-lg hover:shadow-medium transition-all duration-300 overflow-hidden border border-border">
      {/* Product Image */}
      <Link href={`/products/${formatVietNamese(product.name)}/${product.id}`} className="relative aspect-square overflow-hidden">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.imageUrls?.[0] || '/api/placeholder/200/200'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-1 sm:top-2 left-1 sm:left-2 flex justify-between w-[95%] gap-1">
            {product.isFeatured && (
              <div className="bg-primary/90 text-primary-foreground px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium shadow-sm backdrop-blur-sm">
                HOT
              </div>
            )}
            {product.salePrice && product.salePrice > 0 && (
              <div className="bg-danger/90 text-danger-foreground px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium shadow-sm backdrop-blur-sm">
                {product.salePrice}%
              </div>
            )}
          </div>

          {/* Quick add to cart overlay */}
          <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <Button 
              size="sm" 
              variant="flat"
              className="bg-background/70 text-foreground font-medium transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            >
              Xem chi tiết
            </Button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-2 sm:p-3">
        {/* Brand/Category */}
        <div className="mb-1">
          <span className="text-[10px] sm:text-xs text-default-500 font-medium">
            {product.team?.name || product.category?.name}
          </span>
        </div>

        {/* Product name */}
        <Link href={`/products/${formatVietNamese(product.name)}/${product.id}`} className="font-medium text-foreground text-sm sm:text-lg hover:text-primary transition-colors cursor-pointer mb-1 sm:mb-2 line-clamp-2 leading-tight min-h-[2.5rem]">
          {product.name}
        </Link>

        {/* Price section */}
        <div className="flex flex-col gap-0.5 sm:gap-1">
          {product.salePrice && product.salePrice > 0 ? (
            <>
              <span className="text-sm sm:text-base font-bold text-danger">
                {formatPrice(calculateDiscountedPrice(product.price, product.salePrice))}
              </span>
              <span className="text-[10px] sm:text-xs text-default-400 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-sm sm:text-base font-bold text-danger">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Bottom section with rating and cart button */}
        <div className="flex items-center justify-between mt-1 sm:mt-2">
          {/* Rating stars */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={8} 
                className={`${i < 4 ? 'fill-warning text-warning' : 'text-default-200'}`}
              />
            ))}
            <span className="text-[10px] sm:text-xs text-default-500 ml-0.5 sm:ml-1">(4.0)</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CardProduct;
