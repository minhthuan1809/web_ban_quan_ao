"use client"
import React from 'react';
import { Star } from 'lucide-react';
import Link from 'next/link';
import formatVietNamese from '@/app/_util/FomatVietNamese';
import { calculateDiscountedPrice } from '@/app/_util/CalculateCartPrice';
import { Button } from '@nextui-org/react';

const formatPrice = (price : number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};

const CardProduct = ({ product } : { product : any }  ) => {
  // Nếu sản phẩm không hoạt động, không hiển thị
  if (product.status === "INACTIVE") {
    return null;
  }

  // Tìm variant có priceAdjustment thấp nhất
  const minPriceAdjustment = React.useMemo(() => {
    if (!product?.variants?.length) return product.price;
    return Math.min(...product.variants.map((v: any) => v.priceAdjustment || 0));
  }, [product]);

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
          <div className="absolute top-1 left-1 flex justify-between w-[95%] gap-1">
            {product.isFeatured && (
              <div className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20">
                HOT
              </div>
            )}
            {product.salePrice && product.salePrice > 0 && (
              <div className="bg-green-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20">
                -{product.salePrice}%
              </div>
            )}
            {product.status === "INACTIVE" && (
              <div className="bg-gray-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20">
                Hết hàng
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
      <div className="p-3 border-t border-gray-200/50 dark:border-gray-600/50">
        {/* Brand/Category */}
        <div className="mb-2">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-700">
            {product.team?.name || product.category?.name}
          </span>
        </div>

        {/* Product name */}
        <Link href={`/products/${formatVietNamese(product.name)}/${product.id}`} className="block font-semibold text-gray-900 dark:text-gray-100 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer mb-2 line-clamp-2 leading-tight min-h-[2rem]">
          {product.name}
        </Link>

        {/* Price section */}
        <div className="flex flex-col gap-1 mb-2">
          {product.salePrice && product.salePrice > 0 ? (
            <>
              <span className="text-base font-bold text-red-600 dark:text-red-400">
                {formatPrice(minPriceAdjustment * (1 - product.salePrice/100))}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(minPriceAdjustment)}
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-red-600 dark:text-red-400">
              {formatPrice(minPriceAdjustment)}
            </span>
          )}
        </div>

        {/* Bottom section with rating */}
        <div className="flex items-center justify-center pt-2 border-t border-gray-100 dark:border-gray-700">
          {/* Rating stars */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={10} 
                className={`${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
              />
            ))}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 font-medium">(4.0)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
