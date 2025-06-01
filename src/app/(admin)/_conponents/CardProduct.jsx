import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import formatVietNamese from '@/app/_util/FomatVietNamese';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};

const CardProduct = ({ product }) => {
  return (
    <div className="group bg-white rounded-lg hover:shadow-lg transition-all duration-300 overflow-hidden shadow-md">
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
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium shadow-sm">
                HOT
              </div>
            )}
            {product.price !== product.salePrice && (
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium shadow-sm">
                {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
              </div>
            )}
          </div>

          {/* Quick add to cart overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button className="bg-white text-gray-900 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              Xem chi tiết
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-2 sm:p-3">
        {/* Brand/Category */}
        <div className="mb-1">
          <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
            {product.team?.name || product.category?.name}
          </span>
        </div>

        {/* Product name */}
        <Link href={`/products/${formatVietNamese(product.name)}/${product.id}`} className="font-medium text-gray-900 text-sm sm:text-lg hover:underline cursor-pointer mb-1 sm:mb-2 line-clamp-2 leading-tight min-h-[2.5rem]">
          {product.name}
        </Link>

        {/* Price section */}
        <div className="flex flex-col gap-0.5 sm:gap-1">
          {product.price !== product.salePrice ? (
            <>
              <span className="text-sm sm:text-base font-bold text-red-600">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-sm sm:text-base font-bold text-red-600">
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
                className={`${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
              />
            ))}
            <span className="text-[10px] sm:text-xs text-gray-500 ml-0.5 sm:ml-1">(4.0)</span>
          </div>

          {/* Add to cart button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-sm font-medium shadow-sm transition-colors duration-200 flex items-center gap-0.5 sm:gap-1">
            <ShoppingCart size={12} />
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
