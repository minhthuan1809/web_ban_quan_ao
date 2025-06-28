"use client"
import React, { useEffect, useState } from 'react';
import { Filter, Grid, List, Search } from 'lucide-react';
import { getProducts_API } from '@/app/_service/products';
import { Input, Select, SelectItem } from '@nextui-org/react';
import CardProduct from '@/app/components/CardProduct';  
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductGridSkeleton } from '../_skeleton';

export default function ProductsPage({filter} : {filter: any}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(16);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [sort, setSort] = useState("all");

  const sortOptions = [
    { value: "all", label: "Tất cả" },
    { value: "createdAt", label: "Mới nhất" },
    { value: "price", label: "Giá thấp → cao" },
    { value: "-price", label: "Giá cao → thấp" }
  ];

  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('search', searchTerm);
    router.push(`/products?${params.toString()}`);
  }, [searchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const defaultFilter = {
          categories: [],
          sizes: [],
          priceRange: [0, 5000000]
        };
        
        // Lấy categories từ URL
        const categoryParam = searchParams.get('category');
        let urlCategories: string[] = [];
        if (categoryParam) {
          urlCategories = categoryParam.split(',').filter(id => id.trim() !== '').map(id => id.trim());
        }
        
        const currentFilter = {
          ...defaultFilter,
          ...filter,
          // Ưu tiên categories từ URL
          categories: urlCategories.length > 0 ? urlCategories : (filter?.categories || [])
        };

        const res = await getProducts_API("", page, limit, currentFilter);
        if (res.status === 200) {
          let sortedProducts = [...res.data.data];
          
          if (sort === "price") {
            sortedProducts.sort((a: any, b: any) => a.price - b.price);
          } else if (sort === "-price") {
            sortedProducts.sort((a: any, b: any) => b.price - a.price);
          } else if (sort === "createdAt") {
            sortedProducts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          }
          
          setProducts(sortedProducts);
          setTotal((res.data as any).metadata?.total_page || 1);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeout);
  }, [page, limit, filter, searchParams, sort]);

  if (loading) {
    return <ProductGridSkeleton />;
  }

  return (
    <div className="min-h-screen">
      {/* Modern Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg sticky top-4 z-10 mb-6">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                size="lg"
                variant="bordered"
                radius="md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startContent={<Search size={18} className="text-blue-600 dark:text-blue-400" />}
                classNames={{
                  input: "text-gray-900 dark:text-gray-100",
                  inputWrapper: "border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 focus-within:border-blue-600 dark:focus-within:border-blue-400 bg-white dark:bg-gray-800"
                }}
              />
            </div>
            
            {/* Right side - Sort options */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:inline">Sắp xếp theo:</span>
              <Select
                size="lg"
                variant="bordered"
                defaultSelectedKeys={["all"]}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-[150px] sm:w-[200px]"
                aria-label="Sắp xếp sản phẩm"
                classNames={{
                  trigger: "border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-800",
                  value: "text-gray-900 dark:text-gray-100"
                }}
              >
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-2 sm:px-0">
        {/* Results info */}
        <div className="mb-6">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-gray-700/30">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Hiển thị <span className="font-bold text-blue-600 dark:text-blue-400">{products.length}</span> sản phẩm
              {searchTerm && (
                <span className="ml-2">
                  cho từ khóa "<span className="font-semibold text-gray-900 dark:text-gray-100">{searchTerm}</span>"
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">Không tìm thấy sản phẩm</h3>
            <p className="text-gray-600 dark:text-gray-400">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product: any) => (
              <CardProduct key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}