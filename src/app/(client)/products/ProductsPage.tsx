"use client"
import React, { useEffect, useState } from 'react';
import { Filter, Grid, List, Search } from 'lucide-react';
import { getProducts_API } from '@/app/_service/products';
import Loading from '@/app/_util/Loading';
import { Input, Select, SelectItem } from '@nextui-org/react';
import CardProduct from '@/app/components/CardProduct';  
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductsPage({filter} : {filter: any}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
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
            sortedProducts.sort((a, b) => a.price - b.price);
          } else if (sort === "-price") {
            sortedProducts.sort((a, b) => b.price - a.price);
          } else if (sort === "createdAt") {
            sortedProducts.sort((a, b) => b.createdAt - a.createdAt);
          }
          
          setProducts(sortedProducts);
          setTotal(res.data.metadata.total_page);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timeout);
  }, [page, limit, filter, searchParams, sort]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen">
      {/* Modern Header */}
      <div className="bg-background/60 backdrop-blur-md border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Tìm kiếm sản phẩm"
                size="sm"
                variant="bordered"
                radius="sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startContent={<Search size={16} className="text-default-400" />}
                classNames={{
                  input: "text-default-700",
                  inputWrapper: "border-border"
                }}
              />
            </div>
            {/* Right side - Sort options */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-default-600 hidden sm:inline">Sắp xếp</span>
              <Select
                size="sm"
                variant="bordered"
                defaultSelectedKeys={["all"]}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-[140px] sm:w-[180px]"
                classNames={{
                  trigger: "border-border",
                  value: "text-default-700"
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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Results info */}
        <div className="mb-4 sm:mb-6">
          <p className="text-sm text-default-600">
            Hiển thị <span className="font-semibold text-foreground">{products.length}</span> sản phẩm
          </p>
        </div>

        {/* Compact Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
          {products.map((product: any) => (
            <CardProduct key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}