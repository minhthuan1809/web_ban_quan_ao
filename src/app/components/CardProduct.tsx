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
    <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl hover:shadow-xl dark:hover:shadow-gray-900/30 transition-all duration-300 overflow-hidden border-2 border-gray-200/60 dark:border-gray-600/60 hover:border-blue-300 dark:hover:border-blue-600">
      {/* Product Image */}
      <Link href={`/products/${formatVietNamese(product.name)}/${product.id}`} className="relative aspect-square overflow-hidden">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.imageUrls?.[0] || '/api/placeholder/200/200'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex justify-between w-[95%] gap-1">
            {product.isFeatured && (
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20">
                HOT
              </div>
            )}
            {product.salePrice && product.salePrice > 0 && (
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20">
                -{product.salePrice}%
              </div>
            )}
          </div>

          {/* Quick add to cart overlay */}
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <Button 
              size="md" 
              variant="solid"
              className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-semibold transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
            >
              Xem chi tiết
            </Button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 border-t border-gray-200/50 dark:border-gray-600/50">
        {/* Brand/Category */}
        <div className="mb-2">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full border border-blue-200 dark:border-blue-700">
            {product.team?.name || product.category?.name}
          </span>
        </div>

        {/* Product name */}
        <Link href={`/products/${formatVietNamese(product.name)}/${product.id}`} className="block font-semibold text-gray-900 dark:text-gray-100 text-base hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer mb-3 line-clamp-2 leading-tight min-h-[2.5rem]">
          {product.name}
        </Link>

        {/* Price section */}
        <div className="flex flex-col gap-1 mb-3">
          {product.salePrice && product.salePrice > 0 ? (
            <>
              <span className="text-lg font-bold text-red-600 dark:text-red-400">
                {formatPrice(calculateDiscountedPrice(product.price, product.salePrice))}
              </span>
              <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-red-600 dark:text-red-400">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Bottom section with rating */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          {/* Rating stars */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={12} 
                className={`${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
              />
            ))}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 font-medium">(4.0)</span>
          </div>

          {/* Add to cart button */}
          <button className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md border border-white/20">
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
