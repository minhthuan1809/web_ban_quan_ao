"use client"
import React, { useEffect, useState } from 'react';
import { Heart, Star, ShoppingCart, Filter, Grid, List } from 'lucide-react';
import { getProducts_API } from '@/app/_service/products';
import Loading from '@/app/_util/Loading';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(16); // Increased for compact cards
  const [sort, setSort] = useState("createdAt");
  const [filter, setFilter] = useState("asc");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getProducts_API("", page, limit, sort, filter);
        setProducts(res.data.data);
        setTotal(res.data.metadata.total_page);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, limit, sort, filter]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen ">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-end">
            {/* Right side - Sort options */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 hidden sm:inline">Sắp xếp</span>
              <select 
                className="px-2 sm:px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm w-full sm:w-auto"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="name">Phổ biến</option>
                <option value="createdAt">Mới nhất</option>
                <option value="price">Giá thấp → cao</option>
                <option value="-price">Giá cao → thấp</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Results info */}
        <div className="mb-4 sm:mb-6">
          <p className="text-sm text-gray-600">
            Hiển thị <span className="font-semibold">{products.length}</span> sản phẩm
          </p>
        </div>

        {/* Compact Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
          {products.map((product: any) => (
            <div key={product.id} className="group bg-white rounded-lg hover:shadow-lg transition-all duration-300 overflow-hidden shadow-md">
              {/* Compact Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.imageUrls?.[0] || '/api/placeholder/200/200'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Compact Badges */}
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

              {/* Compact Product Info */}
              <div className="p-2 sm:p-3">
                {/* Brand/Category */}
                <div className="mb-1">
                  <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                    {product.team?.name || product.category?.name}
                  </span>
                </div>

                {/* Product name */}
                <h3 className="font-medium text-gray-900 text-sm sm:text-lg hover:underline cursor-pointer mb-1 sm:mb-2 line-clamp-2 leading-tight min-h-[2.5rem]">
                  {product.name}
                </h3>

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
          ))}
        </div>

        {/* Modern Pagination */}
        {total > 1 && (
          <div className="flex justify-center mt-6 sm:mt-8">
            <div className="flex items-center gap-1 sm:gap-2 bg-white rounded-lg shadow-sm p-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                ← Trước
              </button>
              
              <div className="flex items-center gap-0.5 sm:gap-1">
                {Array.from({ length: Math.min(total, 5) }, (_, i) => {
                  let pageNum;
                  if (total <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= total - 2) {
                    pageNum = total - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm font-medium rounded-md transition-all duration-200
                        ${page === pageNum 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setPage(Math.min(total, page + 1))}
                disabled={page === total}
                className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Tiếp →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}